import { AppState } from '../state.js';
import { Utils } from '../utils.js';

export const UI = {
    showApp: () => {
        document.getElementById("login-screen").classList.remove("active");
        document.getElementById("app-screen").classList.add("active");
    },
    
    showLogin: () => {
        document.getElementById("login-screen").classList.add("active");
        document.getElementById("app-screen").classList.remove("active");
    },

    openModal: (id) => document.getElementById(id).classList.add("active"),
    closeModal: (id) => document.getElementById(id).classList.remove("active"),

    applyTheme: () => {
        if (AppState.settings.theme === 'dark') {
            document.body.classList.add("dark-mode");
            document.getElementById("theme-color-meta").setAttribute("content", "#000000");
        } else {
            document.body.classList.remove("dark-mode");
            document.getElementById("theme-color-meta").setAttribute("content", "#f4f6f9");
        }
    },

    updateDateInfo: () => {
        const fecha = document.getElementById("reg-fecha").value;
        if (!fecha) return;
        
        const infoSpan = document.getElementById("reg-info-dia");
        const tipoSelect = document.getElementById("reg-tipo");
        const tipoAuto = Utils.getTipoDiaAutomatico(fecha);
        tipoSelect.value = tipoAuto;
        
        if (tipoAuto === "Festiva") {
            infoSpan.innerHTML = '<i class="ri-calendar-event-fill"></i> Es Festivo (Nacional, Autonómico o Local)';
            infoSpan.style.color = "var(--c-festiva)";
        } else if (tipoAuto === "Sábado" || tipoAuto === "Domingo") {
            infoSpan.innerHTML = `<i class="ri-calendar-2-fill"></i> Es Fin de Semana (${tipoAuto})`;
            infoSpan.style.color = "var(--c-sabado)";
        } else {
            infoSpan.innerHTML = "";
        }
    },

    loadContratosEnSelect: () => {
        const select = document.getElementById("reg-contrato");
        select.innerHTML = '<option value="">Selecciona contrato...</option>';
        AppState.contracts.forEach(c => {
            let opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = `${c.nombre} (${c.precio}€/h)`;
            select.appendChild(opt);
        });
    },

    renderContratosView: (onEdit, onDelete) => {
        const lista = document.getElementById("lista-contratos");
        lista.innerHTML = "";
        
        if (AppState.contracts.length === 0) {
            lista.innerHTML = "<p class='text-muted text-center mt-15'>No hay contratos guardados.</p>";
            return;
        }
        
        AppState.contracts.forEach(c => {
            const div = document.createElement("div");
            div.className = "item-card";
            div.innerHTML = `
                <div class="item-info">
                    <h4>${c.nombre}</h4>
                    <p>${c.precio}€/h - ${c.localizacion}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-secondary btn-edit"><i class="ri-edit-line"></i></button>
                    <button class="btn-danger btn-delete"><i class="ri-delete-bin-line"></i></button>
                </div>
            `;
            div.querySelector('.btn-edit').addEventListener('click', () => onEdit(c.id));
            div.querySelector('.btn-delete').addEventListener('click', () => onDelete(c.id));
            lista.appendChild(div);
        });
    }
};