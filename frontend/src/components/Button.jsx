const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    fontFamily: 'var(--font-sans)',
    letterSpacing: '0.01em',
  },
  primary: {
    backgroundColor: 'oklch(48% 0.22 264)',
    color: 'white',
    boxShadow: '0 1px 3px oklch(48% 0.22 264 / 30%)',
  },
  secondary: {
    backgroundColor: 'white',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-strong)',
    boxShadow: '0 1px 2px oklch(0% 0 0 / 4%)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid transparent',
  },
  danger: {
    backgroundColor: 'oklch(52% 0.21 25)',
    color: 'white',
  },
  sm: {
    padding: '5px 11px',
    fontSize: '12.5px',
    borderRadius: '6px',
  },
  lg: {
    padding: '11px 22px',
    fontSize: '15px',
    borderRadius: '9px',
  },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  style: extraStyle = {},
  ...props
}) {
  const variantStyle = styles[variant] || styles.primary
  const sizeStyle = styles[size] || {}

  const combined = {
    ...styles.base,
    ...variantStyle,
    ...sizeStyle,
    ...(disabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
    ...extraStyle,
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={combined}
      disabled={disabled}
      onMouseEnter={e => {
        if (!disabled) {
          if (variant === 'primary') e.currentTarget.style.backgroundColor = 'oklch(42% 0.22 264)'
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--color-surface-overlay)'
          if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'var(--color-surface-overlay)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          if (variant === 'primary') e.currentTarget.style.backgroundColor = 'oklch(48% 0.22 264)'
          if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'white'
          if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}