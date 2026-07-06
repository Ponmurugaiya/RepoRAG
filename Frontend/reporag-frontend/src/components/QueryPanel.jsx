import { useState } from 'react'
import { queryRepo } from '../api/repoApi'
import AnswerDisplay from './AnswerDisplay'
import Spinner from './Spinner'
import styles from './QueryPanel.module.css'

export default function QueryPanel({ repoUrl }) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleQuery() {
    if (!repoUrl.trim() || !question.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await queryRepo(repoUrl.trim(), question.trim())
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

  const canQuery = repoUrl.trim() && question.trim() && !loading

  return (
    <div className={styles.panel}>
      <h2>Step 2 — Ask a Question</h2>
      <p className={styles.hint}>
        {repoUrl.trim()
          ? `Asking about: ${repoUrl.trim()}`
          : 'Scan a repo first, then ask questions about it.'}
      </p>

      <textarea
        className={styles.textarea}
        rows={3}
        placeholder="What does this repository do? How is authentication handled?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleQuery()
        }}
        disabled={loading}
        aria-label="Question about the repository"
      />
      <p className={styles.shortcut}>Ctrl+Enter to submit</p>

      <button
        className={styles.btn}
        onClick={handleQuery}
        disabled={!canQuery}
        aria-busy={loading}
      >
        {loading ? <><Spinner /> Generating answer…</> : 'Ask Question'}
      </button>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {result && <AnswerDisplay result={result} />}
    </div>
  )
}
