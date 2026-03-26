import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../backend.d";
import { useActor } from "./useActor";

export function useNotesByDate(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes", date],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotesByDate(date);
    },
    enabled: !!actor && !isFetching && !!date,
  });
}

export function useAllNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      hour,
      noteText,
    }: {
      date: string;
      hour: number;
      noteText: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.createNote(date, BigInt(hour), noteText);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes", variables.date] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteNote(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
