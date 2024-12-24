"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABLE_ASSISTANTS } from "@/lib/constants";
import { Settings } from "lucide-react";

interface AssistantSelectorProps {
  currentAssistantId: string;
  onAssistantChange: (assistantId: string) => void;
}

export function AssistantSelector({ currentAssistantId, onAssistantChange }: AssistantSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium">Change Assistant</h4>
          <Select value={currentAssistantId} onValueChange={onAssistantChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select an assistant" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_ASSISTANTS.map((assistant) => (
                <SelectItem key={assistant.id} value={assistant.id}>
                  {assistant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}