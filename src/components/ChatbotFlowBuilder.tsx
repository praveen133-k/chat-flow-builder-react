import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { NodesPanel } from './flow/NodesPanel';
import { SettingsPanel } from './flow/SettingsPanel';
import { TextNode } from './flow/TextNode';

// Custom node types for the flow
const nodeTypes: NodeTypes = {
  textNode: TextNode,
};

// Initial empty state
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export function ChatbotFlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { toast } = useToast();

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      // Validate source handle - only one edge per source
      const sourceEdgeExists = edges.some(
        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );
      
      if (sourceEdgeExists) {
        toast({
          title: "Connection Error",
          description: "Each source handle can only have one outgoing connection.",
          variant: "destructive",
        });
        return;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges, toast]
  );

  // Handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle clicking on canvas to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update node data when edited in settings panel
  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, [setNodes]);

  // Add new node to canvas
  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'textNode',
      position,
      data: { 
        label: 'Text Message',
        text: 'Enter your message here...' 
      },
    };
    
    setNodes((nodes) => [...nodes, newNode]);
  }, [setNodes]);

  // Save function with validation
  const handleSave = useCallback(() => {
    // Check if there are more than one nodes
    if (nodes.length <= 1) {
      toast({
        title: "Flow Saved",
        description: "Your chatbot flow has been saved successfully!",
      });
      return;
    }

    // Find nodes without incoming edges (empty target handles)
    const nodesWithoutIncomingEdges = nodes.filter((node) => {
      return !edges.some((edge) => edge.target === node.id);
    });

    // Error if more than one node has no incoming edges
    if (nodesWithoutIncomingEdges.length > 1) {
      toast({
        title: "Save Error",
        description: "Cannot save flow: More than one node has empty target handles.",
        variant: "destructive",
      });
      return;
    }

    // Success - save the flow
    toast({
      title: "Flow Saved",
      description: "Your chatbot flow has been saved successfully!",
    });
    
    // Here you would typically send the flow data to your backend
    console.log('Saving flow:', { nodes, edges });
  }, [nodes, edges, toast]);

  // Show settings panel if node is selected, otherwise show nodes panel
  const sidePanel = selectedNode ? (
    <SettingsPanel 
      node={selectedNode} 
      onUpdateNode={updateNodeData}
      onClose={() => setSelectedNode(null)}
    />
  ) : (
    <NodesPanel onAddNode={addNode} />
  );

  return (
    <div className="h-screen flex bg-flow-canvas">
      {/* Side Panel */}
      <div className="w-80 bg-flow-panel border-r border-flow-panel-border flex flex-col">
        {sidePanel}
      </div>

      {/* Main Flow Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Save Button */}
        <div className="h-16 bg-flow-panel border-b border-flow-panel-border flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Chatbot Flow Builder</h1>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              color="hsl(var(--flow-edge))"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}