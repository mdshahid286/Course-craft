import { useState, useEffect } from 'react'

function VideoGeneratorTest() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [rendering, setRendering] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [jobId, setJobId] = useState(null)

  // Poll for job status when jobId is set
  useEffect(() => {
    if (!jobId) return

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/video/status/${jobId}`)
        if (!res.ok) {
          clearInterval(pollInterval)
          setError('Failed to check render status')
          setRendering(false)
          return
        }

        const status = await res.json()

        if (status.status === 'completed') {
          clearInterval(pollInterval)
          setRendering(false)
          setResult((prev) => ({
            ...prev,
            render: status.render,
            videoUrl: status.videoUrl, // Capture the URL from the status response
          }))
        } else if (status.status === 'failed') {
          clearInterval(pollInterval)
          setRendering(false)
          setError(status.error || 'Video rendering failed')
        }
      } catch {
        clearInterval(pollInterval)
        setRendering(false)
        setError('Error checking render status')
      }
    }, 2000)

    return () => clearInterval(pollInterval)
  }, [jobId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return
    setLoading(true)
    setRendering(false)
    setError('')
    setResult(null)
    setJobId(null)

    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, async: true, skipOutline: true }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to generate video')
      }

      const data = await res.json()

      if (data.jobId) {
        setJobId(data.jobId)
        setRendering(true)
        setResult(data)
      } else {
        setResult({
          ...data,
          videoUrl: data.videoUrl
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const videoUrl = result?.videoUrl || ''

  return (
    <div className="video-generator-test">
      <h2>Video Generator Test (Legacy)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. Introduction to Derivatives"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button type="submit" disabled={loading || rendering}>
          {loading ? 'Generating...' : rendering ? 'Rendering...' : 'Generate Video'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {rendering && <div>⏳ Rendering...</div>}
      
      {videoUrl && (
        <video src={videoUrl} controls style={{ width: '100%', marginTop: '20px' }} />
      )}
    </div>
  )
}

export default VideoGeneratorTest;
