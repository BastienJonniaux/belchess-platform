import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import ClubPage from './pages/ClubPage';
import './App.css'
import ClubsListPage from './pages/ClubsListPage';
import Home from './pages/Home';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/clubs/:matricule" element={<ClubPage />} />
        <Route path="/clubs" element={<ClubsListPage />} />
      </Routes>
    </>
  )
}

export default App