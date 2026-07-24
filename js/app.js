import { AppState } from './state.js';
import { Storage } from './modules/storage.js';
import { UI } from './modules/ui.js';
import { Auth } from './modules/auth.js';
import { Calendar } from './modules/calendar.js';
import { Contracts } from './modules/contracts.js';
import { Hours } from './modules/hours.js';
import { PDF } from './modules/pdf.js';
import { Excel } from './modules/excel.js';
import { Notifications } from './modules/notifications.js';

let idRegistroBorrando = null;

function initApp() {
    Storage.loadAll();
    UI.applyTheme();
    
    // Rellenar select de horas (1 a 12)
    const selectHoras = document.getElementById("reg-horas");
    for (let i = 0; i <= 12; i += 0.5) {
        if(i === 0) continue;
        let opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i + " h";
        selectHoras.appendChild(opt);
    }
    
    document.getElementById("reg-fecha").value = new Date().toISOString().split('T')[0];
    UI.updateDateInfo();

    if (Auth.checkSession()) {
        UI.showApp();
        UI.loadContratosEnSelect();
        UI.renderContratosView(editarContrato, borrarContrato);
        Calendar.render(diaClickeado, registroClickeado);
    } else {
        UI.showLogin();
    }
    
    Notifications.startEngine();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
}

// ==== CALLBACKS DE INTERACCIÓN ====
function editarContrato(id) {
    const c = AppState.contracts.find(x => x.id === id);
    if (c) {
        document.getElementById("cont-id").value = c.id;
        document.getElementById("cont-nombre").value = c.nombre;
        document.getElementById("cont-precio").value = c.precio;
        document.getElementById("cont-localizacion").value = c.localizacion;
        document.getElementById("modal-contrato-title").textContent = "Editar Contrato";
        UI.openModal("modal-contrato");
    }
}

function borrarContrato(id) {
    if (Contracts.deleteContract(id)) {
        UI.renderContratosView(editarContrato, borrarContrato);
        UI.loadContratosEnSelect();
        Calendar.render(diaClickeado, registroClickeado);
    }
}

function diaClickeado(dateStr) {
    document.getElementById("reg-fecha").value = dateStr;
    UI.updateDateInfo();
    document.querySelector('[data-target="sec-registrar"]').click();
}

function registroClickeado(reg) {
    const contrato = AppState.contracts.find(c => c.id === reg.contratoId);
    document.getElementById("det-fecha").textContent = reg.fecha;
    document.getElementById("det-empresa").textContent = contrato ? contrato.nombre : "Empresa Desconocida";
    document.getElementById("det-horas").textContent = reg.horas;
    document.getElementById("det-tipo").textContent = reg.tipo;
    document.getElementById("det-precio").textContent = contrato ? contrato.precio : "?";
    document.getElementById("det-total").textContent = reg.dinero.toFixed(2);
    
    idRegistroBorrando = reg.fecha;
    UI.openModal("modal-detalle-dia");
}

// ==== LISTENERS DEL DOM ====
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    
    // Auth
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const u = document.getElementById("login-user").value;
        const p = document.getElementById("login-pass").value;
        if (Auth.login(u, p)) {
            UI.showApp();
            UI.loadContratosEnSelect();
            UI.renderContratosView(editarContrato, borrarContrato);
            Calendar.render(diaClickeado, registroClickeado);
        } else {
            document.getElementById("login-error").textContent = "Usuario o contraseña incorrectos.";
        }
    });
    document.getElementById("btn-logout").addEventListener("click", () => Auth.logout());

    // Navegación Bottom
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(n => n.classList.remove("active"));
            document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
            item.classList.add("active");
            
            const target = item.getAttribute("data-target");
            document.getElementById(target).classList.add("active");
            
            if (target === 'sec-registrar') {
                document.getElementById("header-title").textContent = "Registrar Horas";
                UI.loadContratosEnSelect();
            } else if (target === 'sec-calendario') {
                document.getElementById("header-title").textContent = "Calendario";
                Calendar.render(diaClickeado, registroClickeado);
            } else if (target === 'sec-contratos') {
                document.getElementById("header-title").textContent = "Mis Contratos";
                UI.renderContratosView(editarContrato, borrarContrato);
            }
        });
    });

    // Guardar Horas
    document.getElementById("reg-fecha").addEventListener("change", UI.updateDateInfo);
    document.getElementById("form-registro").addEventListener("submit", (e) => {
        e.preventDefault();
        const fecha = document.getElementById("reg-fecha").value;
        const horas = parseFloat(document.getElementById("reg-horas").value);
        const tipo = document.getElementById("reg-tipo").value;
        const contratoId = document.getElementById("reg-contrato").value;
        
        try {
            if (Hours.saveEntry(fecha, horas, tipo, contratoId)) {
                alert("Jornada guardada correctamente.");
                document.getElementById("form-registro").reset();
                document.getElementById("reg-fecha").value = new Date().toISOString().split('T')[0];
                UI.updateDateInfo();
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Contratos Modal
    document.getElementById("btn-add-contrato").addEventListener("click", () => {
        document.getElementById("form-contrato").reset();
        document.getElementById("cont-id").value = "";
        document.getElementById("modal-contrato-title").textContent = "Añadir Contrato";
        UI.openModal("modal-contrato");
    });
    
    document.getElementById("form-contrato").addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("cont-id").value;
        const nombre = document.getElementById("cont-nombre").value;
        const precio = parseFloat(document.getElementById("cont-precio").value);
        const loc = document.getElementById("cont-localizacion").value;
        
        Contracts.saveContract(id, nombre, precio, loc);
        UI.closeModal("modal-contrato");
        UI.renderContratosView(editarContrato, borrarContrato);
        UI.loadContratosEnSelect();
    });

    // Cerrar Modales
    document.querySelectorAll(".btn-close-modal").forEach(btn => {
        btn.addEventListener("click", (e) => UI.closeModal(e.target.closest(".modal").id));
    });

    // Calendario Navegación
    document.getElementById("cal-prev").addEventListener("click", () => { 
        AppState.currentMonth--; 
        if (AppState.currentMonth < 0) { AppState.currentMonth = 11; AppState.currentYear--; } 
        Calendar.render(diaClickeado, registroClickeado); 
    });
    document.getElementById("cal-next").addEventListener("click", () => { 
        AppState.currentMonth++; 
        if (AppState.currentMonth > 11) { AppState.currentMonth = 0; AppState.currentYear++; } 
        Calendar.render(diaClickeado, registroClickeado); 
    });

    // Eliminar Registro Diario
    document.getElementById("btn-eliminar-registro").addEventListener("click", () => {
        if (!idRegistroBorrando) return;
        if (confirm("¿Eliminar el registro de este día?")) {
            Hours.deleteEntry(idRegistroBorrando);
            UI.closeModal("modal-detalle-dia");
            Calendar.render(diaClickeado, registroClickeado);
        }
    });

    // Configuraciones
    document.getElementById("btn-settings").addEventListener("click", () => {
        document.getElementById("toggle-theme").checked = AppState.settings.theme === 'dark';
        document.getElementById("toggle-noti").checked = AppState.settings.notifications;
        document.getElementById("noti-time").value = AppState.settings.notiTime || "21:00";
        UI.openModal("modal-settings");
    });
    
    document.getElementById("toggle-theme").addEventListener("change", (e) => {
        AppState.settings.theme = e.target.checked ? 'dark' : 'light';
        Storage.saveConfig();
        UI.applyTheme();
        if (AppState.chart) Calendar.render(diaClickeado, registroClickeado); // Refresca colores de gráfico
    });
    
    document.getElementById("toggle-noti").addEventListener("change", (e) => {
        AppState.settings.notifications = e.target.checked;
        Storage.saveConfig();
        if (AppState.settings.notifications && "Notification" in window) {
            Notification.requestPermission().then(perm => {
                if (perm !== "granted") {
                    alert("Permiso denegado. Las notificaciones no funcionarán.");
                    e.target.checked = false;
                    AppState.settings.notifications = false;
                    Storage.saveConfig();
                }
            });
        }
    });
    
    document.getElementById("noti-time").addEventListener("change", (e) => {
        AppState.settings.notiTime = e.target.value;
        Storage.saveConfig();
    });

    // Copias de Seguridad & Exportar
    document.getElementById("btn-backup").addEventListener("click", () => Storage.exportData());
    document.getElementById("btn-restore").addEventListener("click", () => document.getElementById("file-restore").click());
    document.getElementById("file-restore").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            if (Storage.importData(event.target.result)) {
                alert("Datos restaurados correctamente. La página se recargará.");
                window.location.reload();
            } else {
                alert("Error al restaurar. Archivo inválido.");
            }
        };
        reader.readAsText(file);
    });
    
    document.getElementById("btn-export-pdf").addEventListener("click", PDF.exportar);
    document.getElementById("btn-export-excel").addEventListener("click", Excel.exportar);
});