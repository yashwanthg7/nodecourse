import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    axios.get(`${API_BASE}/notes`)
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => {
        console.log('Error fetching notes:', error);
      });
  }, []);

  const addNote = () => {
    axios.post(`${API_BASE}/notes`, newNote)
      .then(response => {
        setNotes([...notes, response.data]);
        setNewNote({ title: '', content: '' });
      })
      .catch(error => {
        console.log('Error adding note:', error);
      });
  };

  const deleteNote = (id) => {
    axios.delete(`${API_BASE}/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note.id !== id));
      })
      .catch(error => {
        console.log('Error deleting note:', error);
      });
  };

  return (
    <div className="App">
      <h1>Notes App</h1>

      <div className="notes">
        {notes.map(note => (
          <div className="note" key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="add-note">
        <h2>Add a Note</h2>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })} />
        <label htmlFor="content">Content:</label>
        <textarea id="content" value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })} />
        <button onClick={addNote}>Add Note</button>
      </div>
    </div>
  );
}

export default App;

