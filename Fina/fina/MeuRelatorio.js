const currentUser = localStorage.getItem("loggedUser");
document.addEventListener("DOMContentLoaded", () => {
  // --- Helpers / Data ---
  function sampleData() {
    return [
      { description: "Supermercado", amount: -120.45, date: "2025-10-02", category: "Alimentação" },
      { description: "Salário", amount: 3500.0, date: "2025-10-01", category: "Renda" },
      { description: "Combustível", amount: -180.0, date: "2025-09-22", category: "Transporte" },
      { description: "Aluguel", amount: -900.0, date: "2025-09-05", category: "Moradia" },
      { description: "Netflix", amount: -29.9, date: "2025-10-15", category: "Assinaturas" },
      { description: "Jantar", amount: -75.0, date: "2025-08-11", category: "Alimentação" },
      { description: "Freelance", amount: 600.0, date: "2025-08-28", category: "Renda" },
    ];
  }
  const tx = getTransactions();
const filtered = applyFilters(tx);
renderCharts(filtered);


function getTransactions() {
  try {
    const currentUser = localStorage.getItem("loggedUser");

    // chave correta usada pelo fina.js
    const keyUser = `fina_transactions_${currentUser}`;

    const raw = localStorage.getItem(keyUser);

    // sem dados → não usar sample aqui! Apenas retorna vazio
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((t) => {
      return {
        description: t.description || "—",
        amount: Number(t.amount) || 0,
        date: t.date || new Date().toISOString().slice(0, 10),
        category: t.category || (Number(t.amount) < 0 ? "Despesa" : "Renda"),
      };
    });
  } catch (e) {
    console.warn("Erro ao ler transações:", e);
    return [];
  }
}

  function groupByCategory(transactions) {
    const sums = {};
    transactions.forEach((t) => {
      const cat = t.category || "Outros";
      sums[cat] = (sums[cat] || 0) + (Number(t.amount) || 0);
    });
    return sums;
  }

  function groupByMonth(transactions) {
    const sums = {};
    transactions.forEach((t) => {
      const month = (t.date || "").slice(0, 7) || new Date().toISOString().slice(0, 7); // "YYYY-MM"
      sums[month] = (sums[month] || 0) + (Number(t.amount) || 0);
    });
    return sums;
  }

  // --- Elementos do DOM (com checks) ---
  const pieCanvas = document.getElementById("pieChart");
  const barCanvas = document.getElementById("barChart");
  const refreshBtn = document.getElementById("refresh");
  const downloadBtn = document.getElementById("download-png");
  const fromInput = document.getElementById("from");
  const toInput = document.getElementById("to");
  const summaryList = document.getElementById("summary-list");
  const backBtn = document.getElementById("back-btn");

  // Verifica Chart.js e canvases
  const hasChartLib = typeof Chart !== "undefined";
  if (!hasChartLib) {
    console.warn("Chart.js não encontrado. Os gráficos não serão exibidos.");
  }
  if (!pieCanvas || !barCanvas) {
    console.warn("Um ou ambos os elementos <canvas> (#pieChart, #barChart) não foram encontrados.");
  }

  // --- Charts (variáveis) ---
  let pieChart = null;
  let barChart = null;

  // --- Renderização Summary ---
  function renderSummaryList(transactions, catSums) {
    if (!summaryList) return;
    summaryList.innerHTML = "";

    const total = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
    const totalEl = document.createElement("div");
    totalEl.style.marginBottom = "8px";
    totalEl.innerHTML = `<strong>Total (filtrado):</strong> R$ ${total.toFixed(2)}`;
    summaryList.appendChild(totalEl);

    const ul = document.createElement("ul");
    ul.style.paddingLeft = "18px";
    if (Object.keys(catSums).length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nenhuma categoria encontrada";
      ul.appendChild(li);
    } else {
      Object.keys(catSums).forEach((cat) => {
        const li = document.createElement("li");
        li.textContent = `${cat}: R$ ${catSums[cat].toFixed(2)}`;
        ul.appendChild(li);
      });
    }
    summaryList.appendChild(ul);
  }

  // --- Renderizar Charts ---
  function renderCharts(transactions) {
    const catSums = groupByCategory(transactions);
    const monthSums = groupByMonth(transactions);

    // months ordenados cronologicamente: formato "YYYY-MM" garante ordenação lexicográfica
    const months = Object.keys(monthSums).sort((a, b) => a.localeCompare(b));

    const pieLabels = Object.keys(catSums);
    const pieData = pieLabels.map((l) => Math.abs(Math.round((catSums[l] + Number.EPSILON) * 100) / 100));

    const barLabels = months;
    const barData = months.map((m) => Math.round((monthSums[m] + Number.EPSILON) * 100) / 100);

    // Atualiza summary mesmo que Chart.js não exista
    renderSummaryList(transactions, catSums);

    if (!hasChartLib) return;

    // Destrói charts antigos com segurança
    try {
      if (pieChart) { pieChart.destroy(); pieChart = null; }
      if (barChart) { barChart.destroy(); barChart = null; }
    } catch (err) {
      console.warn("Erro ao destruir charts antigos:", err);
    }

    // Paleta simples (se quiser customizar, troque as cores)
    const palette = [
      "#4dc9f6", "#f67019", "#f53794", "#537bc4",
      "#acc236", "#166a8f", "#00a950", "#58595b", "#8549ba"
    ];

    // Criar Pie
    if (pieCanvas) {
      const ctxPie = pieCanvas.getContext("2d");
      pieChart = new Chart(ctxPie, {
        type: "pie",
        data: {
          labels: pieLabels,
          datasets: [{
            data: pieData,
            backgroundColor: palette.slice(0, pieLabels.length),
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            tooltip: { callbacks: { label: (ctx) => `${ctx.label}: R$ ${ctx.parsed.toFixed(2)}` } }
          }
        }
      });
    }

    // Criar Bar
    if (barCanvas) {
      const ctxBar = barCanvas.getContext("2d");
      barChart = new Chart(ctxBar, {
        type: "bar",
        data: {
          labels: barLabels,
          datasets: [{
            label: "Total (R$)",
            data: barData,
            backgroundColor: palette.slice(0, barLabels.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }
  }

  // --- Filtragem ---
  function applyFilters(transactions) {
    const from = fromInput ? fromInput.value : "";
    const to = toInput ? toInput.value : "";
    let filtered = transactions.slice();
    if (from) filtered = filtered.filter((t) => (t.date || "").slice(0, 10) >= from);
    if (to) filtered = filtered.filter((t) => (t.date || "").slice(0, 10) <= to);
    return filtered;
  }

  // --- Ações dos botões ---
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      const tx = getTransactions();
      const filtered = applyFilters(tx);
      renderCharts(filtered);
      alert("Relatório atualizado.");
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
      const tx = getTransactions();
      const filtered = applyFilters(tx);

      // Se Chart.js não estiver disponível, apenas baixe o resumo em texto
      if (!hasChartLib || !pieChart || !barChart) {
        // gera um TXT simples com resumo
        const catSums = groupByCategory(filtered);
        let text = `Relatório Fina — ${new Date().toISOString().slice(0,10)}\n\nTotal: R$ ${filtered.reduce((s,t)=> s + Number(t.amount||0),0).toFixed(2)}\n\nPor categoria:\n`;
        Object.keys(catSums).forEach(k => text += `${k}: R$ ${catSums[k].toFixed(2)}\n`);
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `relatorio_fina_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      }

      try {
        // usa toBase64Image para garantir captura correta do Chart.js
        const img1 = pieChart.toBase64Image();
        const img2 = barChart.toBase64Image();

        // carrega imagens em elementos para desenhar num canvas combinado
        const image1 = await loadImage(img1);
        const image2 = await loadImage(img2);

        // largura = maior largura das imagens; altura = soma + espaçamento
        const width = Math.max(image1.width, image2.width);
        const padding = 20;
        const height = image1.height + image2.height + padding;

        const tmp = document.createElement("canvas");
        tmp.width = width;
        tmp.height = height;
        const ctx = tmp.getContext("2d");
        // fundo branco
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // centraliza horizontalmente cada imagem
        const x1 = (width - image1.width) / 2;
        ctx.drawImage(image1, x1, 0);
        const x2 = (width - image2.width) / 2;
        ctx.drawImage(image2, x2, image1.height + padding);

        const dataURL = tmp.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = `relatorio_fina_${new Date().toISOString().slice(0,10)}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (err) {
        console.error("Erro ao exportar PNG:", err);
        alert("Não foi possível exportar o PNG. Veja o console para detalhes.");
      }
    });
  }

  // helper para carregar imagens a partir de dataURL
  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = dataUrl;
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "fina.html";
    });
  }

  // Sincronização entre abas
  window.addEventListener("storage", (event) => {
    if (event.key === "transactions" || event.key === "fina_transactions") {
      const tx = getTransactions();
      const filtered = applyFilters(tx);
      renderCharts(filtered);
    }
  );

  // Inicialização
  (function init() {
    const tx = getTransactions();

    // configurar min/max dos filtros de data se inputs existirem
    if (fromInput || toInput) {
      const dates = tx
        .map((t) => (t.date || "").slice(0, 10))
        .filter(Boolean)
        .sort();
      if (dates.length) {
        const first = dates[0];
        const last = dates[dates.length - 1];
        if (fromInput) { fromInput.min = first; fromInput.max = last; }
        if (toInput) { toInput.min = first; toInput.max = last; }
      }
    }

    renderCharts(tx);
  })();
});
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("header, .card, .container, #summary-list div");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
});
</script>
