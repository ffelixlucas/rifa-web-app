// src/components/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log detalhado no console
    console.group(`[ErrorBoundary] ${this.props.label || "Sem rótulo"}`);
    console.error(error);
    console.info(info?.componentStack);
    console.groupEnd();
    this.setState({ info });
  }

  handleRetry = () => {
    // reseta o estado pra tentar re-renderizar
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 m-2 rounded border border-red-300 bg-red-50 text-red-700">
          <div className="font-bold mb-1">
            Erro em {this.props.label || "componente"}.
          </div>
          <div className="text-sm whitespace-pre-wrap">
            {String(this.state.error?.message || this.state.error || "Erro desconhecido")}
          </div>
          {this.state.info?.componentStack && (
            <pre className="mt-2 text-xs overflow-auto max-h-40 whitespace-pre-wrap">
{this.state.info.componentStack}
            </pre>
          )}
          <button
            onClick={this.handleRetry}
            className="mt-3 px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
