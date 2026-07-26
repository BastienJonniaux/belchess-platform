import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import ClubPage from './pages/ClubPage';
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/clubs/:matricule" element={<ClubPage />} />
      </Routes>
    </>
  )
}

export default App