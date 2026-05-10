export default function PageHeader({ title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '16px',
      marginBottom: '28px',
    }}>
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '26px',
          fontWeight: '400',
          color: 'var(--color-text-primary)',
          margin: '0 0 4px',
          letterSpacing: '-0.02em',
          lineHeight: '1.2',
        }}>{title}</h1>
        {description && (
          <p style={{
            fontSize: '13.5px',
            color: 'var(--color-text-muted)',
            margin: 0,
            lineHeight: '1.5',
          }}>{description}</p>
        )}
      </div>
      {action && (
        <div style={{ flexShrink: 0 }}>
          {action}
        </div>
      )}
    </div>
  )
}