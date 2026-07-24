import { AppState } from '../state.js';
import { Utils } from '../utils.js';

export const PDF = {
    exportar: () => {
        const { tabla, totalDinero, totalHoras, regs } = Utils.obtenerDatosMesExportar();
        if (tabla.length === 0) return alert("No hay registros este mes.");
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const mesNombre = Utils.meses[AppState.currentMonth];
        
        doc.setFontSize(22);
        doc.text(`Nómina - ${mesNombre} ${AppState.currentYear}`, 14, 20);
        
        doc.setFontSize(11);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);
        
        doc.autoTable({
            startY: 40,
            head: [['Fecha', 'Empresa', 'Horas', 'Tipo', 'Precio/h', 'Total']],
            body: tabla,
            theme: 'striped',
            headStyles: { fillColor: [0, 122, 255] }
        });
        
        let finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text(`Resumen Mensual`, 14, finalY);
        
        doc.setFontSize(11);
        doc.text(`Días Trabajados: ${regs.length}`, 14, finalY + 8);
        doc.text(`Horas Totales: ${totalHoras}`, 14, finalY + 16);
        
        doc.setFontSize(14);
        doc.setTextColor(0, 122, 255);
        doc.text(`Salario Bruto Total: ${totalDinero.toFixed(2)} €`, 14, finalY + 28);
        
        doc.save(`Nomina_${mesNombre}_${AppState.currentYear}.pdf`);
    }
};