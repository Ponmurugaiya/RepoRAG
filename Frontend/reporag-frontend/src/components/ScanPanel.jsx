import { useState } from 'react'
import { scanRepo } from '../api/repoApi'
import Spinner from './Spinner'
import styles from './ScanPanel.module.css'

export default function ScanPanel({ repoUrl, setRepoUrl }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleScan() {
    if (!repoUrl.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await scanRepo(repoUrl.trim())
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.panel}>
      <h2>Step 1 — Scan Repository</h2>
      <p className={styles.hint}>Paste a public GitHub repo URL to index it.</p>

      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="https://github.com/owner/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          disabled={loading}
          aria-label="GitHub repository URL"
        />
        <button
          className={styles.btn}
          onClick={handleScan}
          disabled={loading || !repoUrl.trim()}
          aria-busy={loading}
        >
          {loading ? <><Spinner /> Scanning…</> : 'Scan Repo'}
        </button>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className={styles.result} role="status">
          <StatusBadge status={result.status} />
          <dl className={styles.meta}>
            <dt>Namespace</dt><dd>{result.namespace}</dd>
            <dt>Last commit</dt><dd className={styles.mono}>{result.last_commit}</dd>
            {result.status === 'scanned' && (
              <>
                <dt>Files scanned</dt><dd>{result.files_scanned}</dd>
                <dt>Vectors upserted</dt><dd>{result.vectors_upserted}</dd>
              </>
            )}
          </dl>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    scanned: { label: 'Scanned ✓', cls: 'success' },
    already_scanned: { label: 'Up to date ✓', cls: 'info' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'info' }
  return <span className={`${styles.badge} ${styles[cls]}`}>{label}</span>
}
