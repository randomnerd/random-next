import React from "react";
import Link from 'next/link';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';


const Home: NextPage = () => (
  <Button.Group vertical fluid>
    <Link href="/newgame" passHref>
      <Button primary className={styles.Button} size="big">New game</Button>
    </Link>
    <Link href="/teams" passHref>
      <Button className={styles.Button} size="big">Teams</Button>
    </Link>
    <Link href="/words" passHref>
      <Button className={styles.Button} size="big">Words &amp; categories</Button>
    </Link>
  </Button.Group>
);


export default Home;
