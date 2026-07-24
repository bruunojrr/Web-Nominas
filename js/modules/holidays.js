/**
 * Calcula la fecha de Domingo de Resurrección para cualquier año (Algoritmo de Computus)
 */
function getEaster(year) {
    const f = Math.floor;
    const G = year % 19;
    const C = f(year / 100);
    const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
    const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
    const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
    const L = I - J;
    const month = 3 + f((L + 40) / 44);
    const day = L + 28 - 31 * f(month / 4);
    return new Date(year, month - 1, day);
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date) {
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${date.getFullYear()}-${m}-${d}`;
}

export const Holidays = {
    getHolidays: (year, region = 'Galicia', city = 'Vigo') => {
        const holidays = [];
        const add = (m, d) => holidays.push(`${year}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`);

        // Festivos Nacionales Fijos (España)
        add(1, 1);   // Año Nuevo
        add(1, 6);   // Día de Reyes
        add(5, 1);   // Fiesta del Trabajo
        add(8, 15);  // Asunción de la Virgen
        add(10, 12); // Fiesta Nacional de España
        add(11, 1);  // Todos los Santos
        add(12, 6);  // Día de la Constitución
        add(12, 8);  // Inmaculada Concepción
        add(12, 25); // Navidad

        // Festivos Móviles Nacionales (Semana Santa)
        const easter = getEaster(year);
        holidays.push(formatDate(addDays(easter, -2))); // Viernes Santo

        // Festivos Autonómicos
        if (region === 'Galicia') {
            add(5, 17); // Letras Gallegas
            add(7, 25); // Santiago Apóstol
            holidays.push(formatDate(addDays(easter, -3))); // Jueves Santo
        }

        // Festivos Locales
        if (city === 'Vigo') {
            add(3, 28); // Reconquista de Vigo
            add(8, 16); // San Roque
        }

        return holidays;
    },

    isHoliday: (dateStr, region = 'Galicia', city = 'Vigo') => {
        const year = parseInt(dateStr.split('-')[0], 10);
        const yearlyHolidays = Holidays.getHolidays(year, region, city);
        return yearlyHolidays.includes(dateStr);
    }
};