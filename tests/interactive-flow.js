import puppeteer from 'puppeteer-core';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/Alessi/.gemini/antigravity-ide/brain/d32ea3e8-f954-4446-8fd8-b2a039fe0961';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function clickButtonWithText(page, textSearch) {
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes(textSearch)) {
      await b.click();
      return true;
    }
  }
  return false;
}

async function runInteractiveTest() {
  console.log('Iniciando navegador Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Navegando a la aplicación desplegada en GitHub Pages...');
  await page.goto('https://vlessvndroo.github.io/HorariosPlusAlessVersion/', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Captura 1: Pantalla inicial
  const step1Path = path.join(ARTIFACT_DIR, 'test_step1_career_select.png');
  await page.screenshot({ path: step1Path });

  // 2. Clic en "Planificar Informática"
  console.log('2. Seleccionando carrera: Ingeniería Informática...');
  const careerCard = await page.waitForSelector('div.group');
  await careerCard.click();
  await new Promise(r => setTimeout(r, 600));

  // Limpiar datos previos si existen
  await clickButtonWithText(page, 'Limpiar');
  // Handle confirm dialog if triggered
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  // Captura 2: Pantalla de selección de materias
  const step2Path = path.join(ARTIFACT_DIR, 'test_step2_courses_tab.png');
  await page.screenshot({ path: step2Path });

  // 3. Seleccionar asignaturas
  console.log('3. Seleccionando 3 materias del Pensum...');
  const courseCards = await page.$$('div.group.cursor-pointer');
  if (courseCards.length >= 3) {
    await courseCards[0].click(); // Álgebra y Trigonometría
    await new Promise(r => setTimeout(r, 200));
    await courseCards[1].click(); // Competencia Textual
    await new Promise(r => setTimeout(r, 200));
    await courseCards[3].click(); // Lógica
    await new Promise(r => setTimeout(r, 200));
  }

  // Captura 3: Materias seleccionadas
  const step3Path = path.join(ARTIFACT_DIR, 'test_step3_courses_selected.png');
  await page.screenshot({ path: step3Path });

  // 4. Ir al Paso 2: NRCs & Horarios
  console.log('4. Avanzando al Paso 2 (NRCs & Horarios)...');
  await clickButtonWithText(page, 'Continuar a Cargar NRCs');
  await new Promise(r => setTimeout(r, 700));

  // Llenar NRCs en los inputs
  console.log('5. Asignando números de NRC y distribuyendo días sin choque...');
  const nrcInputs = await page.$$('input[placeholder*="14201"], input[placeholder*="Ej."]');
  const testNrcs = ['10101', '10202', '10303'];
  for (let i = 0; i < nrcInputs.length && i < testNrcs.length; i++) {
    await nrcInputs[i].type(testNrcs[i]);
    await new Promise(r => setTimeout(r, 100));
  }

  // Cambiar los días para evitar choques: Materia 1 = Lunes, Materia 2 = Martes, Materia 3 = Miércoles
  const daySelects = await page.$$('select');
  // Day selects typically have options Lunes, Martes, etc.
  const targetDays = ['LUN', 'MAR', 'MIE'];
  let dayIdx = 0;
  for (const select of daySelects) {
    const isDaySelect = await page.evaluate(el => {
      return Array.from(el.options).some(o => o.value === 'LUN');
    }, select);

    if (isDaySelect && dayIdx < targetDays.length) {
      await select.select(targetDays[dayIdx]);
      dayIdx++;
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // Captura 4: NRCs configurados sin choque
  const step4Path = path.join(ARTIFACT_DIR, 'test_step4_nrcs_configured.png');
  await page.screenshot({ path: step4Path });

  // 5. Ir al Paso 3: Combinaciones y Calendario
  console.log('6. Generando combinaciones y visualizando calendario...');
  await clickButtonWithText(page, 'Ver Combinaciones');
  await new Promise(r => setTimeout(r, 1000));

  // Captura 5: Calendario renderizado con bloques horarios y tarjetas de clase
  const step5Path = path.join(ARTIFACT_DIR, 'test_step5_calendar_rendered.png');
  await page.screenshot({ path: step5Path });
  console.log('Captura 5 guardada exitosamente');

  await browser.close();
  console.log('¡Prueba interactiva completada exitosamente!');
}

runInteractiveTest().catch(err => {
  console.error('Error durante la prueba:', err);
  process.exit(1);
});
