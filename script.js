// =========================
// SUIVIPRO - SCRIPT
// =========================

let leads = JSON.parse(localStorage.getItem("suivipro_leads")) || [];

const leadForm = document.getElementById("leadForm");
const leadsList = document.getElementById("leadsList");
const searchInput = document.getElementById("searchInput");

// =========================
// SAUVEGARDE
// =========================

function saveLeads() {
    localStorage.setItem("suivipro_leads", JSON.stringify(leads));
}

// =========================
// AFFICHER LES PROSPECTS
// =========================

function displayLeads() {
    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filteredLeads = leads.filter(lead => {
        return (
            lead.name.toLowerCase().includes(search) ||
            lead.company.toLowerCase().includes(search) ||
            lead.email.toLowerCase().includes(search)
        );
    });

    leadsList.innerHTML = "";

    if (filteredLeads.length === 0) {
        leadsList.innerHTML = `
            <div class="empty-state">
                <h3>Aucun prospect trouvé</h3>
                <p>Ajoutez votre premier prospect pour commencer.</p>
            </div>
        `;
        updateStats();
        return;
    }

    filteredLeads.forEach(lead => {

        const leadElement = document.createElement("div");
        leadElement.className = "lead";

        const statusClass = getStatusClass(lead.status);

        leadElement.innerHTML = `
            <div class="lead-info">
                <div class="lead-name">
                    ${escapeHTML(lead.name)}
                </div>

                <div class="lead-company">
                    ${escapeHTML(lead.company || "Entreprise non renseignée")}
                </div>

                <div class="lead-contact">
                    ${escapeHTML(lead.email || "")}
                    ${lead.phone ? " • " + escapeHTML(lead.phone) : ""}
                </div>

                ${
                    lead.followUp
                    ? `<div class="lead-contact">
                        📅 Relance : ${formatDate(lead.followUp)}
                    </div>`
                    : ""
                }
            </div>

            <div class="lead-actions">

                <span class="status ${statusClass}">
                    ${escapeHTML(lead.status)}
                </span>

                <button
                    class="btn-danger"
                    onclick="deleteLead('${lead.id}')">
                    Supprimer
                </button>

            </div>
        `;

        leadsList.appendChild(leadElement);
    });

    updateStats();
}

// =========================
// AJOUTER UN PROSPECT
// =========================

if (leadForm) {

    leadForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const company = document.getElementById("company").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const followUp = document.getElementById("followUp").value;
        const status = document.getElementById("status").value;

        if (!name) {
            alert("Veuillez entrer le nom du prospect.");
            return;
        }

        const newLead = {
            id: Date.now().toString(),
            name,
            company,
            email,
            phone,
            followUp,
            status,
            createdAt: new Date().toISOString()
        };

        leads.push(newLead);

        saveLeads();

        leadForm.reset();

        displayLeads();

        alert("Prospect ajouté avec succès !");
    });
}

// =========================
// SUPPRIMER UN PROSPECT
// =========================

function deleteLead(id) {

    const confirmation = confirm(
        "Voulez-vous vraiment supprimer ce prospect ?"
    );

    if (!confirmation) {
        return;
    }

    leads = leads.filter(lead => lead.id !== id);

    saveLeads();

    displayLeads();
}

// =========================
// RECHERCHE
// =========================

if (searchInput) {
    searchInput.addEventListener("input", function() {
        displayLeads();
    });
}

// =========================
// STATISTIQUES
// =========================

function updateStats() {

    const totalElement = document.getElementById("totalLeads");
    const newElement = document.getElementById("newLeads");
    const interestedElement = document.getElementById("interestedLeads");
    const customersElement = document.getElementById("customers");

    if (totalElement) {
        totalElement.textContent = leads.length;
    }

    if (newElement) {
        newElement.textContent =
            leads.filter(lead => lead.status === "Nouveau").length;
    }

    if (interestedElement) {
        interestedElement.textContent =
            leads.filter(lead => lead.status === "Intéressé").length;
    }

    if (customersElement) {
        customersElement.textContent =
            leads.filter(lead => lead.status === "Client").length;
    }
}

// =========================
// CLASSES DES STATUTS
// =========================

function getStatusClass(status) {

    switch (status) {

        case "Nouveau":
            return "status-new";

        case "Contacté":
            return "status-contacted";

        case "Intéressé":
            return "status-interested";

        case "Client":
            return "status-customer";

        case "Perdu":
            return "status-lost";

        default:
            return "status-new";
    }
}

// =========================
// FORMAT DATE
// =========================

function formatDate(date) {

    if (!date) {
        return "";
    }

    const formattedDate = new Date(date);

    return formattedDate.toLocaleDateString("fr-FR");
}

// =========================
// PROTECTION HTML
// =========================

function escapeHTML(value) {

    if (!value) {
        return "";
    }

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =========================
// INITIALISATION
// =========================

displayLeads();
// =========================
// PIPELINE KANBAN
// =========================

function displayPipeline() {

    const columns = {
        "Nouveau": "column-nouveau",
        "Contacté": "column-contacte",
        "Intéressé": "column-interesse",
        "Client": "column-client",
        "Perdu": "column-perdu"
    };

    const counters = {
        "Nouveau": "count-nouveau",
        "Contacté": "count-contacte",
        "Intéressé": "count-interesse",
        "Client": "count-client",
        "Perdu": "count-perdu"
    };

    Object.values(columns).forEach(id => {
        const element = document.getElementById(id);

        if (element) {
            element.innerHTML = "";
        }
    });

    Object.values(counters).forEach(id => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = "0";
        }
    });

    leads.forEach(lead => {

        const column = document.getElementById(columns[lead.status]);
        const counter = document.getElementById(counters[lead.status]);

        if (!column) {
            return;
        }

        const card = document.createElement("div");

        card.className = "pipeline-card";

        card.innerHTML = `
            <div class="pipeline-card-name">
                ${escapeHTML(lead.name)}
            </div>

            <div class="pipeline-card-company">
                ${escapeHTML(
                    lead.company || "Entreprise non renseignée"
                )}
            </div>

            ${
                lead.followUp
                ? `
                    <div class="pipeline-card-date">
                        📅 Relance : ${formatDate(lead.followUp)}
                    </div>
                `
                : ""
            }

            <select onchange="changeLeadStatus('${lead.id}', this.value)">

                <option value="Nouveau"
                    ${lead.status === "Nouveau" ? "selected" : ""}>
                    Nouveau
                </option>

                <option value="Contacté"
                    ${lead.status === "Contacté" ? "selected" : ""}>
                    Contacté
                </option>

                <option value="Intéressé"
                    ${lead.status === "Intéressé" ? "selected" : ""}>
                    Intéressé
                </option>

                <option value="Client"
                    ${lead.status === "Client" ? "selected" : ""}>
                    Client
                </option>

                <option value="Perdu"
                    ${lead.status === "Perdu" ? "selected" : ""}>
                    Perdu
                </option>

            </select>
        `;

        column.appendChild(card);

        counter.textContent =
            parseInt(counter.textContent) + 1;
    });
}

// =========================
// CHANGER LE STATUT
// =========================

function changeLeadStatus(id, newStatus) {

    const lead = leads.find(lead => lead.id === id);

    if (!lead) {
        return;
    }

    lead.status = newStatus;

    saveLeads();

    displayLeads();

    displayPipeline();
}

// =========================
// INITIALISER LE PIPELINE
// =========================

displayPipeline();
console.log("SuiviPro fonctionne !");
// =========================
// RAPPELS DE RELANCE
// =========================

function displayReminders() {

    const remindersList = document.getElementById("remindersList");

    if (!remindersList) {
        return;
    }

    remindersList.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders = leads
        .filter(lead => lead.followUp)
        .sort((a, b) => {
            return new Date(a.followUp) - new Date(b.followUp);
        });

    if (reminders.length === 0) {

        remindersList.innerHTML = `
            <div class="no-reminders">
                <div style="font-size: 30px;">✅</div>
                <p>Aucune relance prévue.</p>
            </div>
        `;

        return;
    }

    reminders.forEach(lead => {

        const date = new Date(lead.followUp + "T00:00:00");
        date.setHours(0, 0, 0, 0);

        const difference =
            Math.round(
                (date - today) / (1000 * 60 * 60 * 24)
            );

        let className = "reminder-future";
        let labelClass = "future";
        let label = "À venir";

        if (difference === 0) {

            className = "reminder-today";
            labelClass = "today";
            label = "À relancer aujourd'hui";

        } else if (difference < 0) {

            className = "reminder-overdue";
            labelClass = "overdue";
            label = "Relance en retard";

        } else if (difference === 1) {

            label = "À relancer demain";
        }

        const card = document.createElement("div");

        card.className = `reminder-card ${className}`;

        card.innerHTML = `
            <div class="reminder-info">

                <strong>
                    ${escapeHTML(lead.name)}
                </strong>

                <span>
                    ${escapeHTML(
                        lead.company || "Entreprise non renseignée"
                    )}
                </span>

            </div>

            <div class="reminder-label ${labelClass}">
                ${label}
                <br>
                ${formatDate(lead.followUp)}
            </div>
        `;

        remindersList.appendChild(card);
    });
}


// =========================
// INITIALISATION RAPPELS
// =========================

displayReminders();
