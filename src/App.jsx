import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx"; // ✅ página de login
import AdminPage from "./pages/AdminPage.jsx"; // ✅ nova página
import AdminRifaPage from "./pages/AdminRifaPage.jsx"; // ✅ página de detalhes da rifa

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} /> {/* ✅ nova rota */}
        <Route path="/admin/rifa/:id" element={<AdminRifaPage />} />

      </Routes>
    </Router>
  );
}

export default App;
