import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        {/* Outras rotas virão aqui futuramente */}
      </Routes>
      <div className="bg-green-500 text-white p-4">Hello, Tailwind!</div>

    </Router>
  );
}

export default App;
