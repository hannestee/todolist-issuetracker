import React from "react";
import Heading from "./Heading";
import CreateBugCard from "./CreateBugCard";
import Collapse from '@mui/material/Collapse';
import { useLocation, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import ChipWithColor from "./ChipWithColor";
import ColorPalette from './ColorPalette';
import { ThemeProvider } from "@emotion/react";

function CardExpanded() {

  function parseIssueDate(date) {
      const parsedDate = Date.parse(date);
      const currentDate = new Date();
      const fetchedDateTimezoneAdjusted = new Date(parsedDate + (currentDate.getTimezoneOffset() * 60000))
      
      const year = fetchedDateTimezoneAdjusted.getFullYear();
      const month = fetchedDateTimezoneAdjusted.getMonth() +  1;
      const day = fetchedDateTimezoneAdjusted.getDate();
      
      return `${day}/${month}/${year}`;
  }

  const [cardsUpdated, setCardsUpdated] = React.useState(false);
  const [showCreateArea, setShowCreateArea] = React.useState(false);
  const [cardData, setCardData] = React.useState(
    {
      title: "",
      content: "",
      importance: "",
      createdOn: "",
    }
  );

  const [isBeingEdited, setIsBeingEdited] = React.useState(false);
  const { state } = useLocation();
  const { title } = useParams();

  const navigate = useNavigate();

  React.useEffect(() => {
    //If coming from a direct link, get card data
    
    if (!state) {
      fetch('/api/card/' + title, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(response => {
          if (response) {

            const issueCreatedDate = parseIssueDate(response.createdOn);

            setCardData(() => {
              return {
                title: response.title,
                content: response.content,
                importance: response.importance,
                createdOn: issueCreatedDate
              }
            })
          }
        })
    } else {

      const issueCreatedDate = parseIssueDate(state.createdOn);
      
      setCardData(() => {
        return {
          title: state.title,
          content: state.content,
          importance: state.importance,
          createdOn: issueCreatedDate,
        }
        
      })
    }
  }, [state, title]);

  function toggleIssueArea() {
    setShowCreateArea(!showCreateArea);
  }

  function toggleUpdateCards() {
    setCardsUpdated(!cardsUpdated);
  }

  function toggleCardEditing() {
    setIsBeingEdited(!isBeingEdited);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setCardData(prevValue => {
      return {
        ...prevValue,
        [name]: value
      }
    })
  }

  function saveCard() {
    const patchContent = { previousTitle: title, content: cardData.content, title: cardData.title }
    fetch('/api/card/' + title, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchContent)
    })
    .then( () => navigate('/'))
  }

  return (
    <ThemeProvider theme={ColorPalette}>
    <div>
      <Heading toggleIssueArea={toggleIssueArea} searchEnabled={false} />
      <Collapse in={showCreateArea}>
        <CreateBugCard toggleUpdateCards={toggleUpdateCards} fromExpandedCard={true} />
      </Collapse>
      <div className="bug-card-extended">
        {!isBeingEdited && <Button variant="contained" name="back" onClick={() => navigate("/")}>Back</Button>}
        {isBeingEdited ? <input name="title" onChange={handleChange} value={cardData.title} /> : <h1>{cardData.title}</h1>}
        <div className="card-meta-info">
          <p>Created on: {cardData.createdOn}</p>
          <ChipWithColor className="chip-with-color" importance={cardData.importance} />
        </div>
        <hr></hr>
        {isBeingEdited ? <textarea name="content" onChange={handleChange} value={cardData.content} /> : <p>{cardData.content}</p>}
        <div className="card-control">
          <Button className={isBeingEdited ? "cancel-button" : ""} variant="contained" name="edit" onClick={() => toggleCardEditing()}>{isBeingEdited ? "Cancel" : "Edit"}</Button>
          {isBeingEdited && <Button variant="contained" name="save" onClick={() => saveCard()}>Save</Button>}
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
}

export default CardExpanded;
