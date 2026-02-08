# Script for running inference on the GNN for the purpose of embedding new papers / nodes
# whose abstracts are unknown but whose citation list is known.
# Also includes a test run in __main__ for a random chunk of the train graph. (not sure if this works anymore)

import torch
from torch_geometric.data import Data
from torch_geometric.utils import k_hop_subgraph
import numpy as np
from src.model import EmbedderGNNv3
from src.data_loader import load_ogbn_arxiv
from contextlib import contextmanager
from src.data_loader import unsafe_load_ogbn_arxiv
from src.hf_embed import get_semantic_embed

INPUT_DIM = 384   # 128 (Original) + 256 (Qwen)
HIDDEN_DIM = 256
OUTPUT_DIM = 256

device = torch.device("cpu")
if torch.cuda.is_available():
    device = torch.device("cuda")
elif torch.backends.mps.is_available():
    device = torch.device("mps")

# Load model
model = EmbedderGNNv3(INPUT_DIM, HIDDEN_DIM, OUTPUT_DIM, num_layers=4)
model.load_state_dict(torch.load("ml_pipeline/models/gnn_contrastive_v2.pth", map_location=device))
model.eval()

def get_cluster(data, center=None, num_neighbors=[10, 10, 5]):
    """Extract k-hop neighborhood with sampling. num_neighbors: list of ints per hop."""
    if center is None:
        center = np.random.randint(0, data.num_nodes)
    
    # Sample neighbors per hop (similar to NeighborLoader)
    all_nodes = {center}
    current_layer = {center}
    
    for n_sample in num_neighbors:
        next_layer = set()
        for node in current_layer:  # Only sample from current layer, not all nodes
            neighbors = data.edge_index[1, data.edge_index[0] == node].numpy()
            if len(neighbors) > n_sample:
                neighbors = np.random.choice(neighbors, n_sample, replace=False)
            next_layer.update(neighbors)
        all_nodes.update(next_layer)
        current_layer = next_layer  # Move to next layer
    
    subset = torch.tensor(sorted(all_nodes), dtype=torch.long)
    _, sub_edge_index, mapping, _ = k_hop_subgraph(subset, 0, data.edge_index, relabel_nodes=True, num_nodes=data.num_nodes)
    mapping = (subset == center).nonzero(as_tuple=True)[0].item()
    return Data(x=data.x[subset], edge_index=sub_edge_index, num_nodes=len(subset)), mapping, subset


def build_query_graph(base_graph, cited_node_ids, new_paper_embedding, num_neighbors=[10, 10, 5]):
    """
    This is what "adds" the new paper to the graph in preparation for inference.

    Given our entire graph, and a new paper's citation list,
    builds a new subgraph of the new paper's neighbourhood. 
    
    Args:
        base_graph: Full ogbn-arxiv graph (Data object)
        cited_node_ids: List of node IDs the new paper cites
        new_paper_embedding: Embedding vector for new paper (shape: [embed_dim])
        num_neighbors: Sampling strategy per hop
        
    Returns:
        subgraph_data, new_node_idx_in_subgraph, original_node_ids
    """
    # 1. Create extended graph with new node
    num_original_nodes = base_graph.num_nodes
    new_node_id = num_original_nodes  # New node ID
    
    # 2. Extend node features (add new paper's embedding)
    extended_x = torch.cat([
        base_graph.x,
        new_paper_embedding.unsqueeze(0)  # Add as new row
    ], dim=0)
    
    # 3. Create edges: new_node → cited_nodes
    new_edges = torch.tensor([
        [new_node_id] * len(cited_node_ids),  # Source: new node
        cited_node_ids                         # Target: cited papers
    ], dtype=torch.long)
    
    # 4. Extend edge_index
    extended_edge_index = torch.cat([
        base_graph.edge_index,
        new_edges
    ], dim=1)
    
    # 5. Create extended graph
    extended_graph = Data(
        x=extended_x,
        edge_index=extended_edge_index,
        num_nodes=num_original_nodes + 1
    )
    
    # 6. Sample neighborhood around new node
    subgraph, center_idx, orig_ids = get_cluster(
        extended_graph,
        center=new_node_id,
        num_neighbors=num_neighbors
    )
    
    return subgraph, center_idx, orig_ids


def run_gnn(graph, center_idx):
    """Run GNN inference. Optionally concatenate extra features via feature_fn."""
    with torch.no_grad():
        x = graph.x
        
        # Replace the center node's embedding with a placeholder before inference
        placeholder_embed = torch.zeros_like(x[center_idx]).unsqueeze(0)  # Shape: [1, embed_dim]
        x = x.clone()
        x[center_idx] = placeholder_embed

        extra_embed = get_semantic_embed(get_abstract(center_idx))  # Apply function to get extra features
        x = torch.cat([x, extra_embed], dim=-1)  # Concatenate along feature dim
        return model(x, graph.edge_index)

def endpoint(graph, citation_ids): 
    neighbourhood_graph, center_idx, orig_ids = build_query_graph(graph, citation_ids)
    embeddings = run_gnn(neighbourhood_graph, center_idx)
    return embeddings

if __name__ == "__main__":
    # Load data
    dataset = unsafe_load_ogbn_arxiv()
    graph_dict, labels = dataset[0]
    data = Data(
        x=torch.tensor(graph_dict['node_feat'], dtype=torch.float),
        edge_index=torch.tensor(graph_dict['edge_index'], dtype=torch.long),
        num_nodes=graph_dict['num_nodes']
    )
    
    # Get cluster and run inference
    cluster, center_idx, orig_ids = get_cluster(data, center=67, num_neighbors=[16, 8])
    embeddings = run_gnn(cluster, center_idx)
    print(f"Cluster: {cluster.num_nodes} nodes | Embeddings: {embeddings.shape}")