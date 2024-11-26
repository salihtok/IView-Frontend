import jsPDF from "jspdf";

const PDFExporter = ({ candidate }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    const { firstName, lastName, result } = candidate;

    doc.text("Candidate Analysis Report", 10, 10);
    doc.text(`Name: ${firstName} ${lastName}`, 10, 20);
    doc.text(
      `Technical Skills: ${
        result?.analysis?.keyword_hits?.technical?.length || 0
      }`,
      10,
      30
    );
    doc.text(
      `Soft Skills: ${
        result?.analysis?.keyword_hits?.soft_skills?.length || 0
      }`,
      10,
      40
    );
    doc.text(
      `Positive Emotion: ${result?.emotion_analysis?.positive || 0}`,
      10,
      50
    );
    doc.text(
      `Neutral Emotion: ${result?.emotion_analysis?.neutral || 0}`,
      10,
      60
    );
    doc.text(
      `Negative Emotion: ${result?.emotion_analysis?.negative || 0}`,
      10,
      70
    );

    doc.save(`${firstName}_Analysis_Report.pdf`);
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
