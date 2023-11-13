const INSIGHTS = {
    SHORTEST_GAME_BY_MOVES: "SHORTEST_GAME_LENGTH_BY_MOVES",
    LONGEST_GAME_BY_MOVES: "LONGEST_GAME_LENGTH_BY_MOVES",
    LONGEST_MOVE_BY_TIME: "LONGEST_MOVE_BY_TIME",
    MOST_ACCURATE_GAME: "MOST_ACCURATE_GAME",
    MOST_USED_OPENING: "MOST_USED_OPENING",
    MOST_USED_OPENING_MOVE: "MOST_USED_OPENING_MOVE",
    MOST_DYNAMIC_GAME: "MOST_DYNAMIC_GAME",
    MOST_ACCURATE_PLAYER: "MOST_ACCURATE_PLAYER"
}

const maxConsecutiveDifferenceWithPositions = (arr) => {
    if (arr.length < 2) {
      return [undefined, undefined];
    }

    let maxDiff = -Infinity;
    let maxDiffPositions = undefined;

    for (let i = 2; i < arr.length; i++) {
      const diff = arr[i - 1] - arr[i];
      if (diff > maxDiff) {
        maxDiff = diff;
        maxDiffPositions = i + 1;
      }
    }

    return [maxDiff, maxDiffPositions];
};

const calculateAllInsights = (tournamentGames, insightsToCalculate) => {
    var TournamentInsight = {}
    function formatInsight(name, gameId, whitePlayer, blackPlayer, value) {
        TournamentInsight[name] = {
            'gameId': gameId,
            'players': {
            'white': whitePlayer,
            'black': blackPlayer,
            },
            'value': value,
        };
    }
    var leastNoOfMoves = 1000000
    var mostNoOfMoves = 0
    let maxDiff = -Infinity;
    let maxAcc = 0;
    let OpeningMap = {}
    let playerMap = {};
    let startingMove = {};
    let dynamicGame = []
    let analysedGames = 0
    let totalGames = 0
    for(const game of tournamentGames) {
        var noOfMoves = Math.floor(game.moves.split(' ').length / 2)
        totalGames += 1 
        if(game["analysis"] !== undefined) {
            analysedGames += 1 
        }
        if(insightsToCalculate.includes(INSIGHTS.SHORTEST_GAME_BY_MOVES)) {
            if (noOfMoves < leastNoOfMoves && noOfMoves > 2) {
                leastNoOfMoves = noOfMoves
                formatInsight(INSIGHTS.SHORTEST_GAME_BY_MOVES, game.id, game.players.white, game.players.black, noOfMoves)
            }
        }

        if(insightsToCalculate.includes(INSIGHTS.LONGEST_GAME_BY_MOVES)) {
            if (noOfMoves >= mostNoOfMoves) {
                mostNoOfMoves = noOfMoves
                formatInsight(INSIGHTS.LONGEST_GAME_BY_MOVES, game.id, game.players.white, game.players.black, noOfMoves)
            }
        }

        if(insightsToCalculate.includes(INSIGHTS.LONGEST_MOVE_BY_TIME)) {
            let pos = 0;
            const blackMoves = [];
            const whiteMoves = [];
            for (const time of game.clocks) {
                if (pos % 2 === 0) {
                    whiteMoves.push(time);
                } else {
                    blackMoves.push(time);
                }
                pos++;
            }
            const [diffW, positionsW] = maxConsecutiveDifferenceWithPositions(whiteMoves);
            const [diffB, positionsB] = maxConsecutiveDifferenceWithPositions(blackMoves);
      
            if (diffW >= diffB) {
                if (diffW > maxDiff) {
                    maxDiff = diffW;
                    formatInsight(INSIGHTS.LONGEST_MOVE_BY_TIME, game.id, game.players.white, game.players.black, {
                    side: "white",
                    timeTaken: diffW / 6000,
                    moveNo: positionsW,
                    });
                }
            } else {
                if (diffB > maxDiff) {
                    maxDiff = diffB;
                    formatInsight(INSIGHTS.LONGEST_MOVE_BY_TIME,game.id, game.players.white, game.players.black, {
                    side: "black",
                    timeTaken: diffB / 6000,
                    moveNo: positionsB,
                    })
                }
            }

        }

        if(insightsToCalculate.includes(INSIGHTS.MOST_ACCURATE_GAME) && game.players.white.analysis) {
            const sumA = parseInt(game.players.white.analysis.accuracy) + parseInt(game.players.black.analysis.accuracy);
            if (sumA > maxAcc) {
                maxAcc = sumA;
                formatInsight(INSIGHTS.MOST_ACCURATE_GAME, game.id, game.players.white, game.players.black, maxAcc/2)
            }
        }

        if(insightsToCalculate.includes(INSIGHTS.MOST_USED_OPENING)) {
            if(game.opening !== undefined) {
                if (game.opening.name in OpeningMap) {
                    OpeningMap[game.opening.name] += 1;
                } else {
                    OpeningMap[game.opening.name] = 1;
                }
            }
        }

        if(insightsToCalculate.includes(INSIGHTS.MOST_USED_OPENING_MOVE)) {
            if(game.moves !== undefined) {
                if (game.moves.split(' ')[0] in startingMove) {
                    startingMove[game.moves.split(' ')[0]] += 1;
                } else {
                    startingMove[game.moves.split(' ')[0]] = 1;
                }
            }
        }

        if(insightsToCalculate.includes(INSIGHTS.MOST_DYNAMIC_GAME)) {
            let numberOfTurnArounds = 0;
            let currentWinning = undefined;
            let whiteWinning = undefined;
            if (game.analysis !== undefined) {
                for (const analysis of game.analysis) {
                  if ('eval' in analysis) {
                    const posEval = analysis.eval;
                    whiteWinning = posEval > 0;
                  } else if (analysis.mate > 0) {
                    whiteWinning = true;
                  } else {
                    whiteWinning = false;
                  }
                  if (whiteWinning !== currentWinning) {
                    numberOfTurnArounds += 1;
                    currentWinning = whiteWinning;
                  }
                }
                dynamicGame.push({ game, dFactor: numberOfTurnArounds });
              }
        }

        if(insightsToCalculate.includes(INSIGHTS.MOST_ACCURATE_PLAYER)) {
            if (game.players.white.user !== undefined && game.players.white.analysis !== undefined) {
                const whitePlayerName = game.players.white.user.name;
                if (whitePlayerName in playerMap) {
                  playerMap[whitePlayerName].noMatches += 1;
                  playerMap[whitePlayerName].totalAcc += game.players.white.analysis.accuracy;
                } else {
                  playerMap[whitePlayerName] = { noMatches: 1, totalAcc: game.players.white.analysis.accuracy };
                }
            }
        
            if (game.players.black.user !== undefined && game.players.black.analysis !== undefined) {
            const blackPlayerName = game.players.black.user.name;
            if (blackPlayerName in playerMap) {
                playerMap[blackPlayerName].noMatches += 1;
                playerMap[blackPlayerName].totalAcc += game.players.black.analysis.accuracy;
            } else {
                playerMap[blackPlayerName] = { noMatches: 1, totalAcc: game.players.black.analysis.accuracy };
            }
            }
        }
    }
    
    if(insightsToCalculate.includes(INSIGHTS.MOST_USED_OPENING) && Object.values(OpeningMap).length > 0) {
        const maxName = Object.keys(OpeningMap).reduce((a, b) => (OpeningMap[a] > OpeningMap[b] ? a : b));
        const maxNumber = OpeningMap[maxName];
        formatInsight(INSIGHTS.MOST_USED_OPENING, undefined, undefined, undefined, { openingName: maxName, noOfTimes: maxNumber });
    }

    if(insightsToCalculate.includes(INSIGHTS.MOST_USED_OPENING_MOVE) && Object.values(startingMove).length > 0) {
        const maxName = Object.keys(startingMove).reduce((a, b) => (startingMove[a] > startingMove[b] ? a : b));
        const maxNumber = startingMove[maxName];
        formatInsight(INSIGHTS.MOST_USED_OPENING_MOVE, undefined, undefined, undefined, { openingMoveName: maxName, noOfTimes: maxNumber });
    }

    if(insightsToCalculate.includes(INSIGHTS.MOST_DYNAMIC_GAME) && Object.values(dynamicGame).length > 0) {
        dynamicGame.sort((a, b) => b.dFactor - a.dFactor);
        formatInsight(INSIGHTS.MOST_DYNAMIC_GAME, dynamicGame[0].game.id, dynamicGame[0].game.players.white, dynamicGame[0].game.players.black, dynamicGame[0].dFactor);
    }

    if(insightsToCalculate.includes(INSIGHTS.MOST_ACCURATE_PLAYER) && Object.values(playerMap).length > 0) {
        for (const player in playerMap) {
            if(playerMap[player].noMatches > 5)
                playerMap[player].totalAcc = playerMap[player].totalAcc / playerMap[player].noMatches;
            else {
                playerMap[player].totalAcc = 0
            }
          }
          
          const accuratePlayer = Object.keys(playerMap).reduce((a, b) => (playerMap[a].totalAcc > playerMap[b].totalAcc ? a : b));
          formatInsight(INSIGHTS.MOST_ACCURATE_PLAYER, undefined, undefined, undefined, {
            playerName: accuratePlayer,
            averageAccuracy: playerMap[accuratePlayer].totalAcc,
            noOfMatches: playerMap[accuratePlayer].noMatches,
          });
    }

    console.log(TournamentInsight)
    console.log("Analysed Games",analysedGames)
    console.log("Unanalysed Games", totalGames - analysedGames)
    return TournamentInsight
}

export default calculateAllInsights;