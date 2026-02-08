# Usage: 
# 1. Load the embeddings (np.ndarray) into a faiss index using init_faiss
# 2. Call the endpoint get_nearest_neighbours to obtain top k nearest neighbours of a target embedding


import os
# Fix OpenMP conflict on macOS
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

import faiss
import numpy as np
import torch
import torch_geometric

index = None

def init_faiss(embeddings: np.ndarray) -> faiss.IndexFlatL2:
    global index
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)


def get_nearest_neighbours(target: np.ndarray, k: int = 10) -> list[int]:
    assert index is not None, "Initialize faiss index using init_faiss first"
    # Ensure target is 2D: reshape if needed
    if target.ndim == 1:
        target = target.reshape(1, -1)
    distances, indices = index.search(target, k)
    return indices[0].tolist()



if __name__ == "__main__": 
    embeddings = np.load("ml_pipeline/data/paper_embeddings_256d.npy")
    init_faiss(embeddings)
    print(get_nearest_neighbours(embeddings[67], k=10))