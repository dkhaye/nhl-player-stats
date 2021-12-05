import * as React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Button from '@mui/material/Button';
import PlayerSearch from '../components/PlayerSearch';

export default function Home() {

  const onPlayerSelectHandle = async id => {
  const response = await fetch(
    "https://statsapi.web.nhl.com/api/v1/people/" + id + "/stats?stats=yearByYear"
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
      games: seasonHash.stat.games,
      goals: seasonHash.stat.goals,
      assists: seasonHash.stat.assists,
      toi: seasonHash.stat.timeOnIce,
    }
  }));
};

  return (
    <div className={styles.container}>
      <Head>
        <title>NHL Player Stats</title>
        <meta name="description" content="NextJS App to Look Up NHL Player Stats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <PlayerSearch />
      </main>
    </div>
  )
}
