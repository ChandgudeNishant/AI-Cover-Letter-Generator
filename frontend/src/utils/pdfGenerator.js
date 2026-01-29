import jsPDF from "jspdf";

export const generatePDF = (
  content,
  applicantName = "Applicant",
  applicantEmail = "",
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxLineWidth = pageWidth - margin * 2;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(applicantName, margin, margin + 10);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(currentDate, pageWidth - margin, margin + 10, { align: "right" });

  let yPosition = margin + 30;

  const cleanContent = content
    .replace(/<\/p>/gi, "\n\n") // Convert closing paragraphs to double newlines
    .replace(/<br\s*\/?>/gi, "\n") // Convert line breaks to newlines
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    // Remove "Sincerely" and everything after it (case insensitive, optional whitespace)
    .replace(/\s*Sincerely[\s\S]*$/, "")
    .trim();

  const paragraphs = cleanContent.split(/\n\s*\n/).filter((p) => p.trim());

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  paragraphs.forEach((paragraph, index) => {
    if (yPosition > pageHeight - margin - 20) {
      doc.addPage();
      yPosition = margin + 10;
    }

    const words = paragraph.trim().split(" ");
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const textWidth = doc.getTextWidth(testLine);

      if (textWidth < maxLineWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          if (yPosition > pageHeight - margin - 10) {
            doc.addPage();
            yPosition = margin + 10;
          }

          // Manual Justification
          const lineWords = currentLine.split(" ");
          if (lineWords.length > 1) {
            const totalWordsWidth = lineWords.reduce(
              (acc, w) => acc + doc.getTextWidth(w),
              0,
            );
            const totalSpace = maxLineWidth - totalWordsWidth;
            const spaceWidth = totalSpace / (lineWords.length - 1);

            let currentX = margin;
            lineWords.forEach((w) => {
              doc.text(w, currentX, yPosition);
              currentX += doc.getTextWidth(w) + spaceWidth;
            });
          } else {
            doc.text(currentLine, margin, yPosition);
          }

          yPosition += 6;
          currentLine = word;
        } else {
          if (yPosition > pageHeight - margin - 10) {
            doc.addPage();
            yPosition = margin + 10;
          }

          doc.text(word, margin, yPosition);
          yPosition += 6;
        }
      }
    });

    if (currentLine) {
      if (yPosition > pageHeight - margin - 10) {
        doc.addPage();
        yPosition = margin + 10;
      }

      doc.text(currentLine, margin, yPosition);
      yPosition += 6;
    }

    if (index < paragraphs.length - 1) {
      yPosition += 4;
    }
  });
  // console.log("paragraphs", paragraphs[0]);
  const footerText =
    "Sincerely,\\n" +
    applicantName +
    (applicantEmail ? "\\n" + applicantEmail : "");
  yPosition += 15;

  if (yPosition > pageHeight - margin - 20) {
    doc.addPage();
    yPosition = margin + 10;
  }

  doc.setFont("helvetica", "normal");
  doc.setFont("helvetica", "normal");

  // Footer parts: Sincerely, Name, Email (optional)
  const footerParts = ["Sincerely,", applicantName];
  if (applicantEmail) footerParts.push(applicantEmail);

  footerParts.forEach((line) => {
    // Check if this line is the email to color it blue
    if (line === applicantEmail) {
      doc.setTextColor(0, 0, 255); // Blue
    } else {
      doc.setTextColor(0, 0, 0); // Black
    }

    doc.text(line, margin, yPosition);
    yPosition += 6;
  });

  // Reset color to black just in case
  doc.setTextColor(0, 0, 0);

  yPosition += 1;
  if (yPosition > pageHeight - margin - 10) {
    doc.addPage();
    yPosition = margin + 10;
  }

  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, margin + 60, yPosition);

  const safeApplicantName = applicantName.replace(/\\s+/g, "_");
  const dateStr = new Date().toISOString().split("T")[0];
  const fileName = "Cover_Letter_" + safeApplicantName + "_" + dateStr + ".pdf";
  doc.save(fileName);
};
