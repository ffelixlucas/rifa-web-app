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
import CriarRifaPage from "./pages/CriarRifaPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rifa/:id"
          element={
            <ProtectedRoute>
              <AdminRifaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rifa/:id/sorteio"
          element={
            <ProtectedRoute>
              <SorteioPage />
            </ProtectedRoute>
          }
        />

        <Route path="/rifa/:id" element={<RifaPage />} />
        <Route
          path="/admin/criar-rifa"
          element={
            <ProtectedRoute>
              <CriarRifaPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
