import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import type { Translator } from '../lib/i18n';

export type ActiveTab = 'url' | 'text' | 'contact';

type ContactInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  url: string;
};

declare global {
  interface Window {
    QRious?: any;
  }
}

const DEFAULT_FILENAME = 'qr-code';

const initialContactInfo: ContactInfo = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  organization: '',
  url: '',
};

const useQRCodeGenerator = (t: Translator) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('url');
  const [qrData, setQrData] = useState('');
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [foregroundHex, setForegroundHex] = useState('#000000');
  const [backgroundHex, setBackgroundHex] = useState('#ffffff');

  const [centerImage, setCenterImage] = useState<string | null>(null);
  const [centerImageFile, setCenterImageFile] = useState<File | null>(null);

  const [customFilename, setCustomFilename] = useState(DEFAULT_FILENAME);
  const [addTimestamp, setAddTimestamp] = useState(false);

  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);

  const copyTimeoutRef = useRef<number | null>(null);

  const sanitizeFilename = useCallback((name: string) => {
    const cleaned = (name || DEFAULT_FILENAME)
      .replace(/[^\w\s-]/g, '')
      .trim();

    return cleaned || DEFAULT_FILENAME;
  }, []);

  const createTimestampedFilename = useCallback((baseName: string) => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${baseName}-${month}${day}-${hours}${minutes}.png`;
  }, []);

  const filenamePreview = useMemo(() => {
    return `${sanitizeFilename(customFilename)}.png`;
  }, [customFilename, sanitizeFilename]);

  const timestampedFilenamePreview = useMemo(() => {
    const base = sanitizeFilename(customFilename);
    return createTimestampedFilename(base);
  }, [customFilename, sanitizeFilename, createTimestampedFilename]);

  const addCenterImage = useCallback(
    (canvas: HTMLCanvasElement) =>
      new Promise<void>((resolve) => {
        if (!centerImage) {
          resolve();
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve();
          return;
        }

        const img = new Image();

        img.onload = () => {
          const canvasSize = canvas.width;
          const imageSize = canvasSize * 0.25;
          const position = (canvasSize - imageSize) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.fillStyle = backgroundColor;
          ctx.beginPath();
          ctx.arc(canvasSize / 2, canvasSize / 2, imageSize / 2 + 8, 0, 2 * Math.PI);
          ctx.fill();

          ctx.strokeStyle = backgroundColor === '#ffffff' ? '#f0f0f0' : '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(canvasSize / 2, canvasSize / 2, imageSize / 2 + 6, 0, 2 * Math.PI);
          ctx.stroke();

          ctx.save();
          ctx.beginPath();
          ctx.arc(canvasSize / 2, canvasSize / 2, imageSize / 2, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, position, position, imageSize, imageSize);
          ctx.restore();

          resolve();
        };

        img.src = centerImage;
      }),
    [backgroundColor, centerImage],
  );

  const generateFallbackQR = useCallback(
    (text: string) => {
      if (!qrContainerRef.current) {
        return;
      }

      qrContainerRef.current.innerHTML = '';

      const img = document.createElement('img');
      const encodedData = encodeURIComponent(text);

      img.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedData}&choe=UTF-8`;
      img.alt = t('qrCodeAlt');
      img.className = 'w-full h-auto rounded-xl shadow-lg bg-white p-4';
      img.style.maxWidth = '300px';
      img.style.height = 'auto';

      img.onerror = () => {
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10`;
      };

      qrContainerRef.current.appendChild(img);
    },
    [t],
  );

  const createQR = useCallback(
    async (text: string) => {
      if (!qrContainerRef.current) {
        return;
      }

      try {
        qrContainerRef.current.innerHTML = '';

        const canvas = document.createElement('canvas');
        qrContainerRef.current.appendChild(canvas);

        const qr = new window.QRious({
          element: canvas,
          value: text,
          size: 300,
          background: backgroundColor,
          foreground: foregroundColor,
          level: 'M',
        });

        if (centerImage) {
          await addCenterImage(canvas);
        }

        canvas.className = 'w-full h-auto rounded-xl shadow-lg';
        canvas.style.maxWidth = '300px';
        canvas.style.height = 'auto';
        canvas.style.backgroundColor = backgroundColor;

        return qr;
      } catch (error) {
        console.error('Error creating QR code:', error);
        generateFallbackQR(text);
      }
    },
    [addCenterImage, backgroundColor, centerImage, foregroundColor, generateFallbackQR],
  );

  const generateQRCode = useCallback(
    async (text: string) => {
      if (!qrContainerRef.current) {
        return;
      }

      if (!text.trim()) {
        qrContainerRef.current.innerHTML = '';
        return;
      }

      try {
        if (!window.QRious) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load QRious'));
            document.head.appendChild(script);
          });
        }

        await createQR(text);
      } catch (error) {
        console.error('Error loading QR library:', error);
        generateFallbackQR(text);
      }
    },
    [createQR, generateFallbackQR],
  );

  const handleImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setCenterImageFile(file);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result === 'string') {
        setCenterImage(result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleForegroundHexChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const hex = event.target.value;
      setForegroundHex(hex);

      if (/^#[0-9A-F]{6}$/i.test(hex)) {
        setForegroundColor(hex);
      }
    },
    [],
  );

  const handleBackgroundHexChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const hex = event.target.value;
      setBackgroundHex(hex);

      if (/^#[0-9A-F]{6}$/i.test(hex)) {
        setBackgroundColor(hex);
      }
    },
    [],
  );

  const removeCenterImage = useCallback(() => {
    setCenterImage(null);
    setCenterImageFile(null);
  }, []);

  const formatUrl = useCallback((url: string) => {
    if (!url.trim()) {
      return '';
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }

    return url;
  }, []);

  const generateVCard = useCallback((contact: ContactInfo) => {
    return `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.firstName} ${contact.lastName}\nN:${contact.lastName};${contact.firstName};;;\nORG:${contact.organization}\nTEL:${contact.phone}\nEMAIL:${contact.email}\nURL:${contact.url}\nEND:VCARD`;
  }, []);

  const downloadFromImage = useCallback((imgElement: HTMLImageElement, filename: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const downloadCanvas = document.createElement('canvas');
        const ctx = downloadCanvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context is unavailable'));
          return;
        }

        downloadCanvas.width = 300;
        downloadCanvas.height = 300;

        const newImg = new Image();
        newImg.crossOrigin = 'anonymous';

        newImg.onload = () => {
          try {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 300, 300);
            ctx.drawImage(newImg, 0, 0, 300, 300);

            downloadCanvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }

              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = filename;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              resolve();
            }, 'image/png', 1.0);
          } catch (error) {
            reject(error);
          }
        };

        newImg.onerror = () => {
          const link = document.createElement('a');
          link.download = filename;
          link.href = imgElement.src;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        };

        newImg.src = imgElement.src;
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const downloadQRCode = useCallback(async () => {
    if (!qrData) {
      return;
    }

    const canvas = qrContainerRef.current?.querySelector('canvas');
    const img = qrContainerRef.current?.querySelector('img');

    const baseFilename = sanitizeFilename(customFilename);
    const filename = addTimestamp ? createTimestampedFilename(baseFilename) : `${baseFilename}.png`;

    try {
      if (canvas) {
        canvas.toBlob((blob) => {
          if (!blob) {
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
        return;
      }

      if (img) {
        await downloadFromImage(img, filename);
      }
    } catch (error) {
      console.error('Download failed:', error);

      if (canvas) {
        try {
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = filename;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (fallbackError) {
          console.error('Fallback download also failed:', fallbackError);
          alert('Download failed. Please try right-clicking on the QR code and selecting "Save image as..."');
        }
      }
    }
  }, [addTimestamp, createTimestampedFilename, customFilename, downloadFromImage, qrData, qrContainerRef, sanitizeFilename]);

  const copyToClipboard = useCallback(async () => {
    if (!qrData) {
      return;
    }

    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, [qrData]);

  const resetForm = useCallback(() => {
    setUrlInput('');
    setTextInput('');
    setContactInfo(initialContactInfo);

    setForegroundColor('#000000');
    setBackgroundColor('#ffffff');
    setForegroundHex('#000000');
    setBackgroundHex('#ffffff');

    setCenterImage(null);
    setCenterImageFile(null);

    setCustomFilename(DEFAULT_FILENAME);
    setAddTimestamp(false);
    setCopied(false);

    setQrData('');

    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
    }
  }, []);

  const setContactField = useCallback((field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    let data = '';

    switch (activeTab) {
      case 'url':
        data = formatUrl(urlInput);
        break;
      case 'text':
        data = textInput;
        break;
      case 'contact':
        if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
          data = generateVCard(contactInfo);
        }
        break;
      default:
        data = '';
    }

    setQrData(data);
    generateQRCode(data);
  }, [activeTab, contactInfo, formatUrl, generateQRCode, generateVCard, textInput, urlInput]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  return {
    activeTab,
    setActiveTab,
    qrData,
    qrContainerRef,
    copied,
    copyToClipboard,
    urlInput,
    setUrlInput,
    textInput,
    setTextInput,
    contactInfo,
    setContactField,
    foregroundColor,
    setForegroundColor,
    backgroundColor,
    setBackgroundColor,
    foregroundHex,
    setForegroundHex,
    backgroundHex,
    setBackgroundHex,
    handleForegroundHexChange,
    handleBackgroundHexChange,
    handleImageUpload,
    centerImage,
    centerImageFile,
    removeCenterImage,
    customFilename,
    setCustomFilename,
    addTimestamp,
    setAddTimestamp,
    filenamePreview,
    timestampedFilenamePreview,
    downloadQRCode,
    resetForm,
  };
};

export default useQRCodeGenerator;
