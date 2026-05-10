import { useNavigate } from 'react-router-dom'
import { BookOpen, ClipboardList, Layers, Gamepad2, ArrowRight, MessageSquare, Upload, TrendingUp } from 'lucide-react'
import Card from '../components/Card.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'

const stats = [
  { label: 'Documents', value: '0', icon: BookOpen, color: 'oklch(55% 0.22 264)', bg: 'oklch(97% 0.02 264)', to: '/library' },
  { label: 'Quizzes Created', value: '0', icon: ClipboardList, color: 'oklch(52% 0.19 155)', bg: 'oklch(97% 0.015 155)', to: '/quizzes' },
  { label: 'Flashcards', value: '0', icon: Layers, color: 'oklch(52% 0.21 45)', bg: 'oklch(97% 0.015 45)', to: '/flashcards' },
  { label: 'Games Played', value: '0', icon: Gamepad2, color: 'oklch(52% 0.21 25)', bg: 'oklch(97% 0.018 25)', to: '/games' },
]

const quickActions = [
  { label: 'Upload a document', description: 'Add study material to your library', icon: Upload, to: '/library' },
  { label: 'Chat with AI tutor', description: 'Ask questions about your documents', icon: MessageSquare, to: '/chat' },
  { label: 'Generate a quiz', description: 'Test your knowledge instantly', icon: ClipboardList, to: '/quizzes' },
  { label: 'Study flashcards', description: 'Reinforce memory with spaced repetition', icon: Layers, to: '/flashcards' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '36px 40px', maxWidth: '900px' }}>
      <PageHeader
        title="Dashboard"
        description="Your personal AI study workspace — fully local, fully private."
      />

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '36px',
      }}>
        {stats.map(({ label, value, icon: Icon, color, bg, to }) => (
          <Card key={label} hoverable onClick={() => navigate(to)} padding="20px">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                backgroundColor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={16} color={color} strokeWidth={1.8} />
              </div>
              <ArrowRight size={13} color="var(--color-text-muted)" />
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: '1',
              marginBottom: '4px',
            }}>{value}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontWeight: '500' }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px',
        }}>Quick Actions</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
        }}>
          {quickActions.map(({ label, description, icon: Icon, to }) => (
            <Card key={label} hoverable onClick={() => navigate(to)} padding="16px 18px">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={16} color="oklch(48% 0.22 264)" strokeWidth={1.8} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{description}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <Card style={{ background: 'linear-gradient(135deg, oklch(97% 0.02 264), oklch(96% 0.015 220))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, oklch(55% 0.22 264), oklch(42% 0.22 264))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingUp size={20} color="white" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '3px' }}>
                Get started with StudyOS
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Upload your first document to begin learning with AI
              </div>
            </div>
          </div>
          <Button onClick={() => navigate('/library')} style={{ gap: '7px' }}>
            Upload Document <ArrowRight size={13} />
          </Button>
        </div>
      </Card>
    </div>
  )
}