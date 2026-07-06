import apiClient from './client'

/**
 * POST /scan
 * Triggers a repo scan. Returns status, namespace, commit info.
 */
export async function scanRepo(repoUrl) {
  const { data } = await apiClient.post('/scan', { repo_url: repoUrl })
  return data
}

/**
 * POST /query
 * Asks a question about a previously scanned repo.
 */
export async function queryRepo(repoUrl, question) {
  const { data } = await apiClient.post('/query', {
    repo_url: repoUrl,
    question,
  })
  return data
}
