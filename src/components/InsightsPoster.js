import {React} from 'react';
import {Card, List} from '@mui/material';
import MatchInsight from './MatchInsight';
import TournamentInsight from './TournamentInsight'
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
            return  <TournamentInsight
              insightKey = {key}
              insight = {insights[key]} />
          }}
        )}
      </List>
    </Card>
  );
};

export default InsightsPoster;
