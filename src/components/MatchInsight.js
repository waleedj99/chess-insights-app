import {React} from 'react';
import {Card, List, ListItem, IconButton,ListItemText, ListSubheader } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// const getPrimaryText = (insightKey, insight) => {
//     if(insight?.value?.timeTaken) {
//         return insightKey.replaceAll("_"," ") + " -> " + JSON.stringify(timeTaken) 
//     }
// }

const MatchInsight = ({insightKey, insight }) => {
    console.log(insight)
    return <ListItem key={insightKey} secondaryAction={
        <IconButton href={"https://www.lichess.org/" + insight['gameId']} edge="end" aria-label="Send">
          <SendIcon />
        </IconButton>}
        >
        <ListItemText
            primary={insightKey.replaceAll("_"," ") + " -> " + JSON.stringify(insight?.value)}
            secondary={insight?.players?.white?.user?.name + " vs " +  insight?.players?.black?.user?.name}
        />
    </ListItem>
}

export default MatchInsight;