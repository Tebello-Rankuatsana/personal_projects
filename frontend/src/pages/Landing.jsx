import { useNavigate } from 'react-router-dom'
import { MessageSquare, ClipboardList, Layers, Gamepad2, Zap, ArrowRight, Lock, Cpu } from 'lucide-react'
import Button from '../components/Button.jsx'

const features = [
  {
    icon: MessageSquare,
    title: 'Chat with Documents',
    description: 'Upload PDFs, DOCX, or notes and have a real conversation with your study material using RAG.',
    color: 'oklch(55% 0.22 264)',
    bg: 'oklch(97% 0.02 264)',
  },
  {
    icon: ClipboardList,
    title: 'Unlimited Quizzes',
    description: 'Generate multiple choice, true/false, and short answer quizzes from any subject instantly.',
    color: 'oklch(52% 0.19 155)',
    bg: 'oklch(97% 0.015 155)',
  },
  {
    icon: Layers,
    title: 'Smart Flashcards',
    description: 'Auto-generate flashcards with spaced repetition difficulty tracking to optimise recall.',
    color: 'oklch(52% 0.21 45)',
    bg: 'oklch(97% 0.015 45)',
  },
  {
    icon: Gamepad2,
    title: 'Study Mini-Games',
    description: 'Memory match, fill-in-the-blanks, speed quizzes and more — learning disguised as play.',
    color: 'oklch(52% 0.21 25)',
    bg: 'oklch(97% 0.018 25)',
  },
]

const pillars = [
  { icon: Lock, label: 'Fully Private', desc: 'Everything stays on your machine' },
  { icon: Cpu, label: 'Local LLM', desc: 'Powered by Ollama — offline capable' },
  { icon: Zap, label: 'No Limits', desc: 'Unlimited uploads, chats, quizzes' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-surface)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Nav bar */}
      <nav style={{
        padding: '18px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, oklch(55% 0.22 264), oklch(42% 0.22 264))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={15} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            color: 'var(--color-text-primary)',
          }}>StudyOS</span>
        </div>
        <Button onClick={() => navigate('/dashboard')} size="sm">
          Enter App <ArrowRight size={13} />
        </Button>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '100px 48px 80px',
        textAlign: 'center',
        maxWidth: '740px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          backgroundColor: 'var(--color-brand-50)',
          borderRadius: '100px',
          border: '1px solid var(--color-brand-100)',
          fontSize: '12px',
          fontWeight: '500',
          color: 'oklch(48% 0.22 264)',
          marginBottom: '28px',
          letterSpacing: '0.02em',
        }}>
          <Lock size={11} />
          100% Local · No Subscriptions · No API Costs
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 6vw, 64px)',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-0.03em',
          color: 'var(--color-text-primary)',
          margin: '0 0 20px',
        }}>
          Your AI study workspace,{' '}
          <span style={{ fontStyle: 'italic', color: 'oklch(48% 0.22 264)' }}>
            self-hosted
          </span>
        </h1>

        <p style={{
          fontSize: '17px',
          color: 'var(--color-text-secondary)',
          lineHeight: '1.65',
          margin: '0 0 36px',
          fontWeight: '300',
        }}>
          Upload documents, chat with an AI tutor, generate unlimited quizzes and flashcards,
          and play study games — all running locally on your machine.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            onClick={() => navigate('/dashboard')}
            size="lg"
            style={{ gap: '9px' }}
          >
            Enter App <ArrowRight size={15} />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/library')}
          >
            Upload Documents
          </Button>
        </div>
      </section>

      {/* Pillars */}
      <section style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0',
        maxWidth: '640px',
        margin: '0 auto 72px',
        width: '100%',
        padding: '0 48px',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'white',
      }}>
        {pillars.map(({ icon: Icon, label, desc }, i) => (
          <div key={label} style={{
            flex: 1,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderRight: i < pillars.length - 1 ? '1px solid var(--color-border)' : 'none',
          }}>
            <Icon size={16} color="oklch(48% 0.22 264)" strokeWidth={1.8} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{label}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Features grid */}
      <section style={{
        padding: '0 48px 80px',
        maxWidth: '960px',
        margin: '0 auto',
        width: '100%',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          fontWeight: '400',
          textAlign: 'center',
          color: 'var(--color-text-primary)',
          marginBottom: '32px',
          letterSpacing: '-0.02em',
        }}>Everything you need to study smarter</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div key={title} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              transition: 'all 0.18s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px oklch(0% 0 0 / 7%)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}>
                <Icon size={18} color={color} strokeWidth={1.8} />
              </div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                margin: '0 0 6px',
              }}>{title}</h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: '1.55',
              }}>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '20px 48px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--color-text-muted)',
      }}>
        StudyOS — Self-hosted AI study platform. No cloud, no subscriptions, no data leaves your machine.
      </footer>
    </div>
  )
}