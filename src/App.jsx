import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminRifaPage from "./pages/AdminRifaPage.jsx";
import RifaPage from "./pages/RifaPage.jsx";
import SorteioPage from "./pages/SorteioPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/rifa/1" />} /> {/* Página principal definida */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/rifa/:id" element={<AdminRifaPage />} />
        <Route path="/admin/rifa/:id/sorteio" element={<SorteioPage />} />
        <Route path="/rifa/:id" element={<RifaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
