import {React} from 'react';
import {Card, List, ListItem} from '@mui/material';
import MatchInsight from './MatchInsight';
const InsightsPoster = ({ insights }) => {
  return (
    <Card sx={{width:'60%', alignSelf:'center'}}>
          <List>
            {Object.keys(insights).map((key) => {
                if(insights[key]?.gameId) {
                  return <MatchInsight
                      insightKey = {key}
                      insight = {insights[key]} />
                } else {
                return <ListItem key={key}>
                <strong>{key.replace("_"," ")}:</strong> {JSON.stringify(insights[key], undefined, 2)}
              </ListItem>
              }}
            )}
          </List>
    </Card>
  );
};

export default InsightsPoster;
