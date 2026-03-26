import type { Note } from "../backend.d";

function extractMood(noteText: string): { mood: string; text: string } {
  const moodEmojis = ["😴", "😐", "🙂", "😊", "🚀"];
  for (const emoji of moodEmojis) {
    if (noteText.startsWith(`${emoji} `)) {
      return { mood: emoji, text: noteText.slice(emoji.length + 1) };
    }
  }
  return { mood: "", text: noteText };
}

function formatHourLabel(hour: number): string {
  return new Date(2000, 0, 1, hour).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface DailySummaryProps {
  notes: Note[];
}

export function DailySummary({ notes }: DailySummaryProps) {
  if (notes.length === 0) {
    return (
      <div
        className="bg-accent/50 rounded-2xl p-5 text-center"
        data-ocid="summary.empty_state"
      >
        <p className="text-sm text-muted-foreground">
          No notes logged yet. Start tracking your hours!
        </p>
      </div>
    );
  }

  const sorted = [...notes].sort((a, b) => Number(a.hour) - Number(b.hour));
  const totalHours = notes.length;
  const moods = sorted.map((n) => extractMood(n.note).mood).filter(Boolean);
  const dominantMood = moods.length > 0 ? moods[moods.length - 1] : "";

  return (
    <div className="bg-accent/50 rounded-2xl p-5" data-ocid="summary.card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground">Daily Summary</h3>
        <div className="flex items-center gap-2">
          {dominantMood && <span className="text-lg">{dominantMood}</span>}
          <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
            {totalHours} {totalHours === 1 ? "hour" : "hours"}
          </span>
        </div>
      </div>
      <ul className="space-y-2">
        {sorted.map((note) => {
          const { mood, text } = extractMood(note.note);
          return (
            <li key={note.noteId.toString()} className="flex gap-2 text-sm">
              <span className="text-primary font-semibold flex-shrink-0 w-[60px]">
                {formatHourLabel(Number(note.hour))}
              </span>
              <span className="text-foreground flex-1">
                {mood && <span className="mr-1">{mood}</span>}
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
