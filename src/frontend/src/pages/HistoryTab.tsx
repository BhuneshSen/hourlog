import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { DailySummary } from "../components/DailySummary";
import { HourCard } from "../components/HourCard";
import { useDeleteNote, useNotesByDate } from "../hooks/useQueries";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function HistoryTab() {
  const [selectedDate, setSelectedDate] = useState(() =>
    formatDate(new Date()),
  );
  const { data: notes = [], isLoading } = useNotesByDate(selectedDate);
  const deleteNote = useDeleteNote();

  const handleDelete = async (noteId: bigint) => {
    try {
      await deleteNote.mutateAsync(noteId);
      toast.success("Note deleted");
    } catch (_) {
      toast.error("Failed to delete note");
    }
  };

  const sorted = [...notes].sort((a, b) => Number(a.hour) - Number(b.hour));

  return (
    <div className="flex flex-col gap-5" data-ocid="history.page">
      <div className="bg-card rounded-2xl shadow-card border border-border p-5">
        <label
          htmlFor="history-date"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2"
        >
          Select Date
        </label>
        <input
          id="history-date"
          type="date"
          value={selectedDate}
          max={formatDate(new Date())}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          data-ocid="history.input"
        />
        {selectedDate && (
          <p className="mt-2 text-sm font-medium text-foreground">
            {formatDisplayDate(selectedDate)}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="history.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          className="bg-card rounded-2xl border border-border p-8 text-center"
          data-ocid="history.empty_state"
        >
          <p className="text-3xl mb-2">🗓️</p>
          <p className="font-medium text-foreground mb-1">
            No notes for this day
          </p>
          <p className="text-sm text-muted-foreground">
            Try selecting a different date.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((note, i) => (
            <HourCard
              key={note.noteId.toString()}
              note={note}
              index={i + 1}
              isDeleting={deleteNote.isPending}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {notes.length > 0 && <DailySummary notes={notes} />}
    </div>
  );
}
