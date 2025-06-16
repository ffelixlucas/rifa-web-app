import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

/**
 * Componente para proteger rotas que precisam de autenticação.
 * 
 * Se o usuário estiver autenticado (token válido),
 * renderiza o conteúdo filho.
 * Caso contrário, redireciona para a página de login.
 * 
 * @param {React.ReactNode} children - Componentes filhos que serão renderizados se autenticado.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redireciona para login se não estiver autenticado
    return <Navigate to="/admin/login" replace />;
  }

  // Renderiza os filhos se estiver autenticado
  return <>{children}</>;
}
