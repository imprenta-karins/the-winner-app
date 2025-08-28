import { useEffect, useState } from "react";
import { config } from "./config";

export default function App() {
  const [message, setMessage] = useState("Cargando...");
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.origin);
    fetch(`${config.apiUrl}/`)
      .then((r) => r.text())
      .then(setMessage)
      .catch(() => setMessage("No se pudo conectar"));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>Monorepo: React + Nest</h1>
      <p>
        Backend dice: <strong>{message}</strong>
      </p>
      <p>
        Frontend en <code>{currentUrl}</code> | Backend en{" "}
        <code>{config.apiUrl}</code>
      </p>
    </div>
  );
}
