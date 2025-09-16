import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Portal seguro para React 18 + StrictMode.
 * - Cria um container apenas uma vez (useRef)
 * - No cleanup, só remove se ainda for filho do body
 */
export default function Portal({ children }) {
  const containerRef = useRef(null);

  if (!containerRef.current) {
    const el = document.createElement("div");
    el.setAttribute("data-portal", "rifa-modal");
    el.style.position = "relative";
    containerRef.current = el;
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el.parentNode) document.body.appendChild(el);
    return () => {
      // em StrictMode o cleanup roda 2x; protege a remoção
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  return children ? createPortal(children, containerRef.current) : null;
}
