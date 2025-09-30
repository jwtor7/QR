import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useQRCodeGenerator from './useQRCodeGenerator';
import type { Translator } from '../lib/i18n';

// Mock translator
const mockTranslator: Translator = (key) => key;

describe('useQRCodeGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      expect(result.current.tab.activeTab).toBe('url');
      expect(result.current.qr.data).toBe('');
      expect(result.current.qr.copied).toBe(false);
      expect(result.current.form.urlInput).toBe('');
      expect(result.current.form.textInput).toBe('');
      expect(result.current.form.contactInfo).toEqual({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        organization: '',
        url: '',
      });
      expect(result.current.colors.foreground).toBe('#000000');
      expect(result.current.colors.background).toBe('#ffffff');
      expect(result.current.centerImage.image).toBeNull();
      expect(result.current.download.filename).toBe('qr-code');
      expect(result.current.download.addTimestamp).toBe(false);
    });
  });

  describe('Tab switching', () => {
    it('should switch active tab', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.tab.setActiveTab('text');
      });

      expect(result.current.tab.activeTab).toBe('text');

      act(() => {
        result.current.tab.setActiveTab('contact');
      });

      expect(result.current.tab.activeTab).toBe('contact');
    });
  });

  describe('URL handling', () => {
    it('should update URL input', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.form.setUrlInput('example.com');
      });

      expect(result.current.form.urlInput).toBe('example.com');
    });

    it('should auto-format URLs without protocol', async () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.form.setUrlInput('example.com');
      });

      await waitFor(() => {
        expect(result.current.qr.data).toBe('https://example.com');
      });
    });

    it('should preserve URLs with https://', async () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.form.setUrlInput('https://example.com');
      });

      await waitFor(() => {
        expect(result.current.qr.data).toBe('https://example.com');
      });
    });

    it('should preserve URLs with http://', async () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.form.setUrlInput('http://example.com');
      });

      await waitFor(() => {
        expect(result.current.qr.data).toBe('http://example.com');
      });
    });

    it('should handle empty URL input', async () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.form.setUrlInput('');
      });

      await waitFor(() => {
        expect(result.current.qr.data).toBe('');
      });
    });
  });

  describe('Text handling', () => {
    it('should update text input', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.tab.setActiveTab('text');
        result.current.form.setTextInput('Hello World');
      });

      expect(result.current.form.textInput).toBe('Hello World');
    });

    it('should generate QR data from text', async () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.tab.setActiveTab('text');
        result.current.form.setTextInput('Hello World');
      });

      await waitFor(() => {
        expect(result.current.qr.data).toBe('Hello World');
      });
    });
  });

  describe('Contact/vCard handling', () => {
    it('should update contact fields', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.tab.setActiveTab('contact');
        result.current.form.setContactField('firstName', 'John');
        result.current.form.setContactField('lastName', 'Doe');
        result.current.form.setContactField('email', 'john@example.com');
      });

      expect(result.current.form.contactInfo.firstName).toBe('John');
      expect(result.current.form.contactInfo.lastName).toBe('Doe');
      expect(result.current.form.contactInfo.email).toBe('john@example.com');
    });

    it('should generate vCard data when contact fields are filled', async () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.tab.setActiveTab('contact');
        result.current.form.setContactField('firstName', 'John');
        result.current.form.setContactField('lastName', 'Doe');
        result.current.form.setContactField('email', 'john@example.com');
        result.current.form.setContactField('phone', '+1234567890');
      });

      await waitFor(() => {
        expect(result.current.qr.data).toContain('BEGIN:VCARD');
        expect(result.current.qr.data).toContain('VERSION:3.0');
        expect(result.current.qr.data).toContain('FN:John Doe');
        expect(result.current.qr.data).toContain('EMAIL:john@example.com');
        expect(result.current.qr.data).toContain('TEL:+1234567890');
        expect(result.current.qr.data).toContain('END:VCARD');
      });
    });

    it('should not generate vCard when all contact fields are empty', async () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.tab.setActiveTab('contact');
      });

      await waitFor(() => {
        expect(result.current.qr.data).toBe('');
      });
    });
  });

  describe('Color customization', () => {
    it('should update foreground color', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.colors.setForeground('#FF0000');
      });

      expect(result.current.colors.foreground).toBe('#FF0000');
    });

    it('should update background color', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.colors.setBackground('#00FF00');
      });

      expect(result.current.colors.background).toBe('#00FF00');
    });

    it('should only accept valid hex colors in text input handler', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      const validColorEvent = {
        target: { value: '#ABCDEF' },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.colors.handleForegroundColorChange(validColorEvent);
      });

      expect(result.current.colors.foreground).toBe('#ABCDEF');

      const invalidColorEvent = {
        target: { value: 'invalid' },
      } as React.ChangeEvent<HTMLInputElement>;

      const previousColor = result.current.colors.foreground;

      act(() => {
        result.current.colors.handleForegroundColorChange(invalidColorEvent);
      });

      // Should not change on invalid input
      expect(result.current.colors.foreground).toBe(previousColor);
    });
  });

  describe('Center image', () => {
    it('should handle image upload', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const event = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.centerImage.handleUpload(event);
      });

      expect(result.current.centerImage.file).toBe(file);
    });

    it('should remove center image', async () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const event = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.centerImage.handleUpload(event);
      });

      expect(result.current.centerImage.file).toBe(file);

      act(() => {
        result.current.centerImage.remove();
      });

      expect(result.current.centerImage.image).toBeNull();
      expect(result.current.centerImage.file).toBeNull();
    });
  });

  describe('Download settings', () => {
    it('should update custom filename', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.download.setFilename('my-custom-qr');
      });

      expect(result.current.download.filename).toBe('my-custom-qr');
    });

    it('should sanitize filename in preview', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.download.setFilename('my@qr#code!');
      });

      expect(result.current.download.filenamePreview).toBe('myqrcode.png');
    });

    it('should toggle timestamp option', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      expect(result.current.download.addTimestamp).toBe(false);

      act(() => {
        result.current.download.setAddTimestamp(true);
      });

      expect(result.current.download.addTimestamp).toBe(true);
    });

    it('should generate timestamped filename preview', () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.download.setFilename('test');
        result.current.download.setAddTimestamp(true);
      });

      const preview = result.current.download.timestampedFilenamePreview;
      expect(preview).toMatch(/^test-\d{4}-\d{4}\.png$/);
    });
  });

  describe('Copy to clipboard', () => {
    it('should copy QR data to clipboard', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      act(() => {
        result.current.form.setUrlInput('https://example.com');
      });

      await waitFor(() => {
        expect(result.current.qr.data).toBe('https://example.com');
      });

      await act(async () => {
        await result.current.qr.copyToClipboard();
      });

      expect(writeTextMock).toHaveBeenCalledWith('https://example.com');
      expect(result.current.qr.copied).toBe(true);
    });

    it('should copy QR image to clipboard', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/png' });
      const writeClipboardMock = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, 'clipboard', {
        value: {
          write: writeClipboardMock,
        },
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      // Create a container div and mock canvas element
      const containerDiv = document.createElement('div');
      const mockCanvas = document.createElement('canvas');
      mockCanvas.toBlob = vi.fn((callback) => {
        callback(mockBlob);
      }) as any;

      containerDiv.appendChild(mockCanvas);

      // Set the container ref
      act(() => {
        // @ts-ignore
        result.current.qr.containerRef.current = containerDiv;
        result.current.form.setUrlInput('https://example.com');
      });

      await waitFor(() => {
        expect(result.current.qr.data).toBe('https://example.com');
      });

      await act(async () => {
        await result.current.qr.copyImageToClipboard();
      });

      expect(writeClipboardMock).toHaveBeenCalled();
      expect(result.current.qr.copiedImage).toBe(true);
    });
  });

  describe('Reset form', () => {
    it('should reset all fields to initial state', async () => {
      const { result } = renderHook(() => useQRCodeGenerator(mockTranslator));

      // Change various fields
      act(() => {
        result.current.tab.setActiveTab('text');
        result.current.form.setUrlInput('https://example.com');
        result.current.form.setTextInput('Hello');
        result.current.form.setContactField('firstName', 'John');
        result.current.colors.setForeground('#FF0000');
        result.current.colors.setBackground('#00FF00');
        result.current.download.setFilename('custom');
        result.current.download.setAddTimestamp(true);
      });

      // Reset
      act(() => {
        result.current.resetForm();
      });

      // Check all fields are back to defaults
      expect(result.current.form.urlInput).toBe('');
      expect(result.current.form.textInput).toBe('');
      expect(result.current.form.contactInfo).toEqual({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        organization: '',
        url: '',
      });
      expect(result.current.colors.foreground).toBe('#000000');
      expect(result.current.colors.background).toBe('#ffffff');
      expect(result.current.centerImage.image).toBeNull();
      expect(result.current.download.filename).toBe('qr-code');
      expect(result.current.download.addTimestamp).toBe(false);
      expect(result.current.qr.data).toBe('');
      expect(result.current.qr.copied).toBe(false);
      expect(result.current.qr.copiedImage).toBe(false);
    });
  });
});