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

export function TemplatesDialog({ open, onClose, onSelectTemplate }: TemplatesDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    {
      id: "real-estate-classic",
      name: "Real Estate Classic",
      description: "Hero image with property details and gallery grid. Perfect for property listings.",
      category: "Real Estate",
      features: ["Hero image", "Property info", "Gallery grid"],
    },
    {
      id: "minimal-modern",
      name: "Minimal Modern",
      description: "Clean split layout with large image and elegant info card. Great for modern properties.",
      category: "Minimal",
      features: ["Split layout", "Info card", "Clean typography"],
    },
    {
      id: "bold-luxury",
      name: "Bold Luxury",
      description: "Magazine style design with overlay and dramatic styling. Ideal for luxury listings.",
      category: "Real Estate",
      features: ["Magazine style", "Overlay effects", "Bold typography"],
    },
  ]

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0 gap-0 bg-[#1f1f1f] border-zinc-700">
        <DialogHeader className="p-4 pb-3 border-b border-zinc-700">
          <DialogTitle className="flex items-center gap-2 text-white">
            <LayoutTemplate className="w-5 h-5 text-blue-500" />
            Choose a Template
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {templates.map((template) => (
              <button
                key={template.id}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedTemplate === template.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                }`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-zinc-400 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.features.map((feature) => (
                        <span key={feature} className="px-2 py-1 rounded text-xs bg-zinc-700 text-zinc-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center ml-3">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-zinc-700 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-zinc-700">
            Cancel
          </Button>
          <Button
            onClick={handleApplyTemplate}
            disabled={!selectedTemplate}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            Apply Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
