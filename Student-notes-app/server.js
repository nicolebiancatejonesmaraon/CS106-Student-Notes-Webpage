// server.js (Simplified)

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// --- Middleware Setup ---
app.use(express.static('public')); 
app.use(express.json()); // Parses incoming JSON data

// --- SIMPLE DATA FUNCTIONS ---
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeData = (notes) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2)); 
};

// --- API ROUTES (CRUD Operations) ---

// 1. READ (GET /api/notes)
app.get('/api/notes', (req, res) => {
    let notes = readData();
    const { category } = req.query; 
    
    if (category && category !== 'All') {
        notes = notes.filter(note => note.category === category);
    }

    res.json(notes); 
});

// 2. CREATE (POST /api/notes)
app.post('/api/notes', (req, res) => {
    const notes = readData();
    
    const newNote = {
        id: Date.now().toString(), // Simple ID based on timestamp
        title: req.body.title,
        content: req.body.content,
        category: req.body.category || 'Personal',
        isCompleted: false,
        dueDate: req.body.dueDate || null,
    };

    notes.push(newNote);
    writeData(notes);
    
    res.status(201).json(newNote); 
});

// 3. UPDATE (PUT /api/notes/:id/complete)
app.put('/api/notes/:id/complete', (req, res) => {
    const noteId = req.params.id;
    const notes = readData();
    
    const note = notes.find(n => n.id === noteId);

    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    note.isCompleted = !note.isCompleted; // Toggle status
    writeData(notes);
    
    res.json(note);
});

// 4. DELETE (DELETE /api/notes/:id)
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    let notes = readData();
    
    const newNotes = notes.filter(note => note.id !== noteId); 

    if (newNotes.length === notes.length) {
        return res.status(404).json({ error: 'Note not found' });
    }

    writeData(newNotes);
    res.status(204).send(); 
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});