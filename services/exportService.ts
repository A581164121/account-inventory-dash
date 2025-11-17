import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a specific HTML element to a PDF file.
 * @param {string} elementId - The ID of the HTML element to export.
 * @param {string} fileName - The desired name of the output PDF file (without extension).
 */
export const exportToPdf = async (elementId: string, fileName: string) => {
    // Hide no-print elements temporarily for canvas rendering
    const noPrintElements = document.querySelectorAll('.no-print');
    noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');
    
    const input = document.getElementById(elementId);
    if (!input) {
        console.error(`Element with id "${elementId}" not found.`);
        alert('Could not export to PDF: element not found.');
        noPrintElements.forEach(el => (el as HTMLElement).style.display = ''); // Show elements again
        return;
    }

    try {
        const canvas = await html2canvas(input, { 
            scale: 2,
            useCORS: true,
            onclone: (document) => {
                // In the cloned document, we can be more aggressive with styles
                const clonedContent = document.getElementById(elementId);
                if (clonedContent) {
                   clonedContent.style.boxShadow = 'none';
                   clonedContent.style.border = 'none';
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10; // Margin top

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error exporting to PDF:", error);
        alert('An error occurred while exporting to PDF.');
    } finally {
        // Ensure no-print elements are visible again
        noPrintElements.forEach(el => (el as HTMLElement).style.display = '');
    }
};

/**
 * Exports an array of objects to a CSV file.
 * @param {T[]} data - The array of data to export.
 * @param {string} fileName - The desired name of the output CSV file (without extension).
 */
export const exportToCsv = <T extends object>(data: T[], fileName: string) => {
    if (!data || data.length === 0) {
        alert('No data to export.');
        return;
    }

    try {
        const headers = Object.keys(data[0]);
        const replacer = (_key: any, value: any) => value === null ? '' : value; // Handle null values
        
        const csvRows = [
            headers.join(','), // Header row
            ...data.map(row =>
                headers.map(fieldName =>
                    JSON.stringify((row as any)[fieldName], replacer)
                ).join(',')
            )
        ];

        const csvString = csvRows.join('\r\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${fileName}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (error) {
        console.error("Error exporting to CSV:", error);
        alert('An error occurred while exporting to CSV.');
    }
};
