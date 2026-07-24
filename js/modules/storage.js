import { AppState } from '../state.js';
import { Config } from '../config.js';

export const Storage = {
    loadAll: () => {
        const config = localStorage.getItem('app_config');
        AppState.settings = config ? JSON.parse(config) : {
            theme: 'light',
            notifications: false,
            notiTime: '21:00',
            multipliers: Config.MULTIPLICADORES_DEFAULT
        };
        const c = localStorage.getItem('app_contratos');
        AppState.contracts = c ? JSON.parse(c) : [];
        const r = localStorage.getItem('app_registros');
        AppState.entries = r ? JSON.parse(r) : [];
    },

    saveConfig: () => localStorage.setItem('app_config', JSON.stringify(AppState.settings)),
    saveContracts: () => localStorage.setItem('app_contratos', JSON.stringify(AppState.contracts)),
    saveEntries: () => localStorage.setItem('app_registros', JSON.stringify(AppState.entries)),

    exportData: () => {
        const data = {
            config: AppState.settings,
            contratos: AppState.contracts,
            registros: AppState.entries
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "Copia_Seguridad_Nominas.json");
        dlAnchorElem.click();
    },

    importData: (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            if (data.config) { AppState.settings = data.config; Storage.saveConfig(); }
            if (data.contratos) { AppState.contracts = data.contratos; Storage.saveContracts(); }
            if (data.registros) { AppState.entries = data.registros; Storage.saveEntries(); }
            return true;
        } catch (e) {
            console.error("Error importando datos", e);
            return false;
        }
    }
};