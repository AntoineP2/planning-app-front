import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export type ReportPdfFormStateType = {
    selectedUsersId: string[];
    selectedDates: string[];
    reportPresenceData: ReportDataType[];
    isLoading: boolean;
    getReportPresenceData: (usersId: string[], datesString: string[]) => Promise<void>;
    setSelectedUsersId: (id: string[]) => void;
    setSelectedDates: (dates: string[]) => void;
    resetPresenceData: () => void;
};

export type ReportDataType = {
    userId: string;
    userName: string;
    workTypeName: string;
    remoteWorkDays: number;
    onsiteWorkDays: number;
    onsiteWorkPercentage: number;
    parkingUsagePercentage: number;
    totalWorkDays: number;
    totalDays: number;
    workDaysPercentage: number;
    noApplyEvent: number;
    businessDays: number;
  }

  export const generatePdf = async (reportPresenceData: ReportDataType[], selectedDates: string[]) => {
    const doc = new jsPDF();
    const startDate = selectedDates[0].split('/')[1] + "/" + selectedDates[0].split('/')[0] + "/" + selectedDates[0].split('/')[2];
    const endDate = selectedDates[1].split('/')[1] + "/" + selectedDates[1].split('/')[0] + "/" + selectedDates[1].split('/')[2];

    // Configurer des styles globaux
    const marginX = 10;
    const lineHeight = 10;

    // Parcourir les données et créer une page pour chaque utilisateur
    for (const data of reportPresenceData) {
        const { userName, workTypeName, remoteWorkDays, onsiteWorkDays, onsiteWorkPercentage, parkingUsagePercentage, totalWorkDays, businessDays, workDaysPercentage } = data;
        // Titre principal de la page
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 100);
        doc.text(`Rapport de Présence: ${userName}`, marginX, 20);
        
        // Ligne séparatrice
        doc.setLineWidth(0.5);
        doc.setDrawColor(100, 100, 250);
        doc.line(marginX, 25, 200, 25);

        // Section: Informations générales
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Informations Générales", marginX, 35);

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(`Nom du collaborateur : ${userName}`, marginX, 45);
        doc.text(`Type de travail : ${workTypeName}`, marginX, 55);
        doc.text(`Période sélectionnée : ${format(new Date(startDate), 'dd MMMM yyyy', { locale: fr })} - ${format(new Date(endDate), 'dd MMMM yyyy', { locale: fr })} `, marginX, 65)

        // Lignes de séparation entre sections
        doc.line(marginX, 70, 200, 70);

        // Section: Détails du travail
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Détails du temps de travail", marginX, 80);

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(`Nombre de jours en télétravail : ${remoteWorkDays}`, marginX, 90);
        doc.text(`Nombre de jours en présentiel : ${onsiteWorkDays}`, marginX, 100);
        doc.text(`Nombre total de jours de travail : ${totalWorkDays}`, marginX, 110);
        doc.text(`Nombre total de jours : ${businessDays}`, marginX, 120);
        doc.text(`Pourcentage de jours en présentiel : ${onsiteWorkPercentage}%`, marginX, 130);
        doc.text(`Pourcentage de jours de travail : ${workDaysPercentage}%`, marginX, 140);


        // Ligne de séparation
        doc.line(marginX, 145, 200, 145);

        // Section: Autres informations
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Autres Informations", marginX, 155);

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(`Pourcentage d'utilisation du parking : ${parkingUsagePercentage}%`, marginX, 165);


        // Ajouter une nouvelle page s'il y a plus d'un utilisateur
        if (reportPresenceData.indexOf(data) !== reportPresenceData.length - 1) {
            doc.addPage();
        }
    }

    // Enregistrer le document PDF

    doc.save('rapport de présence.pdf');
};

export const generateExcel = async (reportPresenceData: ReportDataType[], selectedDates: string[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rapport Présence');
    const startDate = selectedDates[0].split('/')[0] + "/" + selectedDates[0].split('/')[1] + "/" + selectedDates[0].split('/')[2];
    const endDate = selectedDates[1].split('/')[0] + "/" + selectedDates[1].split('/')[1] + "/" + selectedDates[1].split('/')[2];


    // Style des en-têtes
    const headerStyle: any = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } }, // Blanc
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '5972ff' } }, // Orange clair
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        },
    };

    // Style des cellules de données
    const cellStyle: any = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0F8FF' } }, // Bleu très clair
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        },
        alignment: { vertical: 'middle', horizontal: 'center' },
    };

    // Ajouter les en-têtes avec style
    worksheet.columns = [
        { header: "Nom d'utilisateur", key: 'userName', width: 35 },
        { header: 'Type de travail', key: 'workTypeName', width: 30 },
        { header: 'Date du début', key: 'startDate', width: 35 },
        { header: 'Date de fin', key: 'endDate', width: 35 },
        { header: 'Nombre total de jours ouvrés', key: 'businessDays', width: 35 },
        { header: "Nombre de jours non renseigné", key: 'noApplyEvent', width: 40 },
        { header: 'Nombre total de jours de travail', key: 'totalWorkDays', width: 35 },
        { header: 'Jours en télétravail', key: 'remoteWorkDays', width: 23 },
        { header: 'Jours en présentiel', key: 'onsiteWorkDays', width: 23 },
        { header: 'Pourcentage de jours de travail (%)', key: 'workDaysPercentage', width: 35 },
        { header: 'Pourcentage de présentiel (%)', key: 'onsiteWorkPercentage', width: 35 },
        { header: "Pourcentage d'utilisation du parking (%)", key: 'parkingUsagePercentage', width: 40 },
        
    ];

    worksheet.getRow(1).eachCell((cell) => {
        cell.style = headerStyle; // Appliquer le style aux en-têtes
    });

    // Ajouter les données avec style
    reportPresenceData.forEach((data) => {
        const row = worksheet.addRow({
            userName: data.userName,
            workTypeName: data.workTypeName,
            remoteWorkDays: data.remoteWorkDays,
            onsiteWorkDays: data.onsiteWorkDays,
            onsiteWorkPercentage: data.onsiteWorkPercentage,
            parkingUsagePercentage: data.parkingUsagePercentage,
            totalWorkDays: data.totalWorkDays,
            totalDays: data.totalDays,
            workDaysPercentage: data.workDaysPercentage,
            startDate,
            endDate,
            noApplyEvent: data.noApplyEvent,
            businessDays: data.businessDays,
        });

        row.eachCell((cell) => {
            cell.style = cellStyle; // Appliquer le style aux cellules de données
        });
    });

    // Générer et télécharger le fichier Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'rapport-presence-excel.xlsx');
};