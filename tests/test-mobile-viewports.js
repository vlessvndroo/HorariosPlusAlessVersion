import puppeteer from 'puppeteer-core';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

const ARTIFACT_DIR = 'C:/Users/Alessi/.gemini/antigravity-ide/brain/d32ea3e8-f954-4446-8fd8-b2a039fe0961';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// Simple static server for dist
function startLocalServer(port = 4173) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    if (cleanUrl.startsWith('/HorariosPlusAlessVersion/')) {
      cleanUrl = cleanUrl.replace('/HorariosPlusAlessVersion/', '/');
    }
    let filePath = path.join(process.cwd(), 'dist', cleanUrl === '/' ? 'index.html' : cleanUrl);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'dist', 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function clickButtonWithText(page, textSearch) {
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const isVisible = await page.evaluate(el => el.offsetParent !== null && !el.disabled, b);
    if (!isVisible) continue;
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes(textSearch)) {
      await b.click();
      return true;
    }
  }
  return false;
}

async function runMobileTests() {
  console.log('Iniciando servidor local de producción para pruebas móviles...');
  const server = await startLocalServer(4174);
  const BASE_URL = 'http://localhost:4174/HorariosPlusAlessVersion/';

  console.log('Iniciando Chrome con emulación móvil...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Emulación iPhone 14 (390 x 844, escala 2x, touch activado)
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  page.on('dialog', async d => await d.accept());

  console.log('1. Navegando a la app en móvil...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });

  // Captura 1: Pantalla de inicio en Móvil
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_step1_career.png') });
  console.log('Captura 1: Pantalla de carreras en móvil guardada.');

  // Seleccionar Informática
  const careerCard = await page.waitForSelector('div.group');
  await careerCard.click();
  await new Promise(r => setTimeout(r, 600));

  // Captura 2: Paso 1 (Materias) en Móvil
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_step2_courses.png') });
  console.log('Captura 2: Catálogo de materias en móvil guardado.');

  // Seleccionar 3 materias
  const courseCards = await page.$$('div.group.cursor-pointer');
  if (courseCards.length >= 3) {
    await courseCards[0].click();
    await new Promise(r => setTimeout(r, 200));
    await courseCards[1].click();
    await new Promise(r => setTimeout(r, 200));
    await courseCards[3].click();
    await new Promise(r => setTimeout(r, 200));
  }

  // Ir a Paso 2: NRCs
  await clickButtonWithText(page, 'Continuar a Cargar NRCs');
  await new Promise(r => setTimeout(r, 600));

  // Llenar inputs de NRC
  const nrcInputs = await page.$$('input[placeholder*="14201"], input[placeholder*="Ej."]');
  const sampleNrcs = ['10101', '10202', '10303'];
  for (let i = 0; i < nrcInputs.length && i < sampleNrcs.length; i++) {
    await nrcInputs[i].click({ clickCount: 3 });
    await nrcInputs[i].type(sampleNrcs[i]);
    await new Promise(r => setTimeout(r, 100));
  }

  // Configurar NRCs y días sin choque
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const daySelects = selects.filter(s => Array.from(s.options).some(o => o.value === 'LUN'));
    const targetDays = ['LUN', 'MAR', 'MIE'];
    daySelects.forEach((sel, idx) => {
      if (idx < targetDays.length) {
        sel.value = targetDays[idx];
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    const timeSelects = selects.filter(s => Array.from(s.options).some(o => o.value === '07:00'));
    if (timeSelects.length >= 6) {
      timeSelects[2].value = '09:00';
      timeSelects[2].dispatchEvent(new Event('change', { bubbles: true }));
      timeSelects[3].value = '11:00';
      timeSelects[3].dispatchEvent(new Event('change', { bubbles: true }));
      timeSelects[4].value = '11:00';
      timeSelects[4].dispatchEvent(new Event('change', { bubbles: true }));
      timeSelects[5].value = '13:00';
      timeSelects[5].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Captura 3: Paso 2 (NRCs) en Móvil
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_step3_nrcs.png') });
  console.log('Captura 3: Configuración de NRCs en móvil guardada.');

  // Ir a Paso 3: Horarios / Combinaciones
  await clickButtonWithText(page, 'Ver Combinaciones Generadas');
  await new Promise(r => setTimeout(r, 1000));

  // Captura 4: Paso 3 - Vista Móvil de Agenda Completa
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_step4_agenda.png') });
  console.log('Captura 4: Vista Agenda completa en móvil guardada.');

  // Filtrar por un día específico (ej. Martes "Mar")
  await clickButtonWithText(page, 'Mar');
  await new Promise(r => setTimeout(r, 500));

  // Captura 5: Paso 3 - Vista Móvil de Día Específico (Martes)
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_step5_day.png') });
  console.log('Captura 5: Vista de Día específico (Martes) en móvil guardada.');

  // Cambiar a Vista Matriz Semanal deslizable
  await clickButtonWithText(page, 'Matriz');
  await new Promise(r => setTimeout(r, 500));

  // Captura 6: Paso 3 - Vista Matriz Semanal deslizable en móvil
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_step6_matrix.png') });
  console.log('Captura 6: Vista Matriz semanal deslizable en móvil guardada.');

  // Cambiar a Resumen y NRCs
  await clickButtonWithText(page, 'Resumen y NRCs');
  await new Promise(r => setTimeout(r, 500));

  // Captura 7: Paso 3 - Resumen y NRCs en móvil
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_mobile_step7_resumen.png') });
  console.log('Captura 7: Resumen y lista de NRCs en móvil guardada.');

  await browser.close();
  server.close();
  console.log('✅ Todas las pruebas de vista móvil se ejecutaron con éxito.');
}

runMobileTests().catch(err => {
  console.error('Error en pruebas móviles:', err);
  process.exit(1);
});
