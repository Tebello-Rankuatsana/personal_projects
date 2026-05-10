import { useState } from 'react'
import { Cpu, Palette, Database, Info, CheckCircle2, AlertCircle, ChevronDown, Server } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

const MODELS = [
  { value: 'mistral', label: 'Mistral 7B', description: 'Fast, balanced — recommended for most tasks' },
  { value: 'llama3', label: 'Llama 3 8B', description: 'High quality reasoning, slightly slower' },
  { value: 'phi3', label: 'Phi-3 Mini', description: 'Lightweight — best for low-RAM machines' },
  { value: 'gemma2', label: 'Gemma 2 9B', description: "Google's efficient instruction-tuned model" },
]

const EMBED_MODELS = [
  { value: 'nomic-embed-text', label: 'nomic-embed-text', description: 'Recommended — fast and accurate embeddings' },
  { value: 'mxbai-embed-large', label: 'mxbai-embed-large', description: 'Higher quality, larger model' },
]

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: '11px',
      fontWeight: '700',
      color: 'var(--color-text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      marginBottom: '10px',
      marginTop: '28px',
    }}>{children}</div>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      padding: '14px 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function StyledSelect({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '7px 32px 7px 12px',
          borderRadius: '8px',
          border: '1px solid var(--color-border-strong)',
          fontSize: '13px',
          fontFamily: 'var(--font-sans)',
          fontWeight: '500',
          color: 'var(--color-text-primary)',
          backgroundColor: 'white',
          appearance: 'none',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: '0 1px 2px oklch(0% 0 0 / 4%)',
          minWidth: '200px',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={13} style={{
        position: 'absolute', right: '10px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
        color: 'var(--color-text-muted)',
      }} />
    </div>
  )
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: '42px',
        height: '24px',
        borderRadius: '100px',
        backgroundColor: enabled ? 'oklch(48% 0.22 264)' : 'oklch(85% 0.01 264)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: 'white',
        top: '3px',
        left: enabled ? '21px' : '3px',
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px oklch(0% 0 0 / 20%)',
      }} />
    </button>
  )
}

function StatusBadge({ ok, label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '5px 12px',
      borderRadius: '8px',
      backgroundColor: ok ? 'oklch(95% 0.05 155)' : 'oklch(95% 0.05 25)',
      border: `1px solid ${ok ? 'oklch(80% 0.1 155)' : 'oklch(80% 0.1 25)'}`,
    }}>
      {ok
        ? <CheckCircle2 size={13} color="oklch(42% 0.15 155)" />
        : <AlertCircle size={13} color="oklch(42% 0.15 25)" />
      }
      <span style={{
        fontSize: '12.5px',
        fontWeight: '500',
        color: ok ? 'oklch(35% 0.15 155)' : 'oklch(35% 0.15 25)',
      }}>{label}</span>
    </div>
  )
}

export default function Settings() {
  const [llmModel, setLlmModel] = useState('mistral')
  const [embedModel, setEmbedModel] = useState('nomic-embed-text')
  const [darkMode, setDarkMode] = useState(false)
  const [streamResponses, setStreamResponses] = useState(true)
  const [autoSaveChats, setAutoSaveChats] = useState(true)
  const [chunkSize, setChunkSize] = useState(600)
  const [nResults, setNResults] = useState(5)
  const [saved, setSaved] = useState(false)

  const currentModel = MODELS.find(m => m.value === llmModel)
  const currentEmbed = EMBED_MODELS.find(m => m.value === embedModel)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: '720px' }}>
      <PageHeader
        title="Settings"
        description="Configure your local AI models, RAG pipeline, and app preferences."
        action={
          <Button onClick={handleSave} variant={saved ? 'secondary' : 'primary'}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </Button>
        }
      />

      {/* Service status */}
      <SectionTitle>Service Status</SectionTitle>
      <Card padding="16px 20px">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Backend API</div>
            <StatusBadge ok={true} label="localhost:5000 connected" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ollama</div>
            <StatusBadge ok={true} label="localhost:11434 running" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ChromaDB</div>
            <StatusBadge ok={false} label="localhost:8000 not reachable" />
          </div>
        </div>
      </Card>

      {/* AI Model configuration */}
      <SectionTitle>AI Models</SectionTitle>
      <Card padding="0 20px">
        <SettingRow
          label="Language Model (LLM)"
          description={currentModel?.description}
        >
          <StyledSelect value={llmModel} onChange={setLlmModel} options={MODELS} />
        </SettingRow>
        <SettingRow
          label="Embedding Model"
          description={currentEmbed?.description}
        >
          <StyledSelect value={embedModel} onChange={setEmbedModel} options={EMBED_MODELS} />
        </SettingRow>
        <SettingRow
          label="Stream Responses"
          description="Show AI responses word-by-word as they are generated"
        >
          <Toggle enabled={streamResponses} onChange={setStreamResponses} />
        </SettingRow>
      </Card>

      {/* RAG Pipeline */}
      <SectionTitle>RAG Pipeline</SectionTitle>
      <Card padding="0 20px">
        <SettingRow
          label="Chunk Size (words)"
          description="Number of words per document chunk. Larger = more context, slower."
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="range"
              min={200}
              max={1200}
              step={100}
              value={chunkSize}
              onChange={e => setChunkSize(Number(e.target.value))}
              style={{ width: '100px', accentColor: 'oklch(48% 0.22 264)' }}
            />
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'oklch(48% 0.22 264)',
              minWidth: '40px',
              textAlign: 'right',
            }}>{chunkSize}</span>
          </div>
        </SettingRow>
        <SettingRow
          label="Retrieved Chunks (n)"
          description="Number of document chunks retrieved per query. More = richer context."
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={nResults}
              onChange={e => setNResults(Number(e.target.value))}
              style={{ width: '100px', accentColor: 'oklch(48% 0.22 264)' }}
            />
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'oklch(48% 0.22 264)',
              minWidth: '24px',
              textAlign: 'right',
            }}>{nResults}</span>
          </div>
        </SettingRow>
      </Card>

      {/* App preferences */}
      <SectionTitle>App Preferences</SectionTitle>
      <Card padding="0 20px">
        <SettingRow
          label="Dark Mode"
          description="Switch to a darker colour scheme (coming soon)"
        >
          <Toggle enabled={darkMode} onChange={setDarkMode} />
        </SettingRow>
        <SettingRow
          label="Auto-save Chat History"
          description="Persist all chat sessions to the local database"
        >
          <Toggle enabled={autoSaveChats} onChange={setAutoSaveChats} />
        </SettingRow>
      </Card>

      {/* Setup guide */}
      <SectionTitle>Setup Guide</SectionTitle>
      <Card style={{ backgroundColor: 'oklch(98.5% 0.008 264)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
          <Info size={16} color="oklch(48% 0.22 264)" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
            Quick setup checklist
          </div>
        </div>
        {[
          { done: true, label: 'Install Ollama', cmd: 'https://ollama.com' },
          { done: false, label: 'Pull your LLM', cmd: `ollama pull ${llmModel}` },
          { done: false, label: 'Pull embedding model', cmd: `ollama pull ${embedModel}` },
          { done: false, label: 'Start ChromaDB', cmd: 'docker run -p 8000:8000 chromadb/chroma' },
          { done: true, label: 'Start backend', cmd: 'npm run dev (in /backend)' },
        ].map(({ done, label, cmd }) => (
          <div key={label} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '8px 0',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: done ? 'oklch(93% 0.08 155)' : 'var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }}>
              {done && <CheckCircle2 size={11} color="oklch(42% 0.15 155)" />}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                {label}
              </div>
              <code style={{
                fontSize: '11.5px',
                fontFamily: 'monospace',
                backgroundColor: 'white',
                border: '1px solid var(--color-border)',
                padding: '2px 7px',
                borderRadius: '5px',
                color: 'oklch(45% 0.22 264)',
              }}>{cmd}</code>
            </div>
          </div>
        ))}
      </Card>

      {/* Version info */}
      <div style={{
        marginTop: '20px',
        padding: '14px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      }}>
        <Server size={12} />
        StudyOS v1.0.0 · Node 22 · Vite + React · TailwindCSS v4
      </div>
    </div>
  )
}