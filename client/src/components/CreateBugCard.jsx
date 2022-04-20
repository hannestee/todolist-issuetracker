import React from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function CreateBugCard(props) {

    const [formText, setFormText] = React.useState(
        {
            title: "",
            content: ""
        }
    );

    const [shouldRedirect, setShouldRedirect] = React.useState(false);

    const navigate = useNavigate();
    //If adding a card from a card view instead of the frontpage, redirect to frontpage
    React.useEffect(() => {
        if (shouldRedirect) {
            navigate('/');
        }
    })

    function handleTitle(event) {
        const valueField = event.target.value;
        const nameField = event.target.name;
        setFormText((prevValue) => {
            return {
                ...prevValue,
                [nameField]: valueField,
            }
        });
    }

    function addCard() {
        //If adding a card from a card view instead of the frontpage, redirect to frontpage
        if (props.fromExpandedCard) {
            setShouldRedirect(true);
        }

        fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formText)
        })
            .then(res => res.json())
            .then(response => {
                if (response === "Success") {
                    props.toggleUpdateCards();
                }
            })
    }

    return (
        <div>
            <form className="createArea">
                <fieldset>
                    <input type="text" name="title" placeholder="Title" value={formText.title} onChange={handleTitle} />
                </fieldset>
                <fieldset>
                    <textarea name="content" id="" cols="40" rows="5" placeholder="Description" value={formText.content} onChange={handleTitle}></textarea>
                </fieldset>
                <fieldset>
                    <Button variant="contained" onClick={() => addCard()}>Submit</Button>
                </fieldset>
            </form>
        </div>
    )
}

export default CreateBugCard;