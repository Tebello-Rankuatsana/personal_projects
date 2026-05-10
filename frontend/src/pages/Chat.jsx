import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react'
// import Button from '../components/Button.jsx'

const MODES = [
  { value: 'default', label: 'Default' },
  { value: 'explain', label: 'Explain Simply' },
  { value: 'lecturer', label: 'Lecturer' },
  { value: 'step_by_step', label: 'Step-by-Step' },
  { value: 'exam_revision', label: 'Exam Revision' },
]

const SAMPLE_MESSAGES = [
  {
    role: 'assistant',
    content: 'Hello! I\'m your AI study tutor. Upload documents in the Library, then ask me anything about them. I\'ll use your study material to give you accurate, contextual answers.',
  },
]

export default function Chat() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES)
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('default')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || loading) return

    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setInput('')
    setLoading(true)

    // Simulate response (replace with actual API call)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'This is a placeholder response. Connect the backend to get real AI answers from your documents.',
      }])
      setLoading(false)
    }, 800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-surface)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, oklch(55% 0.22 264), oklch(42% 0.22 264))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={15} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>AI Tutor</div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>Powered by Ollama · RAG-enabled</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              style={{
                padding: '6px 28px 6px 10px',
                borderRadius: '7px',
                border: '1px solid var(--color-border-strong)',
                fontSize: '12.5px',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'white',
                appearance: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}
            >
              <option value="">All subjects</option>
              <option value="general">General</option>
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <select
              value={mode}
              onChange={e => setMode(e.target.value)}
              style={{
                padding: '6px 28px 6px 10px',
                borderRadius: '7px',
                border: '1px solid var(--color-border-strong)',
                fontSize: '12.5px',
                color: 'oklch(48% 0.22 264)',
                backgroundColor: 'var(--color-brand-50)',
                appearance: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: '500',
                outline: 'none',
              }}
            >
              {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'oklch(48% 0.22 264)' }} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="chat-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              maxWidth: '100%',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: msg.role === 'assistant' ? 'oklch(97% 0.02 264)' : 'oklch(18% 0.01 264)',
              border: '1px solid var(--color-border)',
            }}>
              {msg.role === 'assistant'
                ? <Bot size={14} color="oklch(48% 0.22 264)" />
                : <User size={14} color="white" />
              }
            </div>
            {/* Bubble */}
            <div style={{
              maxWidth: '72%',
              backgroundColor: msg.role === 'assistant' ? 'white' : 'oklch(48% 0.22 264)',
              color: msg.role === 'assistant' ? 'var(--color-text-primary)' : 'white',
              borderRadius: msg.role === 'assistant' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
              padding: '12px 16px',
              fontSize: '14px',
              lineHeight: '1.6',
              border: msg.role === 'assistant' ? '1px solid var(--color-border)' : 'none',
              boxShadow: '0 1px 3px oklch(0% 0 0 / 5%)',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              backgroundColor: 'oklch(97% 0.02 264)',
              border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Bot size={14} color="oklch(48% 0.22 264)" />
            </div>
            <div style={{
              backgroundColor: 'white',
              border: '1px solid var(--color-border)',
              borderRadius: '4px 12px 12px 12px',
              padding: '12px 16px',
              display: 'flex',
              gap: '5px',
              alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: 'oklch(48% 0.22 264)',
                  animation: 'bounce 1.2s infinite',
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.7,
                }} />
              ))}
              <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0) } 30% { transform: translateY(-5px) } }`}</style>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'white',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: '10px',
          padding: '10px 14px',
          transition: 'border-color 0.15s',
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'oklch(55% 0.22 264)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--color-border-strong)'}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI tutor anything about your documents…"
            rows={1}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              color: 'var(--color-text-primary)',
              resize: 'none',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.5',
              maxHeight: '120px',
              overflowY: 'auto',
            }}
            onInput={e => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: input.trim() && !loading ? 'oklch(48% 0.22 264)' : 'var(--color-border)',
              border: 'none',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.15s',
            }}
          >
            <Send size={14} color="white" />
          </button>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px', textAlign: 'center' }}>
          Press Enter to send · Shift+Enter for new line · Mode: <strong>{MODES.find(m => m.value === mode)?.label}</strong>
        </div>
      </div>
    </div>
  )
}