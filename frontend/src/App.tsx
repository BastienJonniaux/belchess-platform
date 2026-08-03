import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import ClubPage from './pages/ClubPage';
import './App.css'
import ClubsListPage from './pages/ClubsListPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/clubs/:matricule" element={<ClubPage />} />
        <Route path="/ligues" element={<ClubsListPage />} />
      </Routes>
    </>
  )
}

export default App