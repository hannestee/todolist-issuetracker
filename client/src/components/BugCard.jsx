import React from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function BugCard(props) {

    const navigate = useNavigate();

    function deleteCard() {
        fetch('api/card/' + props.title, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props.id }),
        })
            .then(res => res.json())
            .then(response => {
                if (response === "Success") {
                    props.toggleUpdateCards();
                }
            })
    }

    function viewCard() {
        navigate('/card/' + props.title, {
            state: {
                title: props.title,
                content: props.content
            }
        });
    }

    return (
        <div className="bug-card">
            <h2>{props.title.length > 30 ? props.title.substring(0, 25) + " ..." : props.title}</h2>
            <p>{props.content.length > 100 ? props.content.substring(0, 100) + " ..." : props.content}</p>
            <Button variant="contained" type="submit" name="view" onClick={() => viewCard()}>View</Button>
            <Button variant="contained" type="submit" name="delete" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) deleteCard() }}>Delete</Button>
        </div>
    )
}

export default BugCard;