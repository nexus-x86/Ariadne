import React, { useEffect, useRef } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import { useAuth0 } from '@auth0/auth0-react';

// Sample ML papers data
const papersData = [
  {
    id: 'transformer',
    label: 'Attention is All You Need',
    authors: 'Vaswani et al.',
    year: 2017,
    importance: 0.95,
    citations: 68000,
  },
  {
    id: 'bert',
    label: 'BERT: Pre-training of Deep Bidirectional',
    authors: 'Devlin et al.',
    year: 2018,
    importance: 0.92,
    citations: 45000,
  },
  {
    id: 'gpt',
    label: 'Language Models are Unsupervised Multitask',
    authors: 'Radford et al.',
    year: 2019,
    importance: 0.90,
    citations: 25000,
  },
  {
    id: 'resnet',
    label: 'Deep Residual Learning for Image Recognition',
    authors: 'He et al.',
    year: 2015,
    importance: 0.93,
    citations: 80000,
  },
  {
    id: 'vit',
    label: 'An Image is Worth 16x16 Words',
    authors: 'Dosovitskiy et al.',
    year: 2020,
    importance: 0.88,
    citations: 15000,
  },
  {
    id: 'diffusion',
    label: 'Denoising Diffusion Probabilistic Models',
    authors: 'Ho et al.',
    year: 2020,
    importance: 0.86,
    citations: 8000,
  },
  {
    id: 'gat',
    label: 'Graph Attention Networks',
    authors: 'Veličković et al.',
    year: 2017,
    importance: 0.82,
    citations: 5000,
  },
  {
    id: 'gcn',
    label: 'Semi-Supervised Classification with GCNs',
    authors: 'Kipf & Welling',
    year: 2016,
    importance: 0.84,
    citations: 12000,
  },
  {
    id: 'attention',
    label: 'Effective Approaches to Attention-based NMT',
    authors: 'Luong et al.',
    year: 2015,
    importance: 0.80,
    citations: 18000,
  },
  {
    id: 'unet',
    label: 'U-Net: Convolutional Networks for Biomedical Image Segmentation',
    authors: 'Ronneberger et al.',
    year: 2015,
    importance: 0.87,
    citations: 25000,
  },
];

// Citation relationships (edges)
const citations = [
  { source: 'bert', target: 'transformer' },
  { source: 'gpt', target: 'transformer' },
  { source: 'vit', target: 'transformer' },
  { source: 'vit', target: 'resnet' },
  { source: 'diffusion', target: 'gat' },
  { source: 'gat', target: 'gcn' },
  { source: 'gcn', target: 'attention' },
  { source: 'bert', target: 'attention' },
  { source: 'unet', target: 'resnet' },
  { source: 'gpt', target: 'bert' },
  { source: 'diffusion', target: 'transformer' },
];

const MLVisualization: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<Sigma | null>(null);
  const { user } = useAuth0();

  useEffect(() => {
    if (!containerRef.current) return;

    // Create graph
    const graph = new Graph();

    // Add nodes (papers)
    papersData.forEach((paper) => {
      graph.addNode(paper.id, {
        label: paper.label,
        size: 15 + paper.importance * 20,
        color: `hsl(${200 + paper.year % 60}, ${70 + paper.citations / 1000}%, 50%)`,
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    });

    // Add edges (citations)
    citations.forEach((citation, index) => {
      graph.addEdgeWithKey(`edge_${index}`, citation.source, citation.target);
    });

    // Initialize Sigma
    sigmaRef.current = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: false,
      defaultNodeColor: '#ffffff',
      defaultEdgeColor: '#ffffff',
      labelDensity: 0.25,
      labelRenderedSizeThreshold: 6,
      labelFont: 'Inter, sans-serif',
    });

    return () => {
      sigmaRef.current?.kill();
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="text-center animate-slide-in-down">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          ML Papers Universe
        </h1>
        <p className="text-lg text-white font-normal">
          {user?.name ? `Welcome, ${user.name}!` : 'Explore'} — Interactive visualization of influential machine learning papers
        </p>
      </div>
      <div
        ref={containerRef}
        className="animate-fade-in w-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        style={{
          height: 'calc(100vh - 200px)',
          background: 'linear-gradient(135deg, #389cff 0%, #1a1f2e 100%)',
        }}
      />
      <div className="text-center p-6 bg-slate-800/40 rounded-xl border border-blue-400/20 text-[0.95rem] text-white backdrop-blur-md">
        <p>💡 Hover over a paper to explore | Node size = importance | Colors = year & citation count</p>
      </div>
    </div>
  );
};

export default MLVisualization;
