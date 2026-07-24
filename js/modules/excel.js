import { AppState } from '../state.js';
import { Utils } from '../utils.js';

export const Excel = {
    exportar: () => {
        const { tabla, totalDinero, totalHoras, regs } = Utils.obtenerDatosMesExportar();
        if (tabla.length === 0) return alert("No hay registros este mes.");
        
        let dataSheet = [
            ["Fecha", "Empresa", "Horas", "Tipo", "Precio/h", "Total Ganado"]
        ];
        
        tabla.forEach(row => {
            let valPrecio = parseFloat(row[4].replace('€', '').trim());
            let valTotal = parseFloat(row[5].replace('€', '').trim());
            dataSheet.push([row[0], row[1], parseFloat(row[2]), row[3], valPrecio, valTotal]);
        });
        
        dataSheet.push([]);
        dataSheet.push(["RESUMEN MENSUAL"]);
        dataSheet.push(["Días Trabajados", regs.length]);
        dataSheet.push(["Horas Totales", totalHoras]);
        dataSheet.push(["Salario Bruto", totalDinero]);
        
        const ws = XLSX.utils.aoa_to_sheet(dataSheet);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Nómina");
        
        const mesNombre = Utils.meses[AppState.currentMonth];
        XLSX.writeFile(wb, `Nomina_${mesNombre}_${AppState.currentYear}.xlsx`);
    }
};