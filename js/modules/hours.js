import { AppState } from '../state.js';
import { Storage } from './storage.js';
import { Salary } from './salary.js';

export const Hours = {
    saveEntry: (fecha, horas, tipo, contratoId) => {
        const contrato = AppState.contracts.find(c => c.id == contratoId);
        if (!contrato) throw new Error("Selecciona un contrato válido.");
        
        const dinero = Salary.calcularGanancia(horas, contrato.precio, tipo);
        const idx = AppState.entries.findIndex(r => r.fecha === fecha);
        
        if (idx !== -1) {
            if (!confirm(`Ya existe un registro para el día ${fecha}. ¿Deseas sobrescribirlo?`)) return false;
            AppState.entries.splice(idx, 1);
        }
        
        AppState.entries.push({ id: Date.now().toString(), fecha, horas, tipo, contratoId, dinero });
        Storage.saveEntries();
        return true;
    },

    deleteEntry: (fecha) => {
        AppState.entries = AppState.entries.filter(r => r.fecha !== fecha);
        Storage.saveEntries();
    }
};