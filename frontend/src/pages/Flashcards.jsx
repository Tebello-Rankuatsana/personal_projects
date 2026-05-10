import { useState } from 'react'
import { Layers, Plus, RotateCcw, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'

const MOCK_CARDS = [
  { id: '1', front: 'What is photosynthesis?', back: 'The process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of glucose.', subject: 'Biology', difficulty: 'easy' },
  { id: '2', front: 'Define mitosis', back: 'A type of cell division resulting in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.', subject: 'Biology', difficulty: 'medium' },
  { id: '3', front: 'What is the derivative of sin(x)?', back: 'cos(x)', subject: 'Mathematics', difficulty: 'easy' },
  { id: '4', front: 'State Newton\'s Second Law', back: 'F = ma — The net force acting on an object equals the product of its mass and acceleration.', subject: 'Physics', difficulty: 'medium' },
  { id: '5', front: 'What is the quadratic formula?', back: 'x = (-b ± √(b² - 4ac)) / 2a', subject: 'Mathematics', difficulty: 'hard' },
  { id: '6', front: 'Define osmosis', back: 'The movement of water molecules through a semipermeable membrane from a region of lower solute concentration to a region of higher solute concentration.', subject: 'Biology', difficulty: 'medium' },
]

const difficultyColors = {
  new: { bg: 'oklch(93% 0.008 264)', color: 'oklch(50% 0.012 264)' },
  easy: { bg: 'oklch(93% 0.08 155)', color: 'oklch(42% 0.15 155)' },
  medium: { bg: 'oklch(94% 0.08 75)', color: 'oklch(42% 0.15 75)' },
  hard: { bg: 'oklch(94% 0.08 25)', color: 'oklch(42% 0.15 25)' },
}

function FlashCard({ card, onUpdateDifficulty }) {
  const [flipped, setFlipped] = useState(false)
  const diff = difficultyColors[card.difficulty] || difficultyColors.new

  return (
    <div
      className={`flip-card${flipped ? ' flipped' : ''}`}
      style={{ height: '200px', cursor: 'pointer' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div className="flip-card-inner" style={{ width: '100%', height: '100%' }}>
        {/* Front */}
        <div className="flip-card-front" style={{
          backgroundColor: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}>Question</span>
            <span style={{
              fontSize: '10.5px',
              fontWeight: '500',
              backgroundColor: diff.bg,
              color: diff.color,
              padding: '2px 8px',
              borderRadius: '100px',
            }}>{card.difficulty}</span>
          </div>
          <p style={{
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            fontWeight: '500',
            lineHeight: '1.5',
            margin: 0,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}>{card.front}</p>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RotateCcw size={10} /> Click to reveal answer
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back" style={{
          backgroundColor: 'oklch(48% 0.22 264)',
          border: '1px solid oklch(42% 0.22 264)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'oklch(80% 0.08 264)',
          }}>Answer</span>
          <p style={{
            fontSize: '13.5px',
            color: 'white',
            lineHeight: '1.55',
            margin: 0,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}>{card.back}</p>
          <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => { onUpdateDifficulty(card.id, 'easy'); setFlipped(false) }}
              style={{
                flex: 1, padding: '6px', borderRadius: '7px',
                backgroundColor: 'oklch(60% 0.22 264)', border: 'none',
                color: 'white', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                fontFamily: 'var(--font-sans)',
              }}>
              <CheckCircle size={12} /> Got it
            </button>
            <button
              onClick={() => { onUpdateDifficulty(card.id, 'hard'); setFlipped(false) }}
              style={{
                flex: 1, padding: '6px', borderRadius: '7px',
                backgroundColor: 'oklch(40% 0.22 264)', border: 'none',
                color: 'white', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                fontFamily: 'var(--font-sans)',
              }}>
              <XCircle size={12} /> Review again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Flashcards() {
  const [cards, setCards] = useState(MOCK_CARDS)
  const [filter, setFilter] = useState('all')
  const [showGenerator, setShowGenerator] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [subject, setSubject] = useState('')

  const handleUpdateDifficulty = (id, difficulty) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, difficulty } : c))
  }

  const handleGenerate = () => {
    if (!subject.trim()) return
    setGenerating(true)
    setTimeout(() => {
      setCards(prev => [{
        id: Date.now().toString(),
        front: 'Sample question from ' + subject,
        back: 'Sample answer generated by AI',
        subject,
        difficulty: 'new',
      }, ...prev])
      setGenerating(false)
      setShowGenerator(false)
      setSubject('')
    }, 1200)
  }

  const filtered = filter === 'all' ? cards : cards.filter(c => c.difficulty === filter)

  return (
    <div style={{ padding: '36px 40px', maxWidth: '900px' }}>
      <PageHeader
        title="Flashcards"
        description="Auto-generated flashcards with spaced repetition difficulty tracking."
        action={
          <Button onClick={() => setShowGenerator(!showGenerator)}>
            <Plus size={13} /> Generate Cards
          </Button>
        }
      />

      {/* Generator panel */}
      {showGenerator && (
        <Card style={{ marginBottom: '20px', border: '1px solid var(--color-brand-200)', backgroundColor: 'var(--color-brand-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={15} color="oklch(48% 0.22 264)" />
            <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'oklch(48% 0.22 264)' }}>Generate Flashcards</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Subject or topic"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border-strong)',
                fontSize: '13.5px',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                backgroundColor: 'white',
              }}
            />
            <Button onClick={handleGenerate} disabled={!subject.trim() || generating}>
              {generating ? 'Generating…' : 'Generate'}
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'new', 'easy', 'medium', 'hard'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 13px',
              borderRadius: '100px',
              border: '1px solid',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s',
              backgroundColor: filter === f ? 'oklch(48% 0.22 264)' : 'white',
              color: filter === f ? 'white' : 'var(--color-text-secondary)',
              borderColor: filter === f ? 'oklch(48% 0.22 264)' : 'var(--color-border-strong)',
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? `All (${cards.length})` : `${f} (${cards.filter(c => c.difficulty === f).length})`}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No flashcards"
          description="Generate flashcards from your uploaded documents."
          action={() => setShowGenerator(true)}
          actionLabel="Generate Flashcards"
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '14px',
        }}>
          {filtered.map(card => (
            <FlashCard key={card.id} card={card} onUpdateDifficulty={handleUpdateDifficulty} />
          ))}
        </div>
      )}
    </div>
  )
}