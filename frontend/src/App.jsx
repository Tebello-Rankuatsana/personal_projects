import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageLayout from './layout/PageLayout.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chat from './pages/Chat.jsx'
import Library from './pages/Library.jsx'
import Quizzes from './pages/Quizzes.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Games from './pages/Games.jsx'
import Settings from './pages/Settins.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — full screen, no sidebar */}
        <Route path="/" element={<Landing />} />

        {/* App routes — wrapped in sidebar layout */}
        <Route element={<PageLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/library" element={<Library />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/games" element={<Games />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}