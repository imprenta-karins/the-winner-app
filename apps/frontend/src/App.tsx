import { useEffect, useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('Cargando...');

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then((r) => r.text())
      .then(setMessage)
      .catch(() => setMessage('No se pudo contactar al backend'));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Monorepo: React + Nest</h1>
      <p>Backend dice: <strong>{message}</strong></p>
      <p>Frontend en <code>http://localhost:5173</code> | Backend en <code>http://localhost:3000</code></p>
    </div>
  );
}
