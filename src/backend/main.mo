import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import List "mo:core/List";
import Map "mo:core/Map";

actor {
  type UserId = Principal;

  type NoteId = Nat;

  type Note = {
    noteId : NoteId;
    date : Text;
    hour : Nat;
    note : Text;
    timestamp : Time.Time;
  };

  module Note {
    public func compare(note1 : Note, note2 : Note) : Order.Order {
      Nat.compare(note1.noteId, note2.noteId);
    };
  };

  type UserNotes = {
    nextNoteId : NoteId;
    notes : Map.Map<NoteId, Note>;
  };

  var nextNoteId = 0;

  let users = Map.empty<UserId, UserNotes>();
  let tempNotes = List.empty<Note>();

  func cleanUpEmptyListIfNotEmpty() : () {
    if (not tempNotes.isEmpty()) {
      tempNotes.clear();
    };
  };

  public shared ({ caller }) func createNote(date : Text, hour : Nat, noteText : Text) : async () {
    if (hour >= 24) {
      Runtime.trap("Invalid hour, must be between 0 and 23");
    };

    if (noteText.size() == 0) {
      Runtime.trap("Note text cannot be empty");
    };

    let user : UserId = caller;
    let noteId = nextNoteId;
    nextNoteId += 1;

    let newNote : Note = {
      noteId;
      date;
      hour;
      note = noteText;
      timestamp = Time.now();
    };

    switch (users.get(user)) {
      case (null) {
        let userNotes : UserNotes = {
          nextNoteId = 1;
          notes = Map.fromIter([].values());
        };
        userNotes.notes.add(noteId, newNote);
        users.add(user, userNotes);
      };
      case (?existingUserNotes) {
        existingUserNotes.notes.add(noteId, newNote);
      };
    };
  };

  public query ({ caller }) func getNotesByDate(date : Text) : async [Note] {
    cleanUpEmptyListIfNotEmpty();
    switch (users.get(caller)) {
      case (null) { [] };
      case (?user) {
        for ((_, note) in user.notes.entries()) {
          if (Text.equal(note.date, date)) {
            tempNotes.add(note);
          };
        };
        let result = tempNotes.values().toArray().sort();
        cleanUpEmptyListIfNotEmpty();
        result;
      };
    };
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    switch (users.get(caller)) {
      case (null) { [] };
      case (?user) { user.notes.values().toArray().sort() };
    };
  };

  public shared ({ caller }) func deleteNote(noteId : Nat) : async () {
    let user = caller;
    switch (users.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?userNotes) {
        if (not userNotes.notes.containsKey(noteId)) {
          Runtime.trap("Note does not exist");
        };
        userNotes.notes.remove(noteId);
      };
    };
  };

  public query ({ caller }) func getNoteById(noteId : Nat) : async Note {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?userNotes) {
        switch (userNotes.notes.get(noteId)) {
          case (null) { Runtime.trap("Note does not exist") };
          case (?note) { note };
        };
      };
    };
  };
};
