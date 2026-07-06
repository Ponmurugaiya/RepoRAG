import styles from './Navbar.module.css'

export default function Navbar({ user, signOut }) {
  // For Google sign-in, name/email come from user.attributes
  // For email/password sign-in, loginId holds the email
  const displayName =
    user?.attributes?.name ||
    user?.attributes?.email ||
    user?.signInDetails?.loginId ||
    user?.username ||
    'User'

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
