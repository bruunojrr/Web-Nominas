export const AppState = {
    user: null,
    contracts: [],
    entries: [],
    settings: {
        theme: 'light',
        notifications: false,
        notiTime: '21:00',
        multipliers: {}
    },
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    chart: null,
    region: 'Galicia', // Configuración preparada para el futuro
    city: 'Vigo'       // Configuración preparada para el futuro
};