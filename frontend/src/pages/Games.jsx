import { useState } from 'react'
import { Gamepad2, Shuffle, PenLine, Zap, ToggleLeft,Play } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'

const GAME_TYPES = [
  {
    type: 'memory_match',
    label: 'Memory Match',
    description: 'Match terms to their definitions in a flipping card grid. Tests recall through pattern recognition.',
    icon: Shuffle,
    color: 'oklch(52% 0.22 264)',
    bg: 'oklch(97% 0.02 264)',
    badge: 'Focus & Memory',
  },
  {
    type: 'fill_blanks',
    label: 'Fill in the Blanks',
    description: 'Key words are removed from sentences. Type the missing terms from your study material.',
    icon: PenLine,
    color: 'oklch(52% 0.19 155)',
    bg: 'oklch(97% 0.015 155)',
    badge: 'Writing & Recall',
  },
  {
    type: 'speed_quiz',
    label: 'Speed Quiz',
    description: 'Rapid-fire questions with a countdown timer. Build fluency and instant recall under pressure.',
    icon: Zap,
    color: 'oklch(52% 0.21 75)',
    bg: 'oklch(97% 0.015 75)',
    badge: 'Speed & Recall',
  },
  {
    type: 'true_false_lightning',
    label: 'True / False Lightning',
    description: 'Swipe left or right on statements. Fast-paced review to reinforce key facts.',
    icon: ToggleLeft,
    color: 'oklch(52% 0.21 25)',
    bg: 'oklch(97% 0.018 25)',
    badge: 'Quick Review',
  },
]

const MOCK_GAMES = [
  { id: '1', type: 'memory_match', subject: 'Biology', title: 'Biology Memory Match', created_at: '2024-01-15' },
  { id: '2', type: 'speed_quiz', subject: 'Mathematics', title: 'Math Speed Quiz', created_at: '2024-01-14' },
]

export default function Games() {
  const [games, setGames] = useState(MOCK_GAMES)
  const [selected, setSelected] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [subject, setSubject] = useState('')

  const handleGenerate = () => {
    if (!selected || !subject.trim()) return
    setGenerating(true)
    const type = GAME_TYPES.find(g => g.type === selected)
    setTimeout(() => {
      setGames(prev => [{
        id: Date.now().toString(),
        type: selected,
        subject,
        title: `${subject} — ${type?.label}`,
        created_at: new Date().toISOString().split('T')[0],
      }, ...prev])
      setGenerating(false)
      setSelected(null)
      setSubject('')
    }, 1200)
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: '900px' }}>
      <PageHeader
        title="Study Games"
        description="Gamified learning generated from your documents. Make studying actually fun."
      />

      {/* Game type selector */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px',
        }}>Choose a game type</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px',
        }}>
          {GAME_TYPES.map(({ type, label, description, icon: Icon, color, bg, badge }) => (
            <div
              key={type}
              onClick={() => setSelected(selected === type ? null : type)}
              style={{
                padding: '18px',
                borderRadius: '12px',
                border: `2px solid ${selected === type ? color : 'var(--color-border)'}`,
                backgroundColor: selected === type ? bg : 'white',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                if (selected !== type) {
                  e.currentTarget.style.borderColor = 'var(--color-border-strong)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                if (selected !== type) {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                fontSize: '10px',
                fontWeight: '600',
                backgroundColor: selected === type ? color : 'var(--color-surface-overlay)',
                color: selected === type ? 'white' : 'var(--color-text-muted)',
                padding: '2px 7px',
                borderRadius: '100px',
                letterSpacing: '0.02em',
                transition: 'all 0.15s',
              }}>{badge}</div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: selected === type ? 'white' : bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                boxShadow: selected === type ? `0 2px 8px ${color}30` : 'none',
                transition: 'all 0.2s',
              }}>
                <Icon size={17} color={color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                {label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                {description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate form */}
      {selected && (
        <Card style={{ marginBottom: '28px', border: '1px solid var(--color-brand-200)', backgroundColor: 'var(--color-brand-50)' }}>
          <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'oklch(48% 0.22 264)', marginBottom: '12px' }}>
            Generate: {GAME_TYPES.find(g => g.type === selected)?.label}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Subject (e.g. Biology, History)"
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '8px',
                border: '1px solid var(--color-border-strong)',
                fontSize: '13.5px', fontFamily: 'var(--font-sans)', outline: 'none', backgroundColor: 'white',
              }}
            />
            <Button onClick={handleGenerate} disabled={!subject.trim() || generating}>
              <Play size={13} /> {generating ? 'Generating…' : 'Create Game'}
            </Button>
          </div>
        </Card>
      )}

      {/* Saved games */}
      <div>
        <h2 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px',
        }}>Saved Games</h2>

        {games.length === 0 ? (
          <EmptyState
            icon={Gamepad2}
            title="No games yet"
            description="Choose a game type above and select a subject to generate your first study game."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {games.map(game => {
              const gameType = GAME_TYPES.find(g => g.type === game.type)
              const Icon = gameType?.icon || Gamepad2
              return (
                <Card key={game.id} hoverable padding="15px 18px">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '9px',
                      backgroundColor: gameType?.bg || 'var(--color-surface-overlay)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={16} color={gameType?.color || 'var(--color-text-secondary)'} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{game.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {gameType?.label} · {game.subject} · {game.created_at}
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" style={{ gap: '5px' }}>
                      <Play size={11} /> Play
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}