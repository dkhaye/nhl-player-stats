import * as React from 'react';
import Head from 'next/head';

import styles from 'styles/Home.module.css';
import PlayerSearch from 'components/PlayerSearch';

export default function Home() {
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
