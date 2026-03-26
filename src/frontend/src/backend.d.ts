import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type NoteId = bigint;
export type Time = bigint;
export interface Note {
    noteId: NoteId;
    date: string;
    hour: bigint;
    note: string;
    timestamp: Time;
}
export interface backendInterface {
    createNote(date: string, hour: bigint, noteText: string): Promise<void>;
    deleteNote(noteId: bigint): Promise<void>;
    getAllNotes(): Promise<Array<Note>>;
    getNoteById(noteId: bigint): Promise<Note>;
    getNotesByDate(date: string): Promise<Array<Note>>;
}
