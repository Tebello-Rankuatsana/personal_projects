import Button from './Button.jsx'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 32px',
      textAlign: 'center',
      gap: '12px',
    }}>
      {Icon && (
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: 'var(--color-brand-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '4px',
        }}>
          <Icon size={22} color="oklch(55% 0.22 264)" strokeWidth={1.6} />
        </div>
      )}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        fontWeight: '400',
        color: 'var(--color-text-primary)',
        margin: 0,
      }}>{title}</h3>
      {description && (
        <p style={{
          fontSize: '13.5px',
          color: 'var(--color-text-muted)',
          margin: 0,
          maxWidth: '320px',
          lineHeight: '1.55',
        }}>{description}</p>
      )}
      {action && actionLabel && (
        <div style={{ marginTop: '8px' }}>
          <Button onClick={action}>{actionLabel}</Button>
        </div>
      )}
    </div>
  )
}
