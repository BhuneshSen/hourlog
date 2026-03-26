import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DailySummary } from "../components/DailySummary";
import { HourCard } from "../components/HourCard";
import { NoteModal } from "../components/NoteModal";
import { useHourlyBeep } from "../hooks/useHourlyBeep";
import {
  useCreateNote,
  useDeleteNote,
  useNotesByDate,
} from "../hooks/useQueries";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

interface TodayTabProps {
  scheduleStart: number;
  scheduleEnd: number;
}

export function TodayTab({ scheduleStart, scheduleEnd }: TodayTabProps) {
  const today = formatDate(new Date());
  const { data: notes = [], isLoading } = useNotesByDate(today);
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const { showModal, currentHour, openModal, closeModal } = useHourlyBeep(
    scheduleStart,
    scheduleEnd,
  );

  const nowHour = new Date().getHours();
  const isInSchedule = nowHour >= scheduleStart && nowHour < scheduleEnd;

  const handleSave = async (noteText: string, mood: string) => {
    const combined = mood ? `${mood} ${noteText}` : noteText;
    try {
      await createNote.mutateAsync({
        date: today,
        hour: currentHour,
        noteText: combined,
      });
      toast.success("Note saved!");
      closeModal();
    } catch (_) {
      toast.error("Failed to save note");
    }
  };

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
    <div className="flex flex-col gap-5" data-ocid="today.page">
      {/* Header */}
      <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
        <p className="text-sm text-muted-foreground mb-0.5">
          {formatDisplayDate(new Date())}
        </p>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()} 👋
        </h1>
        {isInSchedule && (
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary font-semibold">
              Tracking active · Hourly prompts on
            </span>
          </div>
        )}
      </div>

      {/* Log this hour button */}
      <Button
        onClick={() => openModal()}
        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-semibold text-base gap-2 shadow-card"
        data-ocid="today.primary_button"
      >
        <Plus className="h-5 w-5" />
        Log This Hour
      </Button>

      {/* Notes list */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="today.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          className="bg-card rounded-2xl border border-border p-8 text-center"
          data-ocid="today.empty_state"
        >
          <p className="text-3xl mb-2">📝</p>
          <p className="font-medium text-foreground mb-1">No notes yet</p>
          <p className="text-sm text-muted-foreground">
            Tap &ldquo;Log This Hour&rdquo; to track what you&apos;ve been
            doing.
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

      {/* Daily Summary */}
      {notes.length > 0 && <DailySummary notes={notes} />}

      {/* Note Modal */}
      <NoteModal
        open={showModal}
        hour={currentHour}
        isSaving={createNote.isPending}
        onSave={handleSave}
        onClose={closeModal}
      />
    </div>
  );
}
