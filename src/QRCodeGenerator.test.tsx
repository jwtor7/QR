import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QRCodeGenerator from './QRCodeGenerator';

describe('QRCodeGenerator Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the app title and description', () => {
      render(<QRCodeGenerator />);

      expect(screen.getByText(/QR Code Generator/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Generate QR codes for URLs, text, and contact information/i)
      ).toBeInTheDocument();
    });

    it('should render all three tabs', () => {
      render(<QRCodeGenerator />);

      expect(screen.getByRole('button', { name: /URL/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Text/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Contact/i })).toBeInTheDocument();
    });

    it('should show placeholder message when no QR code is generated', () => {
      render(<QRCodeGenerator />);

      expect(screen.getByText(/Fill in the form to generate your QR code/i)).toBeInTheDocument();
    });
  });

  describe('URL Tab', () => {
    it('should be active by default', () => {
      render(<QRCodeGenerator />);

      const urlTab = screen.getByRole('button', { name: /URL/i });
      expect(urlTab).toHaveClass('text-purple-600');
    });

    it('should generate QR code when URL is entered', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const urlInput = screen.getByPlaceholderText(/example.com or https:\/\/example.com/i);

      await user.type(urlInput, 'example.com');

      await waitFor(() => {
        expect(screen.queryByText(/Fill in the form to generate your QR code/i)).not.toBeInTheDocument();
      });
    });

    it('should show download and copy buttons when QR is generated', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const urlInput = screen.getByPlaceholderText(/example.com or https:\/\/example.com/i);
      await user.type(urlInput, 'example.com');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Copy Data/i })).toBeInTheDocument();
      });
    });

    it('should display QR code data', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const urlInput = screen.getByPlaceholderText(/example.com or https:\/\/example.com/i);
      await user.type(urlInput, 'example.com');

      await waitFor(() => {
        expect(screen.getByText(/QR Code Data:/i)).toBeInTheDocument();
        expect(screen.getByText(/https:\/\/example.com/i)).toBeInTheDocument();
      });
    });
  });

  describe('Text Tab', () => {
    it('should switch to text tab', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const textTab = screen.getByRole('button', { name: /Text/i });
      await user.click(textTab);

      expect(textTab).toHaveClass('text-purple-600');
      expect(screen.getByPlaceholderText(/Enter any text to generate QR code.../i)).toBeInTheDocument();
    });

    it('should generate QR code from text input', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const textTab = screen.getByRole('button', { name: /Text/i });
      await user.click(textTab);

      const textInput = screen.getByPlaceholderText(/Enter any text to generate QR code.../i);
      await user.type(textInput, 'Hello World');

      await waitFor(() => {
        const qrDataSection = screen.getByText(/QR Code Data:/i).parentElement;
        expect(qrDataSection).toHaveTextContent('Hello World');
      });
    });
  });

  describe('Contact Tab', () => {
    it('should switch to contact tab', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const contactTab = screen.getByRole('button', { name: /Contact/i });
      await user.click(contactTab);

      expect(contactTab).toHaveClass('text-purple-600');
      expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    });

    it('should generate vCard QR code from contact information', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const contactTab = screen.getByRole('button', { name: /Contact/i });
      await user.click(contactTab);

      const firstNameInput = screen.getByPlaceholderText('John');
      const lastNameInput = screen.getByPlaceholderText('Doe');
      const emailInput = screen.getByPlaceholderText('john.doe@example.com');

      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');

      await waitFor(() => {
        const qrDataSection = screen.getByText(/QR Code Data:/i).parentElement;
        expect(qrDataSection).toHaveTextContent('BEGIN:VCARD');
      });
    });

    it('should not generate QR when all contact fields are empty', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const contactTab = screen.getByRole('button', { name: /Contact/i });
      await user.click(contactTab);

      await waitFor(() => {
        expect(screen.getByText(/Fill in the form to generate your QR code/i)).toBeInTheDocument();
      });
    });
  });

  describe('Color Customization', () => {
    it('should display color inputs', () => {
      render(<QRCodeGenerator />);

      const colorInputs = screen.getAllByDisplayValue('#000000');
      expect(colorInputs.length).toBeGreaterThan(0);
    });

    it('should have both color picker and text input for foreground color', () => {
      render(<QRCodeGenerator />);

      const foregroundLabel = screen.getByText(/Foreground Color/i);
      const foregroundSection = foregroundLabel.parentElement;
      const colorPicker = foregroundSection?.querySelector('input[type="color"]') as HTMLInputElement;
      const textInput = foregroundSection?.querySelector('input[type="text"]') as HTMLInputElement;

      expect(colorPicker).toBeInTheDocument();
      expect(colorPicker.value).toBe('#000000');
      expect(textInput).toBeInTheDocument();
      expect(textInput.value).toBe('#000000');
    });
  });

  describe('Download Settings', () => {
    it('should display filename input with default value', () => {
      render(<QRCodeGenerator />);

      const filenameInput = screen.getByPlaceholderText('qr-code');
      expect(filenameInput).toHaveValue('qr-code');
    });

    it('should update custom filename', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const filenameInput = screen.getByPlaceholderText('qr-code');
      await user.clear(filenameInput);
      await user.type(filenameInput, 'my-custom-qr');

      expect(filenameInput).toHaveValue('my-custom-qr');
    });

    it('should toggle timestamp checkbox', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const timestampCheckbox = screen.getByLabelText(/Add timestamp/i);
      expect(timestampCheckbox).not.toBeChecked();

      await user.click(timestampCheckbox);

      expect(timestampCheckbox).toBeChecked();
    });

    it('should display timestamped filename preview when enabled', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const timestampCheckbox = screen.getByLabelText(/Add timestamp/i);
      await user.click(timestampCheckbox);

      await waitFor(() => {
        const label = screen.getByLabelText(/Add timestamp/i).parentElement;
        expect(label?.textContent).toMatch(/qr-code-\d{4}-\d{4}\.png/);
      });
    });
  });

  describe('Center Image', () => {
    it('should display center image upload input', () => {
      render(<QRCodeGenerator />);

      const centerImageHeading = screen.getByText(/Center Image/i);
      const section = centerImageHeading.parentElement;
      const fileInput = section?.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });
  });

  describe('Clear All Fields', () => {
    it('should reset form when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      // Enter some data
      const urlInput = screen.getByPlaceholderText(/example.com or https:\/\/example.com/i);
      await user.type(urlInput, 'example.com');

      await waitFor(() => {
        expect(screen.queryByText(/Fill in the form to generate your QR code/i)).not.toBeInTheDocument();
      });

      // Click clear button
      const clearButton = screen.getByRole('button', { name: /Clear All Fields/i });
      await user.click(clearButton);

      // Check that form is reset
      expect(urlInput).toHaveValue('');
      await waitFor(() => {
        expect(screen.getByText(/Fill in the form to generate your QR code/i)).toBeInTheDocument();
      });
    });
  });

  describe('Copy to Clipboard', () => {
    it('should show "Copied!" message after copying', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: writeTextMock,
        },
        writable: true,
        configurable: true,
      });

      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const urlInput = screen.getByPlaceholderText(/example.com or https:\/\/example.com/i);
      await user.type(urlInput, 'example.com');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Copy Data/i })).toBeInTheDocument();
      });

      const copyButton = screen.getByRole('button', { name: /Copy Data/i });
      await user.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
      });
    });

    it('should show copy image button and "Image Copied!" message after clicking', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/png' });
      const writeClipboardMock = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, 'clipboard', {
        value: {
          write: writeClipboardMock,
        },
        writable: true,
        configurable: true,
      });

      const user = userEvent.setup();
      render(<QRCodeGenerator />);

      const urlInput = screen.getByPlaceholderText(/example.com or https:\/\/example.com/i);
      await user.type(urlInput, 'example.com');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Copy Image/i })).toBeInTheDocument();
      });

      const copyImageButton = screen.getByRole('button', { name: /Copy Image/i });
      await user.click(copyImageButton);

      await waitFor(() => {
        expect(screen.getByText(/Image Copied!/i)).toBeInTheDocument();
      });
    });
  });

  describe('Footer', () => {
    it('should display footer text', () => {
      render(<QRCodeGenerator />);

      expect(
        screen.getByText(/Generate QR codes instantly • No data stored • Free to use/i)
      ).toBeInTheDocument();
    });
  });
});