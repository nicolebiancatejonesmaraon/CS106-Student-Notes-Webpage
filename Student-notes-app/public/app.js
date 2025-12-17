// public/app.js (Simplified)

const NOTES_LIST = document.getElementById('notes-list');
const NOTE_FORM = document.getElementById('note-form');
const FILTER_CATEGORY = document.getElementById('filter-category');

// --- FETCH API FUNCTIONS (Frontend communicating with the Backend) ---

// READ: Fetches notes based on the filter
async function fetchNotes(category = 'All') {
    try {
        // 
        // This is a GET request: it reads data from the server
        const url = `/api/notes?category=${category}`;
        const response = await fetch(url); 
        const notes = await response.json();
        renderNotes(notes); 
    } catch (error) {
        console.error("Failed to fetch notes:", error);
    }
}

// CREATE: Handles form submission
async function addNote(noteData) {
    // This is a POST request: it sends new data to the server
    await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData) 
    });
    
    NOTE_FORM.reset(); 
    fetchNotes(FILTER_CATEGORY.value); // Refresh list
}

// UPDATE: Toggles the completed status
async function toggleComplete(id) {
    // This is a PUT request: it updates existing data
    await fetch(`/api/notes/${id}/complete`, {
        method: 'PUT' 
    });
    
    fetchNotes(FILTER_CATEGORY.value); // Refresh list
}

// DELETE: Removes a note
async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    // This is a DELETE request: it removes data
    await fetch(`/api/notes/${id}`, {
        method: 'DELETE' 
    });
    
    fetchNotes(FILTER_CATEGORY.value); // Refresh list
}


// --- DOM MANIPULATION (Displaying Notes) ---

function renderNotes(notes) {
    NOTES_LIST.innerHTML = ''; 
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        
        let classes = `note-card ${note.category.toLowerCase()}`;
        if (note.isCompleted) {
            classes += ' completed';
        }
        noteElement.className = classes;

        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <span class="category-tag">Category: ${note.category}</span>
            <div class="actions">
                <button onclick="toggleComplete('${note.id}')">
                    ${note.isCompleted ? 'Unmark' : 'Mark Complete'}
                </button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
            </div>
        `;
        
        NOTES_LIST.appendChild(noteElement);
    });
}

// --- EVENT LISTENERS (Triggers) ---

// Listens for the form to be submitted
NOTE_FORM.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const noteData = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        category: document.getElementById('category').value,
        dueDate: document.getElementById('due-date').value,
    };
    addNote(noteData); 
});

// Listens for a change in the filter dropdown
FILTER_CATEGORY.addEventListener('change', (e) => {
    fetchNotes(e.target.value);
});


// Initial call to load notes when the page first opens
fetchNotes();