import { AppState } from '../state.js';

export const Charts = {
    render: () => {
        const regAno = AppState.entries.filter(r => r.fecha.startsWith(AppState.currentYear.toString()));
        let datosMeses = new Array(12).fill(0);
        let totalAno = 0;
        let horasAno = 0;
        
        regAno.forEach(r => {
            let m = parseInt(r.fecha.split("-")[1]) - 1;
            datosMeses[m] += r.dinero;
            totalAno += r.dinero;
            horasAno += r.horas;
        });
        
        document.getElementById("res-anio-dinero").textContent = totalAno.toFixed(2) + " €";
        document.getElementById("res-anio-horas").textContent = horasAno;
        
        const ctx = document.getElementById('chart-anual').getContext('2d');
        if (AppState.chart) AppState.chart.destroy();
        
        const colorConfig = document.body.classList.contains('dark-mode') ? '#ffffff' : '#333333';
        AppState.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Ingresos Brutos (€)',
                    data: datosMeses,
                    backgroundColor: '#007aff',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { color: colorConfig } },
                    x: { ticks: { color: colorConfig } }
                }
            }
        });
    }
};