import React from "react";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function Heading(props) {
    const [searchValue, setSearchValue] = React.useState("");
    const didMount = React.useRef(false);

    const { handleSearch, setSpinnerLoadingState } = props;

    function handleChange(event) {
        const searchFieldText = event.target.value;
        setSearchValue(searchFieldText);
    }

    React.useEffect(() => {
        //Check if page loaded for the first time to avoid unnecessary search
        if (!didMount.current) {
            didMount.current = true;
            return
        }

        async function getResults() {
            const searchTextObject = { searchValue }
            try {
                const response = await fetch('/api/search/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(searchTextObject)
                })
                const json = await response.json();
                handleSearch(json.foundCards)

            } catch (err) {
                console.log(err);
            }
            setSpinnerLoadingState(false);
        }

        if (searchValue.length === 0) {
            setSpinnerLoadingState(false);
            handleSearch();
            return
        }

        if (searchValue.length < 3) {
            setSpinnerLoadingState(false);
            return
        }

        setTimeout(() => {
            setSpinnerLoadingState(true);
        }, 400);

        //Fixes an issue where emptying the searchfield would keep the spinner visible
        setTimeout(() => {
            setSpinnerLoadingState(false);
        }, 1000);

        let searchTimer = setTimeout(() => {
            getResults();
        }, 750);

        return () => {
            clearTimeout(searchTimer)
            setSpinnerLoadingState(false);
        }

    }, [searchValue]);


    return (
        <header>
            <a href="/"><h1>Issue tracker</h1></a>
            <div>
                {props.searchEnabled && <input type="text" placeholder="Search issue" onChange={handleChange} value={searchValue} />}
                <Button variant="contained" size="small" className="add-issue" onClick={() => props.toggleIssueArea()}><AddIcon sx={{ fontSize: 28 }} /></Button>
            </div>
        </header>
    )
}

export default Heading;