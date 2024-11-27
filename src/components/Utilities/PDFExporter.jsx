import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PDFExporter = ({ candidate }) => {
  const downloadPDF = async () => {
    const modalElement = document.querySelector(".modal-content"); // Modal içeriğini seçin

    if (!modalElement) {
      console.error("Modal content not found.");
      return;
    }

    try {
      // Modal içeriğini canvas olarak yakala
      const canvas = await html2canvas(modalElement, {
        scale: 2, // Yüksek çözünürlük için ölçek
      });

      // Canvas'ı görüntü olarak al
      const imgData = canvas.toDataURL("image/png");

      // PDF'yi yatay (landscape) modunda oluştur
      const pdf = new jsPDF("l", "mm", "a4"); // 'l' landscape, 'mm' milimetre, 'a4' sayfa boyutu
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Görüntüyü PDF'ye boyutlandırarak ekle
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pageWidth,
        (canvas.height * pageWidth) / canvas.width
      );

      // PDF'yi indir
      pdf.save(`${candidate.firstName}_Analysis_Report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <button
      onClick={downloadPDF}
      className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
    >
      Download Report
    </button>
  );
};

export default PDFExporter;
