import { useState } from 'react'
import { ClipboardList, Plus, ChevronRight, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'

const MOCK_QUIZZES = [
  {
    id: '1',
    title: 'Biology Chapter 7 Quiz',
    subject: 'Biology',
    created_at: '2024-01-15',
    questionCount: 10,
    lastScore: 8,
  },
  {
    id: '2',
    title: 'Calculus Derivatives Quiz',
    subject: 'Mathematics',
    created_at: '2024-01-14',
    questionCount: 5,
    lastScore: null,
  },
]

const QUIZ_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
  { value: 'short_answer', label: 'Short Answer' },
]

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState(MOCK_QUIZZES)
  const [showGenerator, setShowGenerator] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [form, setForm] = useState({ subject: '', type: 'multiple_choice', count: 5 })

  const handleGenerate = () => {
    if (!form.subject.trim()) return
    setGenerating(true)
    setTimeout(() => {
      setQuizzes(prev => [{
        id: Date.now().toString(),
        title: `${form.subject} Quiz`,
        subject: form.subject,
        created_at: new Date().toISOString().split('T')[0],
        questionCount: form.count,
        lastScore: null,
      }, ...prev])
      setGenerating(false)
      setShowGenerator(false)
      setForm({ subject: '', type: 'multiple_choice', count: 5 })
    }, 1500)
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: '900px' }}>
      <PageHeader
        title="Quizzes"
        description="Generate unlimited quizzes from your uploaded documents."
        action={
          <Button onClick={() => setShowGenerator(!showGenerator)}>
            <Plus size={13} /> Generate Quiz
          </Button>
        }
      />

      {/* Generator panel */}
      {showGenerator && (
        <Card style={{ marginBottom: '24px', border: '1px solid var(--color-brand-200)', backgroundColor: 'var(--color-brand-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={15} color="oklch(48% 0.22 264)" />
            <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'oklch(48% 0.22 264)' }}>Generate New Quiz</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Subject</label>
              <input
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="e.g. Biology, Calculus"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-strong)',
                  fontSize: '13.5px',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Type</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-strong)',
                  fontSize: '13.5px',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  backgroundColor: 'white',
                }}
              >
                {QUIZ_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <Button onClick={handleGenerate} disabled={!form.subject.trim() || generating}>
              {generating ? 'Generating…' : 'Generate'}
            </Button>
          </div>
        </Card>
      )}

      {/* Quiz list */}
      {quizzes.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No quizzes yet"
          description="Generate your first quiz from uploaded documents. Multiple choice, true/false, or short answer."
          action={() => setShowGenerator(true)}
          actionLabel="Generate Quiz"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {quizzes.map(quiz => (
            <Card key={quiz.id} hoverable padding="18px 20px">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'oklch(97% 0.015 155)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <ClipboardList size={17} color="oklch(52% 0.19 155)" strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '3px' }}>
                    {quiz.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', gap: '10px' }}>
                    <span>{quiz.subject}</span>
                    <span>·</span>
                    <span>{quiz.questionCount} questions</span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> {quiz.created_at}
                    </span>
                  </div>
                </div>
                {quiz.lastScore !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                    <CheckCircle2 size={13} color="oklch(52% 0.19 155)" />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'oklch(52% 0.19 155)' }}>
                      {quiz.lastScore}/{quiz.questionCount}
                    </span>
                  </div>
                )}
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}