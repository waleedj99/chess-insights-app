import React, { useEffect, useState } from 'react';
import InsightsPoster from './components/InsightsPoster';
import {InputLabel,FormControl, Button, Input } from '@mui/material';
import calculateAllInsights from './utils/InsightUtil';
const App = () => {
  const [insights, setInsights] = useState({});
  const [tournamentGames, setTournamentGames] = useState("")
  const [swissId, setTournamentId] = useState("")
  const [loading, setLoading] = useState(true);
  var fetchData = []
  const fetchInsights = async (tournamentGames) => {
    var TournamentInsight = {}
    TournamentInsight = calculateAllInsights(tournamentGames,["SHORTEST_GAME_LENGTH_BY_MOVES",
    "LONGEST_GAME_LENGTH_BY_MOVES", "MOST_ACCURATE_GAME", 
    "LONGEST_MOVE_BY_TIME", "MOST_USED_OPENING", "MOST_USED_OPENING_MOVE",
    "MOST_DYNAMIC_GAME","MOST_ACCURATE_PLAYER"])
    setInsights(TournamentInsight);
    setLoading(false);
  }

  const fetchSwissGames = async () => {
    var requestOptions = {
      method: 'GET',
      headers: {
        "Content-Type":  "application/x-ndjson",
        "Accept": "application/x-ndjson"
      },
      redirect: 'follow'
    };

    fetch(`https://lichess.org/api/tournament/${swissId}/games?evals=true&accuracy=true&clocks=true&opening=true`, requestOptions)
      .then(response => {
        return response.body.getReader()
      })
      .then(result => {
        const reader = result;
        let chunk = '';

        // Read chunks until the end of the stream
        const read = () => {
          return reader.read().then(({ done, value }) => {
            if (done) {
              return;
            }

            // Combine the current chunk with the remaining value
            chunk += new TextDecoder().decode(value);

            // Split the chunk by newline characters
            const lines = chunk.split('\n');

            // Process complete lines
            for (let i = 0; i < lines.length - 1; i++) {
              const jsonLine = lines[i];
              const jsonObject = JSON.parse(jsonLine);
              fetchData.push(jsonObject)
              // Process the parsed JSON object as needed
            }

            // Keep the last incomplete line for the next iteration
            chunk = lines[lines.length - 1];

            // Continue reading the stream
            return read();
          });
        };
    return read();
        })
      .then(() => {
        setTournamentGames(fetchData)
      })
      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    fetchInsights(tournamentGames)
  }, [tournamentGames])
  
  return (
    <div className="App">
      <h1>Chess Insights</h1>
      <FormControl>
        <InputLabel htmlFor="my-input">Tournamnet ID</InputLabel>
        <Input id="my-input" onChange={(e) => {setTournamentId(e.target.value)}}/>
        <Button variant="contained" onClick={fetchSwissGames}>
          Send
        </Button>
      </FormControl>
      {loading ? (
        <p>Loading insights...</p>
      ) : (
        <div>
          <InsightsPoster insights={insights}/>
        </div>
      )}
    </div>
  );
};

export default App;
