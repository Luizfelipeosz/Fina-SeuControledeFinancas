<template>
  <div>
    <header>
      <div class="header-wrapper">
        <div>
          <h1>📊 Relatórios — Fina</h1>
          <div class="subtitle">Visão de gastos por categoria e por mês</div>
        </div>
        <div>
          <button id="back-btn" class="back-btn" @click="goBack">← Voltar</button>
        </div>
      </div>
    </header>

    <main class="container">
      <section class="card">
        <div class="controls">
          <label for="from">De:</label>
          <input type="date" v-model="from" />

          <label for="to">Até:</label>
          <input type="date" v-model="to" />

          <select v-model="groupBy">
            <option value="all">Todos os dados</option>
            <option value="month">Agrupar por mês</option>
          </select>

          <button @click="refreshCharts">Atualizar</button>
          <button @click="downloadPNG">Exportar PNG</button>
        </div>
        <div class="tip">Selecione um intervalo de datas para filtrar os dados dos gráficos. Se nenhum dado existir no localStorage, a página usará dados de exemplo.</div>
      </section>

      <div class="row">
        <div class="card">
          <h2>Distribuição por categoria (Pizza)</h2>
          <canvas ref="pieCanvas"></canvas>
        </div>

        <div class="card">
          <h2>Gastos por mês (Barras)</h2>
          <canvas ref="barCanvas"></canvas>
        </div>
      </div>

      <div class="card">
        <h2>Lista resumida</h2>
        <div id="summary-list">
          <div v-for="(item, index) in summary" :key="index" class="summary-item">
            <strong>{{ item.name }}:</strong> {{ formatCurrency(item.total) }}
          </div>
        </div>
      </div>
    </main>

    <footer>© 2025 Fina - Luiz Felipe</footer>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "RelatoriosFina",
  data() {
    return {
      from: "",
      to: "",
      groupBy: "all",
      transactions: [],
      pieChart: null,
      barChart: null,
      summary: []
    };
  },
  methods: {
    goBack() {
      window.location.href = "fina.html";
    },
    formatCurrency(v) {
      return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    },
    loadData() {
      const stored = JSON.parse(localStorage.getItem("transactions"));
      if (Array.isArray(stored)) this.transactions = stored;
      else {
        this.transactions = [
          { description: "Mercado", amount: -120, category: "Alimentação", date: "2025-02-01" },
          { description: "Salário", amount: 2500, category: "Trabalho", date: "2025-02-05" },
          { description: "Energia", amount: -180, category: "Casa", date: "2025-02-10" }
        ];
      }
    },
    filterData() {
      return this.transactions.filter(t => {
        if (this.from && t.date < this.from) return false;
        if (this.to && t.date > this.to) return false;
        return true;
      });
    },
    refreshCharts() {
      const data = this.filterData();

      // --- RESUMO POR CATEGORIA ---
      const categories = {};
      data.forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
      });
      this.summary = Object.entries(categories).map(([name, total]) => ({ name, total }));

      // --- GRÁFICO DE PIZZA ---
      if (this.pieChart) this.pieChart.destroy();
      this.pieChart = new Chart(this.$refs.pieCanvas, {
        type: "pie",
        data: {
          labels: Object.keys(categories),
          datasets: [{ data: Object.values(categories) }]
        }
      });

      // --- GRÁFICO DE BARRAS POR MÊS ---
      const monthly = {};
      data.forEach(t => {
        const month = t.date.slice(0, 7);
        monthly[month] = (monthly[month] || 0) + Number(t.amount);
      });

      if (this.barChart) this.barChart.destroy();
      this.barChart = new Chart(this.$refs.barCanvas, {
        type: "bar",
        data: {
          labels: Object.keys(monthly),
          datasets: [{ data: Object.values(monthly) }]
        }
      });
    },
    downloadPNG() {
      const pie = this.$refs.pieCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pie;
      link.download = "relatorio_fina.png";
      link.click();
    }
  },
  mounted() {
    this.loadData();
    this.refreshCharts();
  }
};
</script>

<style scoped>
.header-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}
.back-btn {
  background: blue;
  color: white;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  padding: 6px 12px;
}
.row {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.card {
  padding: 18px;
  background: #ffffff20;
  border-radius: 12px;
  backdrop-filter: blur(6px);
}
.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.tip {
  opacity: 0.9;
  margin-top: 6px;
}
.summary-item {
  padding: 4px 0;
}
</style>