//
// Pages/index.js
//
// Main entry point for the application.
// Includes the API call functions
//

import * as React from 'react';
import Head from 'next/head';

import styles from 'styles/Home.module.css';
import PlayerSearch from '@/components/PlayerSearch';
import SeasonStats from '@/components/SeasonStats';

//
//  Function: Home
//  Description: maintains application state and passes API functions to child components
//  Input: none
//  Output: PlayerSearch and SeasonStats components
//
export default function Home() {
  const [players, setPlayers] = React.useState([]);
  const [stats, setStats] = React.useState([]);

  //
  //  Function: onSearchHandleChange
  //  Description: fetches 10 players that match the provide search value
  //  Input: value = search string
  //  Output: none
  //  Effect: updates players state object using setPlayers to matching players
  //
  //  API: https://suggest.svc.nhl.com/svc/suggest/v1/minplayers/<search_str>/<res_count>
  //    Input:  search_str - player name string to search
  //            res_count - number of players to return
  //    Example Input: patrick kane/10
  //    Example Output: {"suggestions":["8474141|Kane|Patrick|1|0|5\u0027 10\"|177|Buffalo|NY|USA|1988-11-19|CHI|R|88|patrick-kane-8474141"]}
  //
  const onSearchChangeHandle = async value => {
    if(value) {
      const response = await fetch(
        "https://suggest.svc.nhl.com/svc/suggest/v1/minplayers/" + value + "/10"
      );

      const players = await response.json();

      setPlayers(players["suggestions"].map( str => {
        let els = str.split("|");
        let playerObj = {
          name: els[2] + " " + els[1],
          id: els[0]
        };
        return playerObj;
      }));
    } else {
      setPlayers([]);
    }
  };

  //
  //  Function: onPlayerSelectChange
  //  Description: fetches year/team statistics for the player's career
  //  Input: value = player object { name: "first last", id: player_id# }
  //  Output: none
  //  Effect: updates stats state object using setStats. Filters out non-NHL seasons.
  //
  //  API: https://statsapi.web.nhl.com/api/v1/people/<player_id>/stats?stats=yearByYear
  //    Input:  player_id - player_id of selected player
  //    Example Input: 8474141
  //    Example Output (trimmed to single season): 
  /* {
        "copyright" : "NHL and the NHL Shield are registered trademarks of the National Hockey League. NHL and NHL team marks are the property of the NHL and its teams. © NHL 2021. All Rights Reserved.",
        "stats" : [ {
          "season" : "20072008",
          "stat" : {
            "timeOnIce" : "1505:59",
            "assists" : 51,
            "goals" : 21,
            "pim" : 52,
            "shots" : 191,
            "games" : 82,
            "hits" : 16,
            "powerPlayGoals" : 7,
            "powerPlayPoints" : 28,
            "powerPlayTimeOnIce" : "323:30",
            "evenTimeOnIce" : "1174:10",
            "penaltyMinutes" : "52",
            "faceOffPct" : 61.54,
            "shotPct" : 10.99,
            "gameWinningGoals" : 4,
            "overTimeGoals" : 1,
            "shortHandedGoals" : 0,
            "shortHandedPoints" : 0,
            "shortHandedTimeOnIce" : "08:19",
            "blocked" : 7,
            "plusMinus" : -5,
            "points" : 72,
            "shifts" : 1838
          },
          "team" : {
            "id" : 16,
            "name" : "Chicago Blackhawks",
            "link" : "/api/v1/teams/16"
          },
          "league" : {
            "id" : 133,
            "name" : "National Hockey League",
            "link" : "/api/v1/league/133"
          },
          "sequenceNumber" : 1
        }
      ]}
  */
  //    
  const onPlayerSelectHandle = async value => {
    if (value && value.id) {
      const response = await fetch(
        "https://statsapi.web.nhl.com/api/v1/people/" + value.id + "/stats?stats=yearByYear"
      );
      const rawStats = await response.json();

      if (!rawStats || !rawStats["stats"]) {
        return {}
      }

      const nhlSeasons = rawStats["stats"][0]["splits"].filter( seasonHash => {
        return seasonHash["league"]["name"] == "National Hockey League"
      });

      setStats(nhlSeasons.map( seasonHash => {
        return {
          year: seasonHash.season.substr(0,4) + " - " + seasonHash.season.substr(4,4),
          team: seasonHash.team.name,
          ...seasonHash.stat
        }
      }));
    } else {
      setStats([]);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>NHL Player Stats</title>
        <meta name="description" content="NextJS App to Look Up NHL Player Stats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <PlayerSearch
          players={players}
          onSearchChangeHandle={onSearchChangeHandle}
          onPlayerSelectHandle={onPlayerSelectHandle}
        />
        <SeasonStats stats={stats} />
      </main>
    </div>
  )
}
