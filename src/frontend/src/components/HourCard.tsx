import { Trash2 } from "lucide-react";
import type { Note } from "../backend.d";

const MOOD_COLORS: Record<string, string> = {
  "😴": "text-blue-400",
  "😐": "text-gray-400",
  "🙂": "text-yellow-400",
  "😊": "text-green-400",
  "🚀": "text-primary",
};

function formatHourLabel(hour: number): string {
  return new Date(2000, 0, 1, hour).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function extractMood(noteText: string): { mood: string; text: string } {
  const moodEmojis = ["😴", "😐", "🙂", "😊", "🚀"];
  for (const emoji of moodEmojis) {
    if (noteText.startsWith(`${emoji} `)) {
      return { mood: emoji, text: noteText.slice(emoji.length + 1) };
    }
  }
  return { mood: "", text: noteText };
}

interface HourCardProps {
  note: Note;
  index: number;
  isDeleting?: boolean;
  onDelete: (noteId: bigint) => void;
}

export function HourCard({ note, index, isDeleting, onDelete }: HourCardProps) {
  const hour = Number(note.hour);
  const { mood, text } = extractMood(note.note);

  return (
    <div
      className="bg-card rounded-2xl shadow-card border border-border flex gap-3 p-4 animate-fade-in"
      data-ocid={`notes.item.${index}`}
    >
      <div className="w-1 rounded-full bg-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-primary uppercase tracking-wide">
            {formatHourLabel(hour)}
          </span>
          {mood && (
            <span className={`text-sm ${MOOD_COLORS[mood] ?? ""}`}>{mood}</span>
          )}
        </div>
        <p className="text-sm text-foreground leading-relaxed break-words">
          {text}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(note.noteId)}
        disabled={isDeleting}
        className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
        data-ocid={`notes.delete_button.${index}`}
        title="Delete note"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
