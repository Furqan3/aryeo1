"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutTemplate, Check } from "lucide-react"
import { useState } from "react"

interface TemplatesDialogProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string) => void
}

const templates = [
  { id: "real-estate-classic", name: "Real Estate Classic" },
  { id: "minimal-modern", name: "Minimal Modern" },
  { id: "bold-luxury", name: "Bold Luxury" },
]

export function TemplatesDialog({ open, onClose, onSelectTemplate }: TemplatesDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md flex flex-col p-0 gap-0 bg-[#1a1a1a] border-zinc-700">
        <DialogHeader className="p-5 pb-4 border-b border-zinc-700/50">
          <DialogTitle className="flex items-center gap-2 text-white text-lg">
            <LayoutTemplate className="w-5 h-5 text-blue-500" />
            Choose a Template
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] p-3">
          <div className="flex flex-col">
            {templates.map((template) => {
              const isSelected = selectedTemplate === template.id
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-md text-left transition-colors ${
                    isSelected
                      ? "bg-blue-500/15 text-blue-400"
                      : "text-zinc-200 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <span className="text-sm font-medium">{template.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              )
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-zinc-700/50 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-zinc-700">
            Cancel
          </Button>
          <Button
            onClick={handleApplyTemplate}
            disabled={!selectedTemplate}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 px-6"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
