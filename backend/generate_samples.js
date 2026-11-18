import fs from 'fs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

async function createValidPdf(filePath, title, skills, experience) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();
  const fontSize = 12;

  page.drawText(title, {
    x: 50,
    y: height - 50,
    size: 20,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Technical Skills: ${skills}`, {
    x: 50,
    y: height - 100,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText(`Summary & Experience: ${experience}`, {
    x: 50,
    y: height - 140,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);
}

async function run() {
  await createValidPdf(
    '../test-samples/frontend_resume.pdf',
    'John Doe - Frontend Developer',
    'React, React.js, HTML5, CSS3, JavaScript, TypeScript, TailwindCSS, Redux, Next.js',
    'Experienced Frontend Engineer specialized in responsive web design, DOM manipulation, and interactive web apps.'
  );

  await createValidPdf(
    '../test-samples/data_analyst_resume.pdf',
    'Jane Smith - Data Analyst',
    'SQL, Power BI, Tableau, Advanced Excel, Pivot Tables, Data Visualization, ETL, Reporting',
    'Data Analyst with 3 years experience building interactive business intelligence dashboards and KPI reports.'
  );

  await createValidPdf(
    '../test-samples/ui_ux_resume.pdf',
    'Alex Morgan - UI/UX Designer',
    'Figma, Adobe XD, Wireframing, Prototyping, User Research, Design System, Usability Testing',
    'Product designer focused on user experience, user interface mockups, wireframes, and design consistency.'
  );

  await createValidPdf(
    '../test-samples/fullstack_resume.pdf',
    'Sam Wilson - Full Stack Developer',
    'React, Node.js, Express, MongoDB, REST API, JavaScript, HTML, CSS, SQL',
    'Full Stack Engineer building fullstack web solutions with MERN stack and relational databases.'
  );

  console.log('Valid PDFs generated successfully!');
}

run();
