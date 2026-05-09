import { useState, useRef } from 'react'
import { Upload, BookOpen, FileText, File, Trash2, Clock } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'

const MOCK_DOCS = [
  { id: '1', name: 'Biology Chapter 7.pdf', subject: 'Biology', file_type: 'application/pdf', chunk_count: 24, upload_date: '2024-01-15' },
  { id: '2', name: 'Calculus Notes.docx', subject: 'Mathematics', file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', chunk_count: 12, upload_date: '2024-01-14' },
]

function FileIcon({ type }) {
  const isPdf = type === 'application/pdf'
  return (
    <div style={{
      width: '38px',
      height: '38px',
      borderRadius: '9px',
      backgroundColor: isPdf ? 'oklch(97% 0.02 25)' : 'oklch(97% 0.02 264)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <FileText size={17} color={isPdf ? 'oklch(52% 0.21 25)' : 'oklch(48% 0.22 264)'} strokeWidth={1.6} />
    </div>
  )
}

export default function Library() {
  const [docs, setDocs] = useState(MOCK_DOCS)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleUpload = (files) => {
    if (!files || files.length === 0) return
    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      const newDocs = Array.from(files).map(f => ({
        id: Date.now().toString(),
        name: f.name,
        subject: 'General',
        file_type: f.type,
        chunk_count: Math.floor(Math.random() * 30) + 5,
        upload_date: new Date().toISOString().split('T')[0],
      }))
      setDocs(prev => [...newDocs, ...prev])
      setUploading(false)
    }, 1200)
  }

  const handleDelete = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: '900px' }}>
      <PageHeader
        title="Document Library"
        description="Upload PDFs, DOCX files, and text notes to power your AI tutor."
        action={
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload Document'}
          </Button>
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={e => handleUpload(e.target.files)}
      />

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault()
          setDragOver(false)
          handleUpload(e.dataTransfer.files)
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'oklch(55% 0.22 264)' : 'var(--color-border-strong)'}`,
          borderRadius: '12px',
          padding: '36px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? 'var(--color-brand-50)' : 'white',
          transition: 'all 0.2s ease',
          marginBottom: '24px',
        }}
      >
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          backgroundColor: 'var(--color-brand-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
        }}>
          <Upload size={18} color="oklch(48% 0.22 264)" strokeWidth={1.8} />
        </div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          Drop files here or click to browse
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
          Supports PDF, DOCX, and TXT · Up to 50 MB per file
        </div>
      </div>

      {/* Document list */}
      {docs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No documents yet"
          description="Upload your first PDF, DOCX, or text file to start studying with AI assistance."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {docs.map(doc => (
            <Card key={doc.id} padding="16px 18px">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <FileIcon type={doc.file_type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13.5px',
                    fontWeight: '500',
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>{doc.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', gap: '12px', marginTop: '2px' }}>
                    <span>{doc.subject}</span>
                    <span>·</span>
                    <span>{doc.chunk_count} chunks</span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> {doc.upload_date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '7px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'oklch(97% 0.018 25)'
                    e.currentTarget.style.borderColor = 'oklch(80% 0.08 25)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'white'
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                  }}
                >
                  <Trash2 size={13} color="oklch(52% 0.21 25)" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
