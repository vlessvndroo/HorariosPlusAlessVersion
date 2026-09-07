import puppeteer from 'puppeteer-core';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/Alessi/.gemini/antigravity-ide/brain/d32ea3e8-f954-4446-8fd8-b2a039fe0961';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function clickButtonWithText(page, textSearch) {
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes(textSearch)) {
      await b.click();
      return true;
    }
  }
  return false;
}

async function runLiveVisualDemo() {
  console.log('==================================================');
  console.log('🚀 INICIANDO PRUEBA VISUAL EN VIVO (HEADLESS: FALSE)');
  console.log('Observa tu pantalla: Chrome se abrirá de forma visible.');
  console.log('==================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false, // ¡Visible en tu monitor!
    slowMo: 300,     // Retraso intencional para ver cada clic e interacción humana
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox']
  });

  const pages = await browser.pages();
  const page = pages.length > 0 ? pages[0] : await browser.newPage();

  // Auto-aceptar diálogos de alerta o confirmación
  page.on('dialog', async dialog => {
    console.log(`[Diálogo emergente]: "${dialog.message()}" -> Aceptando automáticamente`);
    await dialog.accept();
  });

  console.log('\n📍 Paso 1: Abriendo la web desplegada en GitHub Pages...');
  await page.goto('https://vlessvndroo.github.io/HorariosPlusAlessVersion/', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Limpiar localStorage para arrancar una prueba 100% limpia
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_step1_career_select.png') });

  console.log('\n📍 Paso 2: Seleccionando la carrera Ingeniería Informática...');
  const careerCard = await page.waitForSelector('div.group');
  await careerCard.click();
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_step2_courses_tab.png') });

  console.log('\n📍 Paso 3: Seleccionando 3 materias del Pensum...');
  const courseCards = await page.$$('div.group.cursor-pointer');
  if (courseCards.length >= 3) {
    console.log(' - Seleccionando Materia 1 (Álgebra y Trigonometría)...');
    await courseCards[0].click();
    await new Promise(r => setTimeout(r, 600));

    console.log(' - Seleccionando Materia 2 (Competencia Textual en Español)...');
    await courseCards[1].click();
    await new Promise(r => setTimeout(r, 600));

    console.log(' - Seleccionando Materia 3 (Lógica)...');
    await courseCards[3].click();
    await new Promise(r => setTimeout(r, 600));
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_step3_courses_selected.png') });

  console.log('\n📍 Paso 4: Navegando a la pestaña "Paso 2: NRCs & Horarios"...');
  await clickButtonWithText(page, 'Continuar a Cargar NRCs');
  await new Promise(r => setTimeout(r, 1200));

  console.log('\n📍 Paso 5: Configurando NRCs y distribuyendo horarios sin choque...');
  // Configurar inputs de NRC
  const nrcInputs = await page.$$('input[placeholder*="14201"], input[placeholder*="Ej."]');
  const sampleNrcs = ['10101', '10202', '10303'];
  for (let i = 0; i < nrcInputs.length && i < sampleNrcs.length; i++) {
    await nrcInputs[i].click({ clickCount: 3 });
    await nrcInputs[i].type(sampleNrcs[i]);
    await new Promise(r => setTimeout(r, 300));
  }

  // Configurar los días para que no choquen:
  // Evaluamos todos los <select> de la página
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

    // Ajustar también horas de inicio y fin si es necesario
    const timeSelects = selects.filter(s => Array.from(s.options).some(o => o.value === '07:00'));
    // En cada slot hay 2 selectores de tiempo (start y end)
    // Slot 0: 07:00 a 09:00 (por defecto)
    // Slot 1: 09:00 a 11:00
    // Slot 2: 11:00 a 13:00
    if (timeSelects.length >= 6) {
      // Slot 1 start
      timeSelects[2].value = '09:00';
      timeSelects[2].dispatchEvent(new Event('change', { bubbles: true }));
      // Slot 1 end
      timeSelects[3].value = '11:00';
      timeSelects[3].dispatchEvent(new Event('change', { bubbles: true }));

      // Slot 2 start
      timeSelects[4].value = '11:00';
      timeSelects[4].dispatchEvent(new Event('change', { bubbles: true }));
      // Slot 2 end
      timeSelects[5].value = '13:00';
      timeSelects[5].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_step4_nrcs_configured.png') });

  console.log('\n📍 Paso 6: Generando combinaciones viables y renderizando el calendario...');
  await clickButtonWithText(page, 'Ver Combinaciones');
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_step5_calendar_rendered.png') });

  console.log('\n🎉 ¡Paso 7: Calendario generado con éxito!');
  console.log('Manteniendo el navegador abierto durante 12 segundos para que puedas apreciar la app en pantalla...');
  await new Promise(r => setTimeout(r, 12000));

  await browser.close();
  console.log('\n✅ Prueba visual finalizada.');
}

runLiveVisualDemo().catch(err => {
  console.error('Error durante la prueba visual:', err);
  process.exit(1);
});
