import React from 'react';
import { MessageSquare } from 'lucide-react';

interface NodesPanelProps {
  onAddNode: (type: string, position: { x: number; y: number }) => void;
}

export function NodesPanel({ onAddNode }: NodesPanelProps) {
  // Handle drag start for draggable nodes
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle drop on canvas
  const handleAddNode = (nodeType: string) => {
    // Add node at center of canvas with some randomness to avoid overlap
    const position = {
      x: 250 + Math.random() * 200,
      y: 150 + Math.random() * 200,
    };
    onAddNode(nodeType, position);
  };

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Nodes Panel</h2>
        <p className="text-sm text-muted-foreground">
          Drag and drop nodes to build your chatbot flow
        </p>
      </div>

      <div className="space-y-4">
        {/* Text Message Node */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Messages</h3>
          
          <div
            className="flex items-center gap-3 p-4 bg-flow-node border border-flow-node-border rounded-lg cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, 'textNode')}
            onClick={() => handleAddNode('textNode')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAddNode('textNode');
              }
            }}
          >
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">Text Message</div>
              <div className="text-xs text-muted-foreground">
                Send a text message to the user
              </div>
            </div>
          </div>
        </div>

        {/* Future node types can be added here */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">More Coming Soon</h3>
          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
            Image messages, quick replies, and more node types will be added in future updates.
          </div>
        </div>
      </div>
    </div>
  );
}