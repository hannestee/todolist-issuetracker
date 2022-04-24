import React from "react";
import Chip from '@mui/material/Chip';

function ChipWithColor(props) {
    
    return (
        <Chip label={props.importance} color={props.importance === "High" ? "highImportanceColor" : props.importance === "Medium" ? "mediumImportanceColor" : "lowImportanceColor"} />
    )
}

export default ChipWithColor;