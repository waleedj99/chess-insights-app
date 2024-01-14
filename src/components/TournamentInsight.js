import {React} from 'react';
import {ListItem, ListItemText } from '@mui/material';

const getSecondaryText = (insightKey, insight) => {
    if(insightKey === "MOST_USED_OPENING") {
        return `${insight?.openingName} was used ${insight?.noOfTimes} times`
    } else if (insightKey === "MOST_USED_OPENING_MOVE") {
        return `${insight?.openingMoveName} was used ${insight?.noOfTimes} times`
    } else if (insightKey === "MOST_ACCURATE_PLAYER") {
        return `${insight?.playerName} had an average accuracy of ${parseFloat(insight?.averageAccuracy).toFixed(2)}% in ${insight?.noOfMatches} matches`
    }
}

const TournamentInsight = ({insightKey, insight }) => {
    return <ListItem key={insightKey} >
        <ListItemText
            primary={insightKey.replaceAll("_"," ")}
            secondary = {getSecondaryText(insightKey, insight?.value)}
        />
    </ListItem>
}

export default TournamentInsight;