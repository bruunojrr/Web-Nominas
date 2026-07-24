import { AppState } from '../state.js';
import { Storage } from './storage.js';

export const Contracts = {
    saveContract: (id, nombre, precio, localizacion) => {
        const idx = AppState.contracts.findIndex(c => c.id === id);
        const obj = { id: id || Date.now().toString(), nombre, precio, localizacion };
        
        if (idx !== -1) {
            AppState.contracts[idx] = obj;
        } else {
            AppState.contracts.push(obj);
        }
        
        Storage.saveContracts();
    },

    deleteContract: (id) => {
        const enUso = AppState.entries.some(r => r.contratoId === id);
        let msg = "¿Seguro que deseas eliminar este contrato?";
        if (enUso) msg = "⚠️ ATENCIÓN: Este contrato ha sido utilizado en jornadas anteriores. Si lo eliminas, los registros antiguos podrían mostrar 'Empresa Desconocida'. ¿Deseas continuar?";
        
        if (confirm(msg)) {
            AppState.contracts = AppState.contracts.filter(c => c.id !== id);
            Storage.saveContracts();
            return true;
        }
        return false;
    }
};