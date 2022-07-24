import React from "react";
import Link from 'next/link';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';


const Home: NextPage = () => (
  <EuiFlexGroup
    gutterSize="m"
    direction="column"
  >
    <EuiFlexItem>
      {/* <Link href="/newgame">New game</Link> */}
        <Link href="/newgame" passHref>
          <EuiButton fill>xx</EuiButton>
        </Link>
    </EuiFlexItem>
    <EuiFlexItem grow={true}>
      <EuiButton fullWidth href="/teams">Teams</EuiButton>
    </EuiFlexItem>
    <EuiFlexItem grow={true}>
      <EuiButton fullWidth href="/words">Words &amp; categories</EuiButton>
    </EuiFlexItem>
  </EuiFlexGroup>
);


export default Home;
