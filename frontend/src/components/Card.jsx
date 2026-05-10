export default function Card({
  children,
  style = {},
  onClick,
  hoverable = false,
  padding = '24px',
  className = '',
}) {
  const base = {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
    padding,
    boxShadow: '0 1px 4px oklch(0% 0 0 / 4%), 0 0 0 0 transparent',
    transition: 'all 0.18s ease',
    cursor: onClick || hoverable ? 'pointer' : 'default',
    ...style,
  }

  return (
    <div
      style={base}
      onClick={onClick}
      className={className}
      onMouseEnter={e => {
        if (onClick || hoverable) {
          e.currentTarget.style.boxShadow = '0 4px 16px oklch(0% 0 0 / 8%), 0 1px 4px oklch(0% 0 0 / 4%)'
          e.currentTarget.style.borderColor = 'var(--color-border-strong)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        if (onClick || hoverable) {
          e.currentTarget.style.boxShadow = '0 1px 4px oklch(0% 0 0 / 4%)'
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {children}
    </div>
  )
}