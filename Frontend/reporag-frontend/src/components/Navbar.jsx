import { useEffect, useState } from 'react'
import { fetchUserAttributes } from 'aws-amplify/auth'
import styles from './Navbar.module.css'

export default function Navbar({ user, signOut }) {
  const [displayName, setDisplayName] = useState(user?.username || 'User')

  useEffect(() => {
    fetchUserAttributes()
      .then((attrs) => {
        console.log('fetchUserAttributes result:', JSON.stringify(attrs, null, 2))
        const name = attrs.name || attrs.email || user?.username || 'User'
        setDisplayName(name)
      })
      .catch((err) => {
        console.log('fetchUserAttributes error:', err)
        setDisplayName(user?.username || 'User')
      })
  }, [user])

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>⬡</span>
        <span className={styles.title}>RepoRAG</span>
        <span className={styles.tagline}>AI Code Assistant</span>
      </div>
      <div className={styles.userArea}>
        <span className={styles.email} title={displayName}>{displayName}</span>
        <button className={styles.signOutBtn} onClick={signOut}>
          Sign out
        </button>
      </div>
    </header>
  )
}
