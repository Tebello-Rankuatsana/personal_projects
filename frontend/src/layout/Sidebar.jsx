import { NavLink} from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  ClipboardList,
  Layers,
  Gamepad2,
  Settings,
  Zap,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'AI Tutor', icon: MessageSquare },
  { to: '/library', label: 'Library', icon: BookOpen },
  { to: '/quizzes', label: 'Quizzes', icon: ClipboardList },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/games', label: 'Games', icon: Gamepad2 },
]

export default function Sidebar() {
  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'grey',
        borderRight: '1px solid var(--color-border)',
        padding: '0',
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, oklch(55% 0.22 264), oklch(48% 0.22 264))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Zap size={16} color="white" />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: '400',
            color: 'var(--color-text-primary)',
            lineHeight: '1.2',
          }}>StudyOS</div>
          <div style={{
            fontSize: '10px',
            color: 'var(--color-text-muted)',
            fontWeight: '500',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>Local AI Workspace</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: '600',
          color: 'var(--color-text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '8px 10px 6px',
        }}>Workspace</div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '7px',
              marginBottom: '2px',
              fontSize: '13.5px',
              fontWeight: isActive ? '500' : '400',
              color: isActive ? 'oklch(48% 0.22 264)' : 'var(--color-text-secondary)',
              backgroundColor: isActive ? 'var(--color-brand-50)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-overlay)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }
            }}
            onMouseLeave={e => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
              e.currentTarget.style.backgroundColor = isActive ? 'var(--color-brand-50)' : 'transparent'
              e.currentTarget.style.color = isActive ? 'oklch(48% 0.22 264)' : 'var(--color-text-secondary)'
            }}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={15}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  color={isActive ? 'oklch(48% 0.22 264)' : 'currentColor'}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--color-border)' }}>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            borderRadius: '7px',
            fontSize: '13.5px',
            fontWeight: isActive ? '500' : '400',
            color: isActive ? 'oklch(48% 0.22 264)' : 'var(--color-text-secondary)',
            backgroundColor: isActive ? 'var(--color-brand-50)' : 'transparent',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          })}
        >
          {({ isActive }) => (
            <>
              <Settings size={15} strokeWidth={isActive ? 2.2 : 1.8} />
              Settings
            </>
          )}
        </NavLink>
      </div>
    </aside>
  )
}