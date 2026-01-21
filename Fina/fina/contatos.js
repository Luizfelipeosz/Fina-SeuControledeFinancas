const addBtn = document.getElementById("addContact");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const contactsList = document.getElementById("contactsList");

    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    function renderContacts() {
      contactsList.innerHTML = "";
      contacts.forEach((c, index) => {
        const div = document.createElement("div");
        div.classList.add("contact-item");
        div.innerHTML = `
          <div class="contact-info">
            <strong>${c.name}</strong>
            <span>${c.email}</span>
            <span>${c.phone || ""}</span>
          </div>
          <button class="delete-btn" onclick="deleteContact(${index})">Excluir</button>
        `;
        contactsList.appendChild(div);
      });
    }

    function saveContacts() {
      localStorage.setItem("contacts", JSON.stringify(contacts));
    }

    addBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();

      if (!name || !email) {
        alert("Por favor, insira nome e e-mail/Pix do contato.");
        return;
      }

      contacts.push({ name, email, phone });
      saveContacts();
      renderContacts();

      nameInput.value = "";
      emailInput.value = "";
      phoneInput.value = "";
    });

    function deleteContact(index) {
  const confirmDelete = confirm("Tem certeza que deseja excluir este contato?");

  if (confirmDelete) {
    // Se o usuário clicar em "OK" (Sim)
    contacts.splice(index, 1);
    saveContacts();
    renderContacts();
    alert("Contato excluído com sucesso!");
  } else {
    // Se o usuário clicar em "Cancelar" (Não)
    alert("Exclusão cancelada. O contato foi mantido.");
  }
}

    renderContacts();