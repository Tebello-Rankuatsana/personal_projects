import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

export default function PageLayout() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--color-surface)',
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div className="page-enter" style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}