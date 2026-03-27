import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, FileText, CheckCircle, ChevronLeft } from 'lucide-react';
import axios from 'axios';

function LessonViewPage() {
  const { lessonId } = useParams();
  const [activeTab, setActiveTab] = useState('video');
  const [lessonData, setLessonData] = useState(null);
  const [videoState, setVideoState] = useState({ url: null, loading: false, error: null, jobId: null });

  useEffect(() => {
    // Fetch lesson Theory
    axios.get(`/api/lesson/${lessonId}`)
      .then(res => setLessonData(res.data))
      .catch(err => console.error(err));
  }, [lessonId]);

  // Handle Video Generation Polling
  useEffect(() => {
    if (!videoState.jobId) return;
    const interval = setInterval(() => {
      axios.get(`/api/video/status/${videoState.jobId}`)
        .then(res => {
          if (res.data.status === 'completed') {
            setVideoState(prev => ({ ...prev, url: res.data.videoUrl, loading: false, jobId: null }));
            clearInterval(interval);
          } else if (res.data.status === 'failed') {
            setVideoState(prev => ({ ...prev, error: 'Video generation failed', loading: false, jobId: null }));
            clearInterval(interval);
          }
        })
        .catch(() => {
          setVideoState(prev => ({ ...prev, error: 'Failed to check status', loading: false, jobId: null }));
          clearInterval(interval);
        });
    }, 2000);
    return () => clearInterval(interval);
  }, [videoState.jobId]);

  const generateVideo = () => {
    setVideoState({ url: null, loading: true, error: null, jobId: null });
    axios.post(`/api/lesson/${lessonId}/video`, { topic: lessonData?.title || 'Lesson Overview' })
      .then(res => {
        if (res.data.jobId) {
           setVideoState(prev => ({ ...prev, jobId: res.data.jobId }));
        } else if (res.data.script) {
           // Fallback if sync
           setVideoState(prev => ({ ...prev, url: res.data.script.videoUrl || '', loading: false }));
        }
      })
      .catch(err => setVideoState({ url: null, loading: false, error: err.message, jobId: null }));
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Lesson Content Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-dark)' }}>
        
        {/* Top Navbar */}
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <ChevronLeft size={20} /> Back to Course
          </Link>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{lessonData?.title || 'Loading Lesson...'}</h2>
          <Link to={`/lesson/${lessonId}/quiz`} className="btn btn-outline" style={{ borderRadius: '20px' }}>
            <CheckCircle size={16} /> Take Quiz
          </Link>
        </div>

        {/* Video / Tab Area */}
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <button 
              className={`btn ${activeTab === 'video' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('video')}
              style={{ border: 'none', borderRadius: '4px', background: activeTab === 'video' ? '' : 'transparent' }}
            >
              <PlayCircle size={18} /> Explainer Video
            </button>
            <button 
              className={`btn ${activeTab === 'theory' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('theory')}
              style={{ border: 'none', borderRadius: '4px', background: activeTab === 'theory' ? '' : 'transparent' }}
            >
              <FileText size={18} /> Theory & Notes
            </button>
          </div>

          {/* Tab Content */}
          <div className="card glass-panel" style={{ minHeight: '500px' }}>
            {activeTab === 'video' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                {!videoState.url && !videoState.loading && (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <PlayCircle size={64} color="var(--border)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>No Video Generated Yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Generate an AI-powered visual explainer for this lesson.</p>
                    <button className="btn btn-primary" onClick={generateVideo}>
                      <Sparkles size={18} /> Generate Manim Video
                    </button>
                  </div>
                )}
                
                {videoState.loading && (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" style={{ margin: '0 auto 2rem', width: '40px', height: '40px', borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
                    <h3 style={{ color: 'var(--primary)' }}>Rendering Visuals...</h3>
                    <p style={{ color: 'var(--text-muted)' }}>The Python engine is crunching frames. This usually takes 30-60 seconds.</p>
                  </div>
                )}

                {videoState.url && (
                  <div style={{ width: '100%', maxWidth: '900px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                    <video 
                      src={videoState.url} 
                      controls 
                      autoPlay 
                      style={{ width: '100%', display: 'block' }}
                    />
                  </div>
                )}
                
                {videoState.error && (
                  <div style={{ color: '#ef4444', padding: '1rem', border: '1px solid #ef4444', borderRadius: '8px' }}>
                    Error: {videoState.error}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'theory' && (
              <div className="theory-content animate-fade-in" style={{ padding: '1rem' }}>
                {lessonData?.content ? (
                  <>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Explanation</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>{lessonData.content.explanation}</p>
                    
                    <h3 style={{ fontSize: '1.3rem', marginTop: '2rem', marginBottom: '1rem' }}>Key Concepts</h3>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.7' }}>
                      {lessonData.content.key_concepts?.map((kc, i) => <li key={i}>{kc}</li>)}
                    </ul>

                    <h3 style={{ fontSize: '1.3rem', marginTop: '2rem', marginBottom: '1rem' }}>Examples</h3>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.7' }}>
                      {lessonData.content.examples?.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ul>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <div className="spinner" style={{ margin: '0 auto 1rem', borderColor: 'var(--text-muted)' }}></div>
                    Loading structured AI theory...
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple Sparkles component missing import
const Sparkles = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
  </svg>
);

export default LessonViewPage;
