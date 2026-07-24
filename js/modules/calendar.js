import { AppState } from '../state.js';
import { Utils } from '../utils.js';
import { Holidays } from './holidays.js';
import { Charts } from './charts.js';

export const Calendar = {
    render: (onDiaClick, onRegistroClick) => {
        document.getElementById("cal-month-year").textContent = `${Utils.meses[AppState.currentMonth]} ${AppState.currentYear}`;
        const grid = document.getElementById("calendar-grid");
        grid.innerHTML = "";
        
        const firstDay = new Date(AppState.currentYear, AppState.currentMonth, 1).getDay();
        const daysInMonth = new Date(AppState.currentYear, AppState.currentMonth + 1, 0).getDate();
        let emptyDays = firstDay === 0 ? 6 : firstDay - 1; // Lunes como primer día
        
        for (let i = 0; i < emptyDays; i++) {
            let empty = document.createElement("div");
            empty.className = "cal-day empty";
            grid.appendChild(empty);
        }

        let mesDinero = 0;
        let mesHoras = 0;
        let mesDias = 0;

        for (let i = 1; i <= daysInMonth; i++) {
            let div = document.createElement("div");
            div.className = "cal-day";
            div.textContent = i;
            
            let mStr = (AppState.currentMonth + 1).toString().padStart(2, '0');
            let dStr = i.toString().padStart(2, '0');
            let dateStr = `${AppState.currentYear}-${mStr}-${dStr}`;
            
            let dWeek = new Date(AppState.currentYear, AppState.currentMonth, i).getDay();
            if (dWeek === 0 || dWeek === 6) div.classList.add("weekend");
            if (Holidays.isHoliday(dateStr, AppState.region, AppState.city)) div.classList.add("holiday");
            
            let reg = AppState.entries.find(r => r.fecha === dateStr);
            if (reg) {
                div.classList.add("has-record");
                div.classList.add(`bg-${reg.tipo.toLowerCase().replace(' ', 'a')}`);
                mesDinero += reg.dinero;
                mesHoras += reg.horas;
                mesDias++;
                div.addEventListener("click", () => onRegistroClick(reg));
            } else {
                div.addEventListener("click", () => onDiaClick(dateStr));
            }
            grid.appendChild(div);
        }

        document.getElementById("res-total-dinero").textContent = mesDinero.toFixed(2) + " €";
        document.getElementById("res-total-horas").textContent = mesHoras;
        document.getElementById("res-dias-trabajados").textContent = mesDias;
        
        let media = mesDias > 0 ? (mesHoras / mesDias).toFixed(1) : 0;
        document.getElementById("res-media-horas").textContent = media;
        
        Charts.render();
    }
};