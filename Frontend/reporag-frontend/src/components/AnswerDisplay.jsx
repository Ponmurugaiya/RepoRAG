import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './AnswerDisplay.module.css'

export default function AnswerDisplay({ result }) {
  return (
    <div className={styles.container}>
      <div className={styles.questionRow}>
        <span className={styles.label}>Q</span>
        <p className={styles.question}>{result.question}</p>
      </div>

      <div className={styles.answerRow}>
        <span className={styles.label}>A</span>
        <div className={styles.markdown}>
          <ReactMarkdown
            components={{
              // Render fenced code blocks with syntax highlighting
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ borderRadius: '8px', margin: '12px 0' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={styles.inlineCode} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {result.answer_markdown}
          </ReactMarkdown>
        </div>
      </div>

      <p className={styles.meta}>
        {result.top_chunks_used} context chunk{result.top_chunks_used !== 1 ? 's' : ''} used
      </p>
    </div>
  )
}
