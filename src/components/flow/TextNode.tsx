import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

// Define the data structure for text nodes
export interface TextNodeData {
  label: string;
  text: string;
}

export const TextNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as TextNodeData;

  return (
    <div 
      className={`
        bg-flow-node border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px]
        ${selected ? 'border-flow-node-selected shadow-md' : 'border-flow-node-border'}
        transition-all duration-200
      `}
    >
      {/* Target Handle - Can have multiple incoming connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-flow-handle border-2 border-white"
        style={{
          left: -6,
        }}
      />

      {/* Node Header */}
      <div className="flex items-center gap-2 p-3 border-b border-flow-node-border bg-primary/5 rounded-t-lg">
        <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
          <MessageSquare className="w-3 h-3 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground">{nodeData.label}</span>
      </div>

      {/* Node Content */}
      <div className="p-3">
        <div className="text-sm text-foreground leading-relaxed">
          {nodeData.text || 'Enter your message here...'}
        </div>
      </div>

      {/* Source Handle - Can only have one outgoing connection */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-flow-handle border-2 border-white"
        style={{
          right: -6,
        }}
      />
    </div>
  );
});

TextNode.displayName = 'TextNode';