import * as React from 'react';
import Head from 'next/head';

import styles from 'styles/Home.module.css';
import PlayerSearch from '@/components/PlayerSearch';
import SeasonStats from '@/components/SeasonStats';

export default function Home() {
  const [players, setPlayers] = React.useState([]);
  const [stats, setStats] = React.useState([]);

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
