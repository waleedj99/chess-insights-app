import React, { useEffect, useState } from 'react';
import InsightsPoster from './components/InsightsPoster';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import {FormGroup, InputLabel,FormControl,LinearProgress, Button, Input, MenuItem, Select, Card, AppBar, Typography, CardContent, Box } from '@mui/material';
import calculateAllInsights from './utils/InsightUtil';
// import * as parser from 'chess-pgn-parser';

const App = () => {
  const [insights, setInsights] = useState({});
  const [tournamentGames, setTournamentGames] = useState("")
  const [tournamentId, setTournamentId] = useState("")
  const [tournamentType, setTournamentType] = useState("")
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

  const fetchGames = async () => {
    var requestOptions = {
      method: 'GET',
      headers: {
        "Content-Type":  "application/x-ndjson",
        "Accept": "application/x-ndjson"
      },
      redirect: 'follow'
    };

    fetch(`https://lichess.org/api/${tournamentType}/${tournamentId}/games?evals=true&accuracy=true&clocks=true&opening=true`, requestOptions)
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
        console.log(fetchData)
        setTournamentGames(fetchData)
      })
      .catch(error => console.log('error', error));
  };

  // const fetchBroadcastGames = async () => {
  //   const anyRoundId = "CEyHlKyt"
  //   var broadcastId = ""
  //   var requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type":  "application/json",
  //       "Accept": "application/json"
  //     },
  //     redirect: 'follow'
  //   };

  //   fetch(`https://lichess.org/api/broadcast/round/CEyHlKyt.pgn`)
  //           .then(pgnFile => {
  //             var json = parser.pgn2json(pgnFile);
  //             console.log(json);
  //           })

  //   // fetch(`https://lichess.org/api/broadcast/-/-/${anyRoundId}`, requestOptions)
  //   // .then(r => r.json())
  //   // .then(result => {
  //   //   console.log(result)
  //   //   return result["tour"]["id"]
  //   // })
  //   // .then(tournamentId => {
  //   //   fetch(`https://lichess.org/api/broadcast`)
  //   //   .then(result =>{ 
  //   //     //console.log(result.text())
  //   //     console.log(result.json())
  //   //     return result.text()
  //   //   })
  //   //   .then(result => {
  //   //     return result.filter(tournament => {
  //   //       if(tournament["tour"]["id"] === tournamentId) {
  //   //         return tournament["rounds"]
  //   //       } else {
  //   //         console.log("No tournament with id-" + tournamentId)
  //   //         return []
  //   //       }
  //   //     })
  //   //   })
  //   //   .then(selectedTournament => {
  //   //     selectedTournament.array.forEach(round => {
  //   //       console.log(round)
  //   //       fetch(`https://lichess.org/api/broadcast/round/${round["id"]}.pgn`)
  //   //       .then(pgnFile => {
  //   //         var json = parser.pgn2json(pgnFile);
  //   //         console.log(json);
  //   //       })
  //   //     });
  //   //   })
  //   // })
  //   // .catch(error => console.log('error', error));
    
  // }

  useEffect(() => {
    fetchInsights(tournamentGames)
  }, [tournamentGames])
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{display:"flex", flexDirection: "column", alignItems: "center"}}>
        <CssBaseline />
        <AppBar position="static" sx={{backgroundColor: 'black'}}>
          <Typography  sx={{alignSelf: "center" }} variant="h4">
            Chess Insights Generator
          </Typography>
        </AppBar>
        
        <br></br>
        <Card sx={{width:'60%', alignSelf:'center'}}>
          <CardContent>
            <FormGroup sx={{display:"flex", flexDirection: "row", justifyContent: "space-around", alignItems:"end"}}>
              <FormControl sx={{flex:"3", marginRight:"1em"}}>
                <InputLabel id="demo-simple-select-label">Select the type of Tournament</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tournamentType}
                  label="Tournament Type"
                  onChange={(e) => {setTournamentType(e.target.value)}}
                >
                  <MenuItem value="swiss">Swiss</MenuItem>
                  <MenuItem value="tournament">Arena</MenuItem>
                  <MenuItem value="broadcast">Broadcast</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{flex:"2", marginRight:"1em"}}>
                <InputLabel htmlFor="my-input">Tournamnet ID</InputLabel>
                <Input id="my-input" onChange={(e) => {setTournamentId(e.target.value)}}/>
              </FormControl>
              <Button  variant="contained" onClick={fetchGames}>
                  Generate
              </Button>
            </FormGroup>
          </CardContent>
        </Card>
        <br></br>
        {loading ? (
          <LinearProgress />
          ) : (
              <InsightsPoster insights={insights}/>
          )}
      </Box>
    </ThemeProvider>
  );
};

export default App;
