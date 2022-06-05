// components/Notes.jsx

import React, { useState } from "react";
import Note from "./Note";
import CreateArea from "./CreateArea";

function Notes() {
  const [notes, setNotes] = useState([]);

  React.useEffect(() => {
    // get notes from server
    fetch("/notes", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNotes(data.notes);
      })
      .catch((err) => console.log(err));
  }, []);

  function addNote(newNote) {
    //save passed note from CreateArea to notes array/server
    fetch("/submitNote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note: {
          title: newNote.title,
          content: newNote.content,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        newNote._id = data.id;
        setNotes((prevNotes) => [...prevNotes, newNote]);
      })
      .catch((err) => console.log(err));
  }

  function deleteNote(id) {
    //delete note from notes array/server
    fetch("/deleteNote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id)))
  }

  return (
    <div className="notes">
      <CreateArea onAdd={addNote} />
      {notes.map((note, index) => (
        <Note
          key={index}
          id={note._id}
          title={note.title}
          content={note.content}
          onDelete={deleteNote}
        />
      ))}
    </div>
  );
}

export default Notes;
