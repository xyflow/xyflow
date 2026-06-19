import type { Options as HTMLToImageOptions } from 'html-to-image/es/types';
import type { ImageType, UseScreenshot, UseScreenshotOptions } from './types';
import { toJpeg as ElToJpg, toPng as ElToPng } from 'html-to-image';
import { ref } from 'vue';

export function useScreenshot(): UseScreenshot {
  const dataUrl = ref<string>('');
  const imgType = ref<ImageType>('png');
  const error = ref();

  async function capture(el: HTMLElement, options: UseScreenshotOptions = {}) {
    let data;

    const fileName = options.fileName ?? `vue-flow-screenshot-${Date.now()}`;

    switch (options.type) {
      case 'jpeg':
        data = await toJpeg(el, options);
        break;
      case 'png':
        data = await toPng(el, options);
        break;
      default:
        data = await toPng(el, options);
        break;
    }

    // immediately download the image if shouldDownload is true
    if (options.shouldDownload && fileName !== '') {
      download(fileName);
    }

    return data;
  }

  function toJpeg(el: HTMLElement, options: HTMLToImageOptions = { quality: 0.95 }) {
    error.value = null;

    return ElToJpg(el, options)
      .then((data) => {
        dataUrl.value = data;
        imgType.value = 'jpeg';
        return data;
      })
      .catch((error) => {
        error.value = error;
        throw new Error(error);
      });
  }

  function toPng(el: HTMLElement, options: HTMLToImageOptions = { quality: 0.95 }) {
    error.value = null;

    return ElToPng(el, options)
      .then((data) => {
        dataUrl.value = data;
        imgType.value = 'png';
        return data;
      })
      .catch((error) => {
        error.value = error;
        throw new Error(error);
      });
  }

  function download(fileName: string) {
    const link = document.createElement('a');
    link.download = `${fileName}.${imgType.value}`;
    link.href = dataUrl.value;
    link.click();
  }

  return {
    capture,
    download,
    dataUrl,
    error,
  };
}
