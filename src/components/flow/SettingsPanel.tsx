import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SettingsPanelProps {
  node: Node;
  onUpdateNode: (nodeId: string, data: any) => void;
  onClose: () => void;
}

export function SettingsPanel({ node, onUpdateNode, onClose }: SettingsPanelProps) {
  const [text, setText] = useState((node.data as any)?.text || '');

  // Update local state when node changes
  useEffect(() => {
    setText((node.data as any)?.text || '');
  }, [node.data]);

  // Handle text change
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);
    onUpdateNode(node.id, { text: newText });
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1 h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Message Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your text message
          </p>
        </div>
      </div>

      {/* Node Info */}
      <div className="flex items-center gap-3 p-3 bg-flow-node border border-flow-node-border rounded-lg mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="font-medium text-sm">Text Message Node</div>
          <div className="text-xs text-muted-foreground">ID: {node.id}</div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <Label htmlFor="message-text">Message Text</Label>
          <Textarea
            id="message-text"
            placeholder="Enter the message you want to send to users..."
            value={text}
            onChange={handleTextChange}
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This text will be displayed to users when they reach this node.
          </p>
        </div>

        {/* Additional settings can be added here in the future */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Advanced Settings
          </Label>
          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
            Delays, conditions, and other advanced options will be available in future updates.
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-auto pt-4 border-t border-flow-panel-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Tips:</strong></p>
          <p>• Connect nodes by dragging from the blue dots</p>
          <p>• Each source can only have one connection</p>
          <p>• Targets can have multiple connections</p>
        </div>
      </div>
    </div>
  );
}