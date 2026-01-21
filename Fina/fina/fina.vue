<template>
  <div>
    <header>
      <div class="header-content">
        <h1>💰 Fina</h1>

        <div class="header-buttons">
          <button @click="goToContacts">Contatos</button>
          <button @click="goToReports">Relatórios</button>
        </div>

        <div class="header-right">
          <button class="logout-btn" @click="logout">Sair</button>
          <button class="delete-btn" @click="deleteAccount">Excluir Conta</button>
        </div>
      </div>

      <p>Seu controle financeiro simples e rápido</p>
    </header>

    <main class="container">
      <!-- Saldo -->
      <section class="balance-section">
        <h2>Saldo atual</h2>
        <div>{{ formattedBalance }}</div>
      </section>

      <!-- Formulário -->
      <section class="form-section">
        <h2>Adicionar Transação</h2>
        <form @submit.prevent="addTransaction">
          <input v-model="description" type="text" placeholder="Descrição" required />
          <input v-model="amount" type="text" placeholder="Valor (use negativo para saída)" required />
          <button type="submit">Adicionar</button>
        </form>
      </section>

      <!-- Resumo -->
      <section class="summary-section">
        <div>
          <h3>Entradas</h3>
          <div>{{ formattedIncome }}</div>
        </div>
        <div>
          <h3>Saídas</h3>
          <div>{{ formattedExpenses }}</div>
        </div>
      </section>

      <section class="list-section">
        <h2>Histórico</h2>
        <ul>
          <li v-for="(t, index) in transactions" :key="index">
            {{ t.description }} — {{ formatCurrency(t.amount) }}
          </li>
        </ul>
        <button @click="clearHistory">Limpar histórico</button>
      </section>
    </main>

    <footer>© 2025 Fina - Luiz Felipe</footer>
  </div>
</template>

<script>
export default {
  name: "FinaApp",
  data() {
    return {
      description: "",
      amount: "",
      transactions: []
    };
  },
  computed: {
    balance() {
      return this.transactions.reduce((acc, t) => acc + Number(t.amount), 0);
    },
    income() {
      return this.transactions
        .filter(t => Number(t.amount) > 0)
        .reduce((acc, t) => acc + Number(t.amount), 0);
    },
    expenses() {
      return this.transactions
        .filter(t => Number(t.amount) < 0)
        .reduce((acc, t) => acc + Number(t.amount), 0);
    },
    formattedBalance() {
      return this.formatCurrency(this.balance);
    },
    formattedIncome() {
      return this.formatCurrency(this.income);
    },
    formattedExpenses() {
      return this.formatCurrency(this.expenses);
    }
  },
  methods: {
    formatCurrency(value) {
      return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    },
    addTransaction() {
      const amountNumber = Number(this.amount.replace(",", "."));
      if (isNaN(amountNumber)) return alert("Valor inválido!");

      this.transactions.push({
        description: this.description,
        amount: amountNumber
      });

      this.description = "";
      this.amount = "";
      this.save();
    },
    clearHistory() {
      if (confirm("Tem certeza que deseja limpar tudo?")) {
        this.transactions = [];
        this.save();
      }
    },
    save() {
      localStorage.setItem("transactions", JSON.stringify(this.transactions));
    },
    load() {
      const data = JSON.parse(localStorage.getItem("transactions"));
      if (Array.isArray(data)) this.transactions = data;
    },
    goToContacts() {
      window.location.href = "contatos.html";
    },
    goToReports() {
      window.location.href = "MeuRelatorio.html";
    },
    logout() {
      window.location.href = "fina-login.html";
    },
    deleteAccount() {
      if (confirm("Deseja realmente excluir sua conta?")) {
        localStorage.clear();
        alert("Conta excluída!");
        window.location.href = "fina-login.html";
      }
    }
  },
  mounted() {
    this.load();
  }
};
</script>

<style scoped>
/* estilos podem ser importados do seu fina.css */
</style>
