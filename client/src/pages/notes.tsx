import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNote, useSaveNote } from "@/lib/queries";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  const { data: serverContent, isSuccess } = useNote();
  const saveNote = useSaveNote();
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (isSuccess && !hydrated.current) {
      hydrated.current = true;
      setDraft(serverContent ?? "");
    }
  }, [isSuccess, serverContent]);

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

  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl font-bold tracking-tight"
          >
            Notes
          </motion.h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {words} word{words === 1 ? "" : "s"} · autosaves as you type
          </p>
        </div>
        <span
          className={cn(
            "text-xs font-medium text-muted-foreground transition-opacity duration-300",
            saved ? "opacity-100" : "opacity-0"
          )}
        >
          Saved ✓
        </span>
      </div>

      <motion.textarea
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Write anything — ideas, plans, journal entries…"
        className={cn(
          "min-h-[60vh] w-full flex-1 resize-none rounded-xl border bg-card p-6 text-[15px] leading-relaxed outline-none",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200",
          "placeholder:text-muted-foreground focus:border-ring focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
        )}
      />
    </div>
  );
}
