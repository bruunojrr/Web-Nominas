import { AppState } from '../state.js';

export const Salary = {
    calcularGanancia: (horas, contratoPrecio, tipo) => {
        const multiplicadores = AppState.settings.multipliers;
        const multiplicador = multiplicadores[tipo] !== undefined ? multiplicadores[tipo] : 1;
        return horas * contratoPrecio * multiplicador;
    }
};