import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const MOODS = [
  { emoji: "😴", label: "Tired" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "🙂", label: "Okay" },
  { emoji: "😊", label: "Good" },
  { emoji: "🚀", label: "Productive" },
];

function formatHourLabel(hour: number): string {
  return new Date(2000, 0, 1, hour).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface NoteModalProps {
  open: boolean;
  hour: number;
  isSaving: boolean;
  onSave: (noteText: string, mood: string) => void;
  onClose: () => void;
}

export function NoteModal({
  open,
  hour,
  isSaving,
  onSave,
  onClose,
}: NoteModalProps) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSave(text.trim(), mood);
    setText("");
    setMood("");
  };

  const handleClose = () => {
    setText("");
    setMood("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          data-ocid="note.modal"
        >
          <motion.div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-[430px] bg-card rounded-t-3xl sm:rounded-3xl shadow-modal p-6 pb-8"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">⏰</span>
                  <h2 className="text-lg font-bold text-foreground">
                    It&apos;s {formatHourLabel(hour)}!
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  What did you accomplish this hour?
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1.5 hover:bg-muted transition-colors text-muted-foreground"
                data-ocid="note.close_button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Finished the design mockups for the landing page..."
              className="min-h-[120px] resize-none text-sm bg-secondary border-border focus-visible:ring-primary mb-4"
              data-ocid="note.textarea"
              autoFocus
            />

            <div className="mb-5">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                How was this hour?
              </p>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.emoji}
                    type="button"
                    onClick={() => setMood(m.emoji === mood ? "" : m.emoji)}
                    title={m.label}
                    className={`flex-1 py-2 rounded-xl text-xl transition-all border-2 ${
                      mood === m.emoji
                        ? "border-primary bg-accent scale-110"
                        : "border-border bg-secondary hover:border-primary/40"
                    }`}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || isSaving}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-12 font-semibold text-base mb-2"
              data-ocid="note.submit_button"
            >
              {isSaving ? "Saving..." : "Save Note"}
            </Button>
            <Button
              variant="ghost"
              onClick={handleClose}
              className="w-full text-muted-foreground hover:text-foreground"
              data-ocid="note.cancel_button"
            >
              Dismiss
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
