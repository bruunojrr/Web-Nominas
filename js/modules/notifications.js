import { AppState } from '../state.js';

export const Notifications = {
    startEngine: () => {
        setInterval(() => {
            const config = AppState.settings;
            if (!config.notifications) return;
            
            const now = new Date();
            const curTime = now.toTimeString().substring(0, 5); // HH:MM
            
            if (curTime === config.notiTime) {
                const todayStr = now.toISOString().split('T')[0];
                const logged = AppState.entries.some(r => r.fecha === todayStr);
                
                if (!logged && sessionStorage.getItem("noti_sent_today") !== todayStr) {
                    Notifications.lanzar("Recordatorio", "Recuerda registrar las horas trabajadas de hoy.");
                    sessionStorage.setItem("noti_sent_today", todayStr);
                }
            }
        }, 60000); // 1 minuto
    },
    
    lanzar: (titulo, body) => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(titulo, { body, icon: "icon.png" });
        }
    }
};