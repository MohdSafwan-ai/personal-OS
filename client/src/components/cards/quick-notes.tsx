import { NotebookPen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DashCard } from "@/components/ui/dash-card";
import { useNote, useSaveNote } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function QuickNotesCard() {
  const { data: serverContent, isSuccess } = useNote();
  const saveNote = useSaveNote();
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const hydrated = useRef(false);

  // Hydrate the editor once from the server, then the user owns the draft.
  useEffect(() => {
    if (isSuccess && !hydrated.current) {
      hydrated.current = true;
      setDraft(serverContent ?? "");
    }
  }, [isSuccess, serverContent]);

  // Debounced autosave with a subtle "Saved" confirmation.
  useEffect(() => {
    if (!hydrated.current || draft === (serverContent ?? "")) return;
    const t = setTimeout(() => {
      saveNote.mutate(draft, { onSuccess: () => setSaved(true) });
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [saved]);

  return (
    <DashCard
      title="Quick Notes"
      icon={<NotebookPen className="h-4 w-4" />}
      action={
        <span
          className={cn(
            "text-[11px] font-medium text-muted-foreground transition-opacity duration-300",
            saved ? "opacity-100" : "opacity-0"
          )}
        >
          Saved ✓
        </span>
      }
      contentClassName="flex"
    >
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Jot something down — it autosaves…"
        className={cn(
          "min-h-[132px] w-full resize-none rounded-lg border bg-muted/40 p-3 text-sm leading-relaxed outline-none",
          "transition-all duration-200 placeholder:text-muted-foreground",
          "focus:border-ring focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
        )}
      />
    </DashCard>
  );
}
