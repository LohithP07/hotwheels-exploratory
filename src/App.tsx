import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { CarDetail } from './pages/CarDetail';
import { SearchPage } from './pages/SearchPage';
import { useCars } from './hooks/useCars';

export default function App() {
  const { cars } = useCars();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar carCount={cars.length} />
        <main className="pt-8 pb-16 hw-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car/:id" element={<CarDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
