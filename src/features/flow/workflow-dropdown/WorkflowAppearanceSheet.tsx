import { useMemo, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"
import {
  WORKFLOW_PRESET_OPTIONS,
  WORKFLOW_PREVIEW_OPTIONS,
  type WorkflowAppearance,
} from "@/utils/workflowAppearance"

type WorkflowAppearanceSheetProps = {
  value: WorkflowAppearance
  disabled?: boolean
  onSave: (next: WorkflowAppearance) => void
}

export default function WorkflowAppearanceSheet({
  value,
  disabled,
  onSave,
}: WorkflowAppearanceSheetProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<WorkflowAppearance>(value)

  const selectedPresetId = useMemo(() => {
    const match = WORKFLOW_PRESET_OPTIONS.find(
      (preset) =>
        preset.gradient === draft.gradient && preset.tone === draft.tone,
    )

    return match?.id ?? "custom"
  }, [draft.gradient, draft.tone])

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setDraft(value)
        }
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="icon"
          size="icon"
          disabled={disabled}
          title="Workflow card style"
          className="h-10 w-10 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] text-[var(--text-secondary)] shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[440px] sm:max-w-[440px]">
        <SheetHeader>
          <SheetTitle>Workflow card settings</SheetTitle>
          <SheetDescription>
            Customize the card metadata shown on your Projects page.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tag</label>
            <Input
              value={draft.tag}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, tag: event.target.value }))
              }
              placeholder="NODE PIPELINE"
              maxLength={30}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preset</label>
            <Select
              value={selectedPresetId}
              onValueChange={(value) => {
                const selected = WORKFLOW_PRESET_OPTIONS.find(
                  (preset) => preset.id === value,
                )
                if (!selected) return

                setDraft((prev) => ({
                  ...prev,
                  gradient: selected.gradient,
                  tone: selected.tone,
                }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a style" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {WORKFLOW_PRESET_OPTIONS.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.id}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Preview shape</label>
            <Select
              value={draft.preview}
              onValueChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  preview: value as WorkflowAppearance["preview"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preview shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {WORKFLOW_PREVIEW_OPTIONS.map((preview) => (
                    <SelectItem key={preview} value={preview}>
                      {preview}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter>
          <Button
            onClick={() => {
              setDraft(value)
              setOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({ ...draft, tag: draft.tag.trim() || "NODE PIPELINE" })
              setOpen(false)
            }}
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
