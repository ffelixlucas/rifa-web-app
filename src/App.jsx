import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        {/* Outras rotas virão aqui futuramente */}
      </Routes>

    </Router>
  );
}

export default App;
