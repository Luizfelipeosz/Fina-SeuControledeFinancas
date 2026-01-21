import React, { useEffect } from "react";
import "./fina.css";

const Relatorio = () => {
  useEffect(() => {
    const backBtn = document.getElementById("back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.href = "fina.html";
      });
    }

    // Carrega o script externo (MeuRelatorio.js)
    const script = document.createElement("script");
    script.src = "MeuRelatorio.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ background: "#f5f7fb", color: "#222", fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      <header
        style={{
          padding: "18px 20px",
          background: "linear-gradient(90deg,#6d6df1 0%, #4aa3ff 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>📊 Relatórios — Fina</h1>
            <div style={{ fontSize: "0.9rem", opacity: 0.95 }}>
              Visão de gastos por categoria e por mês
            </div>
          </div>
          <div>
            <button
              id="back-btn"
              style={{
                background: "blue",
                border: "none",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "1rem",
                borderRadius: "6px",
                padding: "8px 12px",
              }}
            >
              ← Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ maxWidth: "1100px", margin: "20px auto", padding: "16px" }}>
        <section className="card" style={cardStyle}>
          <div className="controls" style={controlsStyle}>
            <label htmlFor="from">De:</label>
            <input type="date" id="from" />
            <label htmlFor="to">Até:</label>
            <input type="date" id="to" />
            <select id="group-by">
              <option value="all">Todos os dados</option>
              <option value="month">Agrupar por mês</option>
            </select>
            <button id="refresh">Atualizar</button>
            <button id="download-png">Exportar PNG</button>
          </div>
          <div style={{ marginTop: "6px" }}>
            Selecione um intervalo de datas para filtrar os dados dos gráficos. Se nenhum dado existir no localStorage, a página usará dados de exemplo.
          </div>
        </section>

        <div
          className="row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
            marginBottom: "18px",
          }}
        >
          <div className="card" style={cardStyle}>
            <h2>Distribuição por categoria (Pizza)</h2>
            <canvas id="pieChart" style={canvasStyle}></canvas>
          </div>

          <div className="card" style={cardStyle}>
            <h2>Gastos por mês (Barras)</h2>
            <canvas id="barChart" style={canvasStyle}></canvas>
          </div>
        </div>

        <div className="card" style={cardStyle}>
          <h2>Lista resumida</h2>
          <div id="summary-list"></div>
        </div>
      </main>

      <footer style={{ textAlign: "center", color: "#666", padding: "18px 0" }}>
        © 2025 Fina - Luiz Felipe
      </footer>
    </div>
  );
};

// estilos reutilizáveis
const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "14px",
  boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
};

const controlsStyle = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  marginBottom: "10px",
};

const canvasStyle = {
  width: "100%",
  height: "320px",
};

export default Relatorio;