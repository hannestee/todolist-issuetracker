import React from "react";
import BugCard from "./BugCard";
import Heading from "./Heading";
import CreateBugCard from "./CreateBugCard";
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function App() {
  const [cards, setCards] = React.useState([]);
  const [cardsUpdated, setCardsUpdated] = React.useState(false);
  const [showCreateArea, setShowCreateArea] = React.useState(false);
  const [initialCards, setInitialCards] = React.useState();
  const [spinnerLoadingState, setSpinnerLoadingState] = React.useState(false);
  const [noSearchResultsFound, setNoSearchResultsFound] = React.useState(false);
  //deploy
  function toggleIssueArea() {
    setShowCreateArea(!showCreateArea);
  }

  function toggleUpdateCards() {
    setCardsUpdated(!cardsUpdated);
  }

  const navigate = useNavigate();

  React.useEffect(() => {
    fetch("/api/cards")
      .then(res => {
        return res.json()
      }
      )
      .then(retrievedCards => {
        setCards(retrievedCards);
        setInitialCards(retrievedCards);
      });
  }, [cardsUpdated]);

  function handleSearch(searchResultCards=initialCards) {
    if (searchResultCards.length === 0) {
      setNoSearchResultsFound(true)
      return
    }
    setNoSearchResultsFound(false)
    setCards(searchResultCards);
  }

  return (
    <div>
      <Heading toggleIssueArea={toggleIssueArea} handleSearch={handleSearch} searchEnabled={true} setSpinnerLoadingState={setSpinnerLoadingState} />
      <Collapse in={showCreateArea}>
        <CreateBugCard toggleUpdateCards={toggleUpdateCards} />
      </Collapse>
      {spinnerLoadingState ?
      <div className="card-space-container"> 
        <CircularProgress /> 
      </div>
      : 
      !noSearchResultsFound ?
      <div>
        {cards.map(card => {
          return (
            <BugCard key={card._id} id={card._id} title={card.title} content={card.content} toggleUpdateCards={toggleUpdateCards}  />
          )
        })}
      </div>
      :
      <div className="card-space-container">
        <h4>No search results found</h4>
        <Button variant="contained" size="small" onClick={() => navigate(0)}>Back</Button>
      </div>
      }
    </div>
  );
}

export default App;
