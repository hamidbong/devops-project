import React, { useState } from "react";

const S1 = process.env.REACT_APP_SERVICE1_URL || "http://localhost:5001/api/number";
const S2 = process.env.REACT_APP_SERVICE2_URL || "http://localhost:5002/api/number";
const S3 = process.env.REACT_APP_SERVICE3_URL || "http://service-python-service:5003/api/number";

function App() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callService = async (url) => {
    try {
      setLoading(true);
      setResponse("");
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResponse(`${data.service} → ${data.number}`);
    } catch (err) {
      setResponse("Erreur: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Microservices Demo — App React</h1>
      <p>Cliquez sur un bouton pour interroger le microservice correspondant.</p>

      <div className="buttons">
        <button className="btn" onClick={() => callService(S1)}>Service 1 (Node.js)</button>
        <button className="btn" style={{background:"linear-gradient(180deg,#2563eb,#1e40af)"}} onClick={() => callService(S2)}>Service 2 (Java)</button>
        <button className="btn" style={{background:"linear-gradient(180deg,#ef4444,#b91c1c)"}} onClick={() => callService(S3)}>Service 3 (Python)</button>
      </div>

      <div className="info">
        {loading ? "Chargement..." : (response || "Aucun appel effectué")}
      </div>
    </div>
  );
}

export default App;
