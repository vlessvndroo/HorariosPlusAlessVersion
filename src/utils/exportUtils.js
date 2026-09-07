import html2canvas from 'html2canvas';

/**
 * Exporta el contenedor del calendario a imagen PNG de alta definición.
 */
export async function exportScheduleImage(elementId, careerTag, optionIndex, setIsExporting) {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  if (setIsExporting) setIsExporting(true);

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0b0f19',
      scale: 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    });

    const link = document.createElement('a');
    const tag = careerTag || 'UCAB';
    link.download = `Horario_${tag}_Opcion_${optionIndex + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Error al generar la imagen con html2canvas:', err);
    window.print();
  } finally {
    if (setIsExporting) setIsExporting(false);
  }
}

/**
 * Copia al portapapeles la lista detallada y resumida de NRCs de la combinación activa.
 */
export async function copyNrcList(currentCombination, careerName, onCopied) {
  if (!currentCombination || !currentCombination.length) return;

  const detailLines = [];
  const pureNrcs = [];

  currentCombination.forEach(item => {
    if (item.type === 'theory_practice') {
      detailLines.push(`• ${item.courseName} [${item.courseId}]: Teoría NRC ${item.theoryNrc} (${item.theorySectionName}), Práctica NRC ${item.practiceNrc} (${item.practiceSectionName})`);
      pureNrcs.push(item.theoryNrc, item.practiceNrc);
    } else if (item.type === 'virtual') {
      detailLines.push(`• ${item.courseName} [${item.courseId}]: NRC ${item.nrc} (${item.sectionName} - Virtual Asíncrona)`);
      pureNrcs.push(item.nrc);
    } else {
      detailLines.push(`• ${item.courseName} [${item.courseId}]: NRC ${item.nrc} (${item.sectionName})`);
      pureNrcs.push(item.nrc);
    }
  });

  const titleName = (careerName || 'UCAB').toUpperCase();
  const fullText = `HORARIO SELECCIONADO - ${titleName} (NRCs para inscripción):\nNRCs: ${pureNrcs.join(', ')}\n\nDetalle:\n${detailLines.join('\n')}`;

  try {
    await navigator.clipboard.writeText(fullText);
    if (onCopied) onCopied();
  } catch (err) {
    console.error('No se pudo copiar al portapapeles:', err);
  }
}
