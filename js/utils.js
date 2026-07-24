import { AppState } from './state.js';
import { Holidays } from './modules/holidays.js';

export const Utils = {
    meses: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    
    getTipoDiaAutomatico: (dateString) => {
        if (Holidays.isHoliday(dateString, AppState.region, AppState.city)) return "Festiva";
        const d = new Date(dateString);
        const day = d.getDay();
        if (day === 0) return "Domingo";
        if (day === 6) return "Sábado";
        return "Normal";
    },

    obtenerDatosMesExportar: () => {
        const prefijo = `${AppState.currentYear}-${(AppState.currentMonth + 1).toString().padStart(2, '0')}`;
        let regs = AppState.entries.filter(r => r.fecha.startsWith(prefijo));
        
        regs.sort((a, b) => a.fecha.localeCompare(b.fecha));
        let tabla = [];
        let totalDinero = 0;
        let totalHoras = 0;
        
        regs.forEach(r => {
            let c = AppState.contracts.find(x => x.id === r.contratoId);
            tabla.push([
                r.fecha,
                c ? c.nombre : "N/A",
                r.horas.toString(),
                r.tipo,
                c ? c.precio.toString() + " €" : "?",
                r.dinero.toFixed(2) + " €"
            ]);
            totalDinero += r.dinero;
            totalHoras += r.horas;
        });
        
        return { regs, tabla, totalDinero, totalHoras };
    }
};