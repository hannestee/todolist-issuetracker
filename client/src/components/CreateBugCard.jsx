import React from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import SelectMenu from './SelectMenu';

function CreateBugCard(props) {

    const [formText, setFormText] = React.useState(
        {
            title: "",
            content: "",
            importance: "Medium"
        }
    );

    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [formMissingTitleOrDescription, setFormMissingTitleOrDescription] = React.useState(false);

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

        setFormMissingTitleOrDescription(false);
    }

    function addCard() {
        //If adding a card from a card view instead of the frontpage, redirect to frontpage
        if (props.fromExpandedCard) {
            setShouldRedirect(true);
        }

        if (formText.title.length === 0 ||formText.content.length ===  0) {
            setFormMissingTitleOrDescription(true);
            return
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

    function setSelectedImportanceValue(value) {
        setFormText((prevValue) => {
            return {
                ...prevValue,
                importance: value
            }
        });
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
                <p className="validation">{formMissingTitleOrDescription && "Title or description missing"}</p>
                <hr></hr>
                <fieldset className="importance">
                    <label>Importance</label>
                    <SelectMenu setSelectedImportanceValue={setSelectedImportanceValue}/>
                </fieldset>
                <fieldset>
                    <Button variant="contained" onClick={() => addCard()}>Submit</Button>
                </fieldset>
                
            </form>
            
        </div>
    )
}

export default CreateBugCard;