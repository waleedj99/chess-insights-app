import {React} from 'react';
import {ListItem, IconButton,ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const getPrimaryText = (insightKey, insight) => {
    if (insight?.value?.timeTaken) {
        return `Move Number ${insight?.value?.moveNo} By ${insight?.players[insight?.value?.side].user?.name} for ${parseFloat(insight?.value?.timeTaken).toFixed(2)} minutes`    
    } else if(insightKey === "MOST_DYNAMIC_GAME") {
        return `Advantage was exchanged ${insight?.value} times`
    } else {
        return `${insight?.value} Moves ` 
    }
}

const MatchInsight = ({insightKey, insight }) => {
    return <ListItem key={insightKey} secondaryAction={
        <IconButton href={"https://www.lichess.org/" + insight['gameId']} edge="end" aria-label="Send">
          <SendIcon />
        </IconButton>}
        >
        <ListItemText
            primary={insightKey.replaceAll("_"," ")}
            secondary={getPrimaryText(insightKey, insight) + " In " + insight?.players?.white?.user?.name + " vs " +  insight?.players?.black?.user?.name}
        />
    </ListItem>
}

export default MatchInsight;