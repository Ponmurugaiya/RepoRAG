import styles from './Navbar.module.css'

export default function Navbar({ user, signOut }) {
  const email = user?.signInDetails?.loginId || user?.username || 'User'

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.logo}>⬡</span>
        <span className={styles.title}>RepoRAG</span>
        <span className={styles.tagline}>AI Code Assistant</span>
      </div>
      <div className={styles.userArea}>
        <span className={styles.email} title={email}>{email}</span>
        <button className={styles.signOutBtn} onClick={signOut}>
          Sign out
        </button>
      </div>
    </header>
  )
}
