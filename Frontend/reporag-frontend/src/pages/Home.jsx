import { useState } from 'react'
import Navbar from '../components/Navbar'
import ScanPanel from '../components/ScanPanel'
import QueryPanel from '../components/QueryPanel'
import styles from './Home.module.css'

export default function Home({ signOut, user }) {
  // repoUrl is shared between panels — scan sets it, query reads it
  const [repoUrl, setRepoUrl] = useState('')

  return (
    <div className={styles.layout}>
      <Navbar user={user} signOut={signOut} />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.heading}>Understand any repository, instantly.</h1>
            <p className={styles.sub}>
              Scan a public GitHub repo, then ask questions about the code in plain English.
            </p>
          </div>

          <div className={styles.panels}>
            <ScanPanel repoUrl={repoUrl} setRepoUrl={setRepoUrl} />
            <QueryPanel repoUrl={repoUrl} />
          </div>
        </div>
      </main>
    </div>
  )
}
