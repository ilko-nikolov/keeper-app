import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Zoom } from '@mui/material';


function CreateArea(props) {
    const [isExpanded, setExpanded] = useState(false);

    const [note, setNote] = useState({ //note state
        title: '',
        content: ''
    });

    function handleChange(event) { //add the current value to the note state
        const { name, value } = event.target;
        setNote(prevNote => {
            return {
                ...prevNote,
                [name]: value
            }
        });
    }

    function submitNote(event) { //pass newly created note to the Notes component
        props.onAdd(note);
        setNote({
            title: '',
            content: ''
        });
        event.preventDefault();
    }

    function expand() { //expand the note creation area on click
        setExpanded(true);
    }

  return (
    <div >
        <form className="create-note">
            {isExpanded &&
                <input name='title' 
                    placeholder='Title' 
                    value={note.title}
                    onChange={handleChange}
                />
            }
            <textarea name='content' 
                placeholder='Take a note...' 
                rows={isExpanded ? 3 : 1}
                value={note.content}
                onChange={handleChange}
                onClick={expand}
            ></textarea>
            <Zoom in={isExpanded}>
                <Fab color='primary' onClick={submitNote}>
                    <AddIcon />
                </Fab>
            </Zoom>
        </form>
    </div>
    );
}


export default CreateArea;