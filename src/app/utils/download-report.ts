import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export interface DownloadReportOptions {
  container: HTMLElement;
  fileName: string;
  excludedSelector?: string;
  pixelRatio?: number;
  backgroundColor?: string;
}

/**
 * Capture the supplied container as a PNG and generate a multi-page A4 PDF.
 * Elements matching `excludedSelector` are hidden while capturing.
 */
export async function downloadReportAsPdf(options: DownloadReportOptions): Promise<void> {
  const {
    container,
    fileName,
    excludedSelector = '.report-exclude',
    pixelRatio = 3,
    backgroundColor = '#f9fafb',
  } = options;

  const excludedElements = container.querySelectorAll(excludedSelector);
  excludedElements.forEach((el) => {
    (el as HTMLElement).style.display = 'none';
  });

  try {
    const dataUrl = await toPng(container, {
      cacheBust: true,
      pixelRatio,
      backgroundColor,
      quality: 1,
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const horizontalMargin = 24;
    const verticalMargin = 24;
    const contentWidth = pageWidth - horizontalMargin * 2;
    const contentHeight = pageHeight - verticalMargin * 2;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const scaledWidth = contentWidth;
    const scale = scaledWidth / imgWidth;
    const scaledHeight = imgHeight * scale;

    let position = 0;

    while (position < scaledHeight) {
      if (position > 0) {
        pdf.addPage();
      }

      const sliceHeight = Math.min(contentHeight, scaledHeight - position);
      const sourceY = (position / scaledHeight) * imgHeight;
      const sourceHeight = (sliceHeight / scaledHeight) * imgHeight;

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = scaledWidth * 2;
      pageCanvas.height = sliceHeight * 2;
      const ctx = pageCanvas.getContext('2d', { alpha: false });
      if (!ctx) {
        throw new Error('تعذر إنشاء سياق الرسم');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        img,
        0,
        sourceY,
        imgWidth,
        sourceHeight,
        0,
        0,
        pageCanvas.width,
        pageCanvas.height
      );

      const sliceDataUrl = pageCanvas.toDataURL('image/png');
      pdf.addImage(
        sliceDataUrl,
        'PNG',
        horizontalMargin,
        verticalMargin,
        scaledWidth,
        sliceHeight,
        undefined,
        'SLOW'
      );

      position += sliceHeight;
    }

    pdf.save(fileName);
  } finally {
    excludedElements.forEach((el) => {
      (el as HTMLElement).style.display = '';
    });
  }
}

/**
 * Convenience wrapper that also shows a loading toast and handles errors.
 */
export async function handleReportDownload(options: DownloadReportOptions & { setIsDownloading?: (value: boolean) => void }): Promise<void> {
  const { setIsDownloading, ...rest } = options;

  setIsDownloading?.(true);
  try {
    await downloadReportAsPdf(rest);
  } catch (err: any) {
    console.error('Report download failed', err);
    toast.error(err?.message || 'فشل تحميل التقرير. يرجى المحاولة مرة أخرى.');
  } finally {
    setIsDownloading?.(false);
  }
}
