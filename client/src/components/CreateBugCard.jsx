import React from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import SelectMenu from './SelectMenu';

function CreateBugCard(props) {

    const [formText, setFormText] = React.useState(
        {
            title: "",
            content: "",
            importance: "Medium",
            createdOn: ""
        }
    );

    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [formMissingTitleOrDescription, setFormMissingTitleOrDescription] = React.useState(false);
    const [formTitleOrDescriptionTooLong, setFormTitleOrDescriptionTooLong] = React.useState(false);
    const [formWordTooLong, setFormWordTooLong] = React.useState(false);


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
        setFormTitleOrDescriptionTooLong(false);
        setFormWordTooLong(false);
    }

    function addCard() {
        //If adding a card from a card view instead of the frontpage, redirect to frontpage
        if (props.fromExpandedCard) {
            setShouldRedirect(true);
        }

        if (formText.title.length === 0 || formText.content.length ===  0) {
            setFormMissingTitleOrDescription(true);
            return
        }

        if (formText.title.length > 50 || formText.content.length > 500) {
            setFormTitleOrDescriptionTooLong(true);
            return
        }

        let wordLengthContentArray = formText.content.split(' ')

        for (let item in wordLengthContentArray) {
            console.log(wordLengthContentArray[item]);
            if (wordLengthContentArray[item].length > 38) {
                console.log("Match: " + wordLengthContentArray[item]);
                setFormWordTooLong(true);
                return
            }
        }

        // if (formText.title.split(' ')[0].length > 26 || formText.content.split(' ')[0].length > 26) {
        //     setFormWordTooLong(true);
        //     return
        // }

        const date = new Date()
        const dateFormatted = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON()
        formText.createdOn = dateFormatted;

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
                    <input type="text" maxLength="50" name="title" placeholder="Title" value={formText.title} onChange={handleTitle} />
                </fieldset>
                <fieldset>
                    <textarea name="content" maxLength="500" id="" cols="40" rows="5" placeholder="Description" value={formText.content} onChange={handleTitle}></textarea>
                </fieldset>
                <p className="validation">{formTitleOrDescriptionTooLong ? "Title or description too long. Max: title 50, content 500 characters" : formWordTooLong ? "Too long word, add space" : formMissingTitleOrDescription && "Title or description missing"}</p>
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