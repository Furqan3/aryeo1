"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutTemplate, Check, Sparkles } from "lucide-react"
import { useState } from "react"

interface TemplatesDialogProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (templateId: string) => void
}

const templates = [
  {
    id: "real-estate-classic",
    name: "Real Estate Classic",
    description: "Split layout with hero image, gallery column, and stat cards. The go-to for property listings.",
    category: "Professional",
    features: ["Hero + gallery", "Stat cards", "Corner accents"],
    colors: ["#c0392b", "#d4a574", "#111827"],
  },
  {
    id: "minimal-modern",
    name: "Minimal Modern",
    description: "Clean split with large hero, elegant info section, and stat pills. Modern and understated.",
    category: "Minimal",
    features: ["Clean layout", "Stat pills", "Bottom gallery"],
    colors: ["#c0392b", "#c9a96e", "#111318"],
  },
  {
    id: "bold-luxury",
    name: "Bold Luxury",
    description: "Magazine-style with dramatic overlays, featured badge, and bold stat columns.",
    category: "Luxury",
    features: ["Featured badge", "Dual images", "Stat columns"],
    colors: ["#e74c3c", "#e8b923", "#0a1628"],
  },
  {
    id: "elegant-grid",
    name: "Elegant Grid",
    description: "4-image mosaic with a centered frosted glass info card. Perfect for showcasing multiple angles.",
    category: "Premium",
    features: ["2x2 mosaic", "Center card", "Diamond divider"],
    colors: ["#c9a96e", "#2ecc71", "#0e0e12"],
    isNew: true,
  },
  {
    id: "clean-listing",
    name: "Clean Listing",
    description: "Light theme with white cards, sage accents, and airy typography. Fresh and inviting.",
    category: "Light",
    features: ["Light theme", "Card stats", "Sage accent"],
    colors: ["#6b8f71", "#1a1a1a", "#f8f6f3"],
    isNew: true,
  },
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
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0 bg-[#1a1a1a] border-zinc-700">
        <DialogHeader className="p-5 pb-4 border-b border-zinc-700/50">
          <DialogTitle className="flex items-center gap-2 text-white text-lg">
            <LayoutTemplate className="w-5 h-5 text-blue-500" />
            Choose a Template
            <span className="text-xs text-zinc-500 font-normal ml-2">{templates.length} templates</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                  selectedTemplate === template.id
                    ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                    : "border-zinc-700/50 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/60"
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                {/* New badge */}
                {template.isNew && (
                  <span className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wide">
                    <Sparkles className="w-3 h-3" />
                    New
                  </span>
                )}

                {/* Color preview dots */}
                <div className="flex items-center gap-1.5 mb-3">
                  {template.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border border-zinc-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider ml-2">
                    {template.category}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1 text-sm">{template.name}</h3>
                    <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{template.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-700/60 text-zinc-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center ml-3 flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-zinc-700/50 flex items-center justify-between">
          <p className="text-xs text-zinc-500">Select a template to apply to your canvas</p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-zinc-700">
              Cancel
            </Button>
            <Button
              onClick={handleApplyTemplate}
              disabled={!selectedTemplate}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 px-6"
            >
              Apply Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
