import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FaRegCircleCheck } from "react-icons/fa6"
import { AnimatePresence, motion } from "framer-motion"
import {
  ProjectIllustrationPreview,
  WORKFLOW_ILLUSTRATION_OPTIONS,
} from "@/components/projects/WorkflowIllustrations"
import { type WorkflowAppearance } from "@/utils/workflowAppearance"

type WorkflowAppearanceSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: WorkflowAppearance
  disabled?: boolean
  onSave: (next: WorkflowAppearance) => void
}

export default function WorkflowAppearanceSheet({
  open,
  onOpenChange,
  value,
  disabled,
  onSave,
}: WorkflowAppearanceSheetProps) {
  const [draft, setDraft] = useState<WorkflowAppearance>(value)

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (nextOpen) {
          setDraft(value)
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-110 sm:max-w-110 flex flex-col h-screen"
      >
        <SheetHeader>
          <SheetTitle>Workflow card settings</SheetTitle>
          <SheetDescription>
            Customize the card metadata shown on your Projects page.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 flex-1 min-h-0 overflow-hidden">
          <div className="flex h-full min-h-0 flex-1 flex-col gap-2">
            <label className="text-sm font-medium">Illustration</label>
            <ScrollArea className="min-h-0 flex-1 pr-2">
              <div className="grid grid-cols-1 gap-2">
                {WORKFLOW_ILLUSTRATION_OPTIONS.map((illustration) => {
                  const selected = draft.illustration === illustration.id

                  return (
                    <button
                      key={illustration.id}
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          illustration: illustration.id,
                        }))
                      }
                      className={
                        "relative rounded-lg border text-left transition-all " +
                        (selected
                          ? "border-2 border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-accent")
                      }
                    >
                      <AnimatePresence>
                        {selected ? (
                          <motion.span
                            key="selected-badge"
                            initial={{ opacity: 0, scale: 0.75, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.75, y: -4 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="bg-transparent absolute right-2 top-2 z-10 rounded-full border-none p-0.5 text-accent shadow-sm"
                            aria-hidden="true"
                          >
                            <FaRegCircleCheck className="h-4 w-4" />
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                      <div className="group h-20 overflow-hidden rounded-t-lg">
                        <ProjectIllustrationPreview
                          illustration={illustration.id}
                          className="h-full w-full"
                        />
                      </div>
                      <div
                        className={
                          "px-3 py-2 text-xs " +
                          (selected ? "text-accent" : "text-muted-foreground")
                        }
                      >
                        {illustration.label}
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <SheetFooter className="shrink-0">
          <Button
            className="rounded-md"
            variant={"secondary"}
            onClick={() => {
              setDraft(value)
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button
            className="rounded-md"
            variant={"default"}
            onClick={() => {
              onSave(draft)
              onOpenChange(false)
            }}
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
