import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VoiceNote from './pages/VoiceNote'
import NotesList from './pages/NotesList'
import NoteDetail from './pages/NoteDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/voice-note" element={<VoiceNote />} />
      <Route path="/notes" element={<NotesList />} />
      <Route path="/notes/:id" element={<NoteDetail />} />
    </Routes>
  )
}

export default App
