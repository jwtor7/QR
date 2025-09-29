/**
 * QR Code Generator Application
 * 
 * A comprehensive React-based QR code generator with customization features
 * including color customization, center images, and multiple input types.
 * 
 * Features:
 * - URL, Text, and Contact QR code generation
 * - Custom foreground and background colors
 * - Center image overlay with high-quality rendering
 * - Custom filename downloads
 * - Multi-language support
 * - Responsive design with modern UI
 * 
 * @author Junior Williams
 * @version 1.23
 * @created 2025
 */

import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Link, MessageSquare, User, Download, Copy, Check } from 'lucide-react';

/**
 * Translation object for multi-language support
 * Currently supports English (en-US) and Spanish (es-ES)
 */
const TRANSLATIONS = {
  "en-US": {
    "appTitle": "QR Code Generator",
    "appDescription": "Generate QR codes for URLs, text, and contact information",
    "urlTab": "URL",
    "textTab": "Text",
    "contactTab": "Contact",
    "enterUrl": "Enter URL",
    "enterText": "Enter Text",
    "contactInformation": "Contact Information",
    "websiteUrl": "Website URL",
    "urlPlaceholder": "example.com or https://example.com",
    "urlHelp": "Enter a website URL. If you don't include http://, we'll add https:// automatically.",
    "textContent": "Text Content",
    "textPlaceholder": "Enter any text to generate QR code...",
    "firstName": "First Name",
    "firstNamePlaceholder": "John",
    "lastName": "Last Name",
    "lastNamePlaceholder": "Doe",
    "phoneNumber": "Phone Number",
    "phonePlaceholder": "+1 (555) 123-4567",
    "emailAddress": "Email Address",
    "emailPlaceholder": "john.doe@example.com",
    "organization": "Organization",
    "organizationPlaceholder": "Company Name",
    "website": "Website",
    "websitePlaceholder": "https://example.com",
    "clearAllFields": "Clear All Fields",
    "generatedQrCode": "Generated QR Code",
    "scanQrCode": "Scan this QR code with your device",
    "fillFormPrompt": "Fill in the form to generate your QR code",
    "download": "Download",
    "copyData": "Copy Data",
    "copied": "Copied!",
    "qrCodeData": "QR Code Data:",
    "footerText": "Generate QR codes instantly • No data stored • Free to use",
    "qrCodeAlt": "Generated QR Code"
  },
  "es-ES": {
    "appTitle": "Generador de Códigos QR",
    "appDescription": "Genera códigos QR para URLs, texto e información de contacto",
    "urlTab": "URL",
    "textTab": "Texto",
    "contactTab": "Contacto",
    "enterUrl": "Ingresa URL",
    "enterText": "Ingresa Texto",
    "contactInformation": "Información de Contacto",
    "websiteUrl": "URL del Sitio Web",
    "urlPlaceholder": "ejemplo.com o https://ejemplo.com",
    "urlHelp": "Ingresa una URL de sitio web. Si no incluyes http://, agregaremos https:// automáticamente.",
    "textContent": "Contenido de Texto",
    "textPlaceholder": "Ingresa cualquier texto para generar código QR...",
    "firstName": "Nombre",
    "firstNamePlaceholder": "Juan",
    "lastName": "Apellido",
    "lastNamePlaceholder": "Pérez",
    "phoneNumber": "Número de Teléfono",
    "phonePlaceholder": "+1 (555) 123-4567",
    "emailAddress": "Dirección de Correo",
    "emailPlaceholder": "juan.perez@ejemplo.com",
    "organization": "Organización",
    "organizationPlaceholder": "Nombre de la Empresa",
    "website": "Sitio Web",
    "websitePlaceholder": "https://ejemplo.com",
    "clearAllFields": "Limpiar Todos los Campos",
    "generatedQrCode": "Código QR Generado",
    "scanQrCode": "Escanea este código QR con tu dispositivo",
    "fillFormPrompt": "Completa el formulario para generar tu código QR",
    "download": "Descargar",
    "copyData": "Copiar Datos",
    "copied": "¡Copiado!",
    "qrCodeData": "Datos del Código QR:",
    "footerText": "Genera códigos QR al instante • No se almacenan datos • Gratis",
    "qrCodeAlt": "Código QR Generado"
  }
};

/**
 * Determines the appropriate locale for the application
 * Falls back to en-US if no matching locale is found
 */
const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

/**
 * Main QR Code Generator Component
 * 
 * This component provides a complete QR code generation interface with support for:
 * - Multiple input types (URL, Text, Contact)
 * - Color customization
 * - Center image overlay
 * - Custom filename downloads
 * 
 * @author Junior Williams
 */
const QRCodeGenerator = () => {
  // =============================================
  // STATE MANAGEMENT
  // =============================================
  
  /** Active tab state for switching between input types */
  const [activeTab, setActiveTab] = useState('url');
  
  /** Generated QR code data string */
  const [qrData, setQrData] = useState('');
  
  /** Copy to clipboard feedback state */
  const [copied, setCopied] = useState(false);
  
  /** Reference to QR code container DOM element */
  const qrContainerRef = useRef(null);
  
  // Color and image customization states
  /** Foreground color for QR code pattern */
  const [foregroundColor, setForegroundColor] = useState('#000000');
  
  /** Background color for QR code */
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  
  /** Hex input value for foreground color */
  const [foregroundHex, setForegroundHex] = useState('#000000');
  
  /** Hex input value for background color */
  const [backgroundHex, setBackgroundHex] = useState('#ffffff');
  
  /** Base64 data URL of center image */
  const [centerImage, setCenterImage] = useState(null);
  
  /** File object of uploaded center image */
  const [centerImageFile, setCenterImageFile] = useState(null);
  
  /** Custom filename for downloads */
  const [customFilename, setCustomFilename] = useState('qr-code');
  
  /** Whether to add timestamp to filename */
  const [addTimestamp, setAddTimestamp] = useState(false);
  
  // Form states for different input types
  /** URL input value */
  const [urlInput, setUrlInput] = useState('');
  
  /** Text input value */
  const [textInput, setTextInput] = useState('');
  
  /** Contact information object */
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  });

  // =============================================
  // QR CODE GENERATION FUNCTIONS
  // =============================================

  /**
   * Main QR code generation function
   * Loads QRious library dynamically and generates QR code
   * 
   * @param {string} text - The text/data to encode in the QR code
   */
  const generateQRCode = async (text) => {
    // Clear container if no text provided
    if (!text.trim()) {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = '';
      }
      return;
    }

    try {
      // Load QRious library dynamically if not already loaded
      if (!window.QRious) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
        script.onload = () => {
          createQR(text);
        };
        document.head.appendChild(script);
      } else {
        createQR(text);
      }
    } catch (error) {
      console.error('Error loading QR library:', error);
      // Fallback to external QR generation services
      generateFallbackQR(text);
    }
  };

  /**
   * Creates QR code using QRious library with custom styling
   * 
   * @param {string} text - The text to encode
   */
  const createQR = async (text) => {
    if (!qrContainerRef.current) return;
    
    try {
      // Clear previous QR code
      qrContainerRef.current.innerHTML = '';
      
      // Create canvas element for QR code
      const canvas = document.createElement('canvas');
      qrContainerRef.current.appendChild(canvas);
      
      // Generate QR code with custom colors
      const qr = new window.QRious({
        element: canvas,
        value: text,
        size: 300,
        background: backgroundColor,
        foreground: foregroundColor,
        level: 'M' // Medium error correction level
      });
      
      // Add center image overlay if provided
      if (centerImage) {
        await addCenterImage(canvas);
      }
      
      // Apply styling to canvas
      canvas.className = 'w-full h-auto rounded-xl shadow-lg';
      canvas.style.maxWidth = '300px';
      canvas.style.height = 'auto';
      canvas.style.backgroundColor = backgroundColor;
      
    } catch (error) {
      console.error('Error creating QR code:', error);
      generateFallbackQR(text);
    }
  };

  /**
   * Adds a center image overlay to the QR code canvas with high quality rendering
   * 
   * @param {HTMLCanvasElement} canvas - The QR code canvas element
   * @returns {Promise} Promise that resolves when image is added
   */
  const addCenterImage = (canvas) => {
    return new Promise((resolve) => {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const canvas_size = canvas.width;
        const img_size = canvas_size * 0.25; // 25% of canvas size for optimal visibility
        const x = (canvas_size - img_size) / 2;
        const y = (canvas_size - img_size) / 2;
        
        // Enable high-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Create background circle with padding for better contrast
        ctx.fillStyle = backgroundColor;
        ctx.beginPath();
        ctx.arc(canvas_size / 2, canvas_size / 2, img_size / 2 + 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add subtle border around image area
        ctx.strokeStyle = backgroundColor === '#ffffff' ? '#f0f0f0' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvas_size / 2, canvas_size / 2, img_size / 2 + 6, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Clip image to circular shape and draw with high quality
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas_size / 2, canvas_size / 2, img_size / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, img_size, img_size);
        ctx.restore();
        
        resolve();
      };
      
      img.src = centerImage;
    });
  };

  /**
   * Fallback QR code generation using external services
   * Used when QRious library fails to load
   * 
   * @param {string} text - The text to encode
   */
  const generateFallbackQR = (text) => {
    if (!qrContainerRef.current) return;
    
    // Clear previous content
    qrContainerRef.current.innerHTML = '';
    
    // Create img element for external QR generation
    const img = document.createElement('img');
    const encodedData = encodeURIComponent(text);
    
    // Try Google Charts API first
    img.src = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodedData}&choe=UTF-8`;
    img.alt = t('qrCodeAlt');
    img.className = 'w-full h-auto rounded-xl shadow-lg bg-white p-4';
    img.style.maxWidth = '300px';
    img.style.height = 'auto';
    
    // Fallback to QR Server API if Google Charts fails
    img.onerror = () => {
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}&format=png&margin=10`;
    };
    
    qrContainerRef.current.appendChild(img);
  };

  // =============================================
  // EVENT HANDLERS AND UTILITY FUNCTIONS
  // =============================================

  /**
   * Handles center image file upload
   * Converts file to base64 data URL for canvas rendering
   * 
   * @param {Event} event - File input change event
   */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCenterImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCenterImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handles foreground color hex input with validation
   * 
   * @param {Event} e - Input change event
   */
  const handleForegroundHexChange = (e) => {
    const hex = e.target.value;
    setForegroundHex(hex);
    // Validate hex format before applying
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setForegroundColor(hex);
    }
  };

  /**
   * Handles background color hex input with validation
   * 
   * @param {Event} e - Input change event
   */
  const handleBackgroundHexChange = (e) => {
    const hex = e.target.value;
    setBackgroundHex(hex);
    // Validate hex format before applying
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setBackgroundColor(hex);
    }
  };

  /**
   * Removes the center image from QR code
   */
  const removeCenterImage = () => {
    setCenterImage(null);
    setCenterImageFile(null);
  };

  /**
   * Formats URL input by adding https:// protocol if missing
   * 
   * @param {string} url - Raw URL input
   * @returns {string} Formatted URL with protocol
   */
  const formatUrl = (url) => {
    if (!url.trim()) return '';
    
    // Add https:// protocol if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  /**
   * Generates vCard format string for contact information
   * 
   * @param {Object} contact - Contact information object
   * @returns {string} vCard formatted string
   */
  const generateVCard = (contact) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.url}
END:VCARD`;
    return vcard;
  };

  /**
   * Main effect hook for QR code generation
   * Triggers whenever input data or customization options change
   */
  useEffect(() => {
    let data = '';
    
    // Generate appropriate data based on active tab
    switch (activeTab) {
      case 'url':
        data = formatUrl(urlInput);
        break;
      case 'text':
        data = textInput;
        break;
      case 'contact':
        // Only generate vCard if at least one field is filled
        if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
          data = generateVCard(contactInfo);
        }
        break;
      default:
        data = '';
    }
    
    setQrData(data);
    generateQRCode(data);
  }, [activeTab, urlInput, textInput, contactInfo, foregroundColor, backgroundColor, centerImage]);

  // =============================================
  // DOWNLOAD AND CLIPBOARD FUNCTIONS
  // =============================================

  /**
   * Downloads the generated QR code as a PNG file
   * Supports both canvas and image elements with high quality output
   */
  const downloadQRCode = async () => {
    if (!qrData) return;
    
    const canvas = qrContainerRef.current?.querySelector('canvas');
    const img = qrContainerRef.current?.querySelector('img');
    
    // Clean filename by removing invalid characters
    const cleanFilename = (customFilename || 'qr-code')
      .replace(/[^a-zA-Z0-9\-_\s]/g, '') // Remove invalid filename characters
      .trim() || 'qr-code'; // Fallback if empty after cleaning
    
    // Add timestamp if requested (format: MMDD-HHMM)
    let filename = cleanFilename;
    if (addTimestamp) {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      filename = `${cleanFilename}-${month}${day}-${hours}${minutes}`;
    }
    filename = `${filename}.png`;
    
    try {
      if (canvas) {
        // Download from canvas with high quality blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png', 1.0);
      } else if (img) {
        // For external images, recreate on canvas for download
        await downloadFromImage(img, filename);
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: try direct canvas download
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
  };

  /**
   * Downloads QR code from external image source by recreating on canvas
   * 
   * @param {HTMLImageElement} imgElement - The image element to download
   * @param {string} filename - The filename for download
   * @returns {Promise} Promise that resolves when download completes
   */
  const downloadFromImage = (imgElement, filename) => {
    return new Promise((resolve, reject) => {
      try {
        // Create new canvas for download
        const downloadCanvas = document.createElement('canvas');
        const ctx = downloadCanvas.getContext('2d');
        
        // Set canvas size
        downloadCanvas.width = 300;
        downloadCanvas.height = 300;
        
        // Create new image to avoid CORS issues
        const newImg = new Image();
        newImg.crossOrigin = 'anonymous';
        
        newImg.onload = () => {
          try {
            // Fill with white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 300, 300);
            
            // Draw the QR code image
            ctx.drawImage(newImg, 0, 0, 300, 300);
            
            // Download as PNG blob
            downloadCanvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = filename;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                resolve();
              } else {
                reject(new Error('Failed to create blob'));
              }
            }, 'image/png', 1.0);
          } catch (error) {
            reject(error);
          }
        };
        
        // Fallback for CORS issues
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
  };

  /**
   * Copies QR code data to clipboard
   */
  const copyToClipboard = async () => {
    if (qrData) {
      try {
        await navigator.clipboard.writeText(qrData);
        setCopied(true);
        // Reset feedback after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  /**
   * Resets all form fields and customization options to default values
   */
  const resetForm = () => {
    // Reset input fields
    setUrlInput('');
    setTextInput('');
    setContactInfo({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      organization: '',
      url: ''
    });
    
    // Reset customization options
    setForegroundColor('#000000');
    setBackgroundColor('#ffffff');
    setForegroundHex('#000000');
    setBackgroundHex('#ffffff');
    setCenterImage(null);
    setCenterImageFile(null);
    setCustomFilename('qr-code');
    setAddTimestamp(false);
    
    // Clear generated data and display
    setQrData('');
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
    }
  };

  // =============================================
  // UI CONFIGURATION
  // =============================================

  /** Tab configuration for navigation */
  const tabs = [
    { id: 'url', label: t('urlTab'), icon: Link },
    { id: 'text', label: t('textTab'), icon: MessageSquare },
    { id: 'contact', label: t('contactTab'), icon: User }
  ];

  // =============================================
  // RENDER COMPONENT
  // =============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {t('appTitle')}
          </h1>
          <p className="text-gray-600 text-lg">{t('appDescription')}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {activeTab === 'url' && t('enterUrl')}
                  {activeTab === 'text' && t('enterText')}
                  {activeTab === 'contact' && t('contactInformation')}
                </h2>

                {/* URL Input Form */}
                {activeTab === 'url' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('websiteUrl')}
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={t('urlPlaceholder')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('urlHelp')}
                    </p>
                  </div>
                )}

                {/* Text Input Form */}
                {activeTab === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('textContent')}
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t('textPlaceholder')}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                )}

                {/* Contact Input Form */}
                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('firstName')}
                        </label>
                        <input
                          type="text"
                          value={contactInfo.firstName}
                          onChange={(e) => setContactInfo({...contactInfo, firstName: e.target.value})}
                          placeholder={t('firstNamePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('lastName')}
                        </label>
                        <input
                          type="text"
                          value={contactInfo.lastName}
                          onChange={(e) => setContactInfo({...contactInfo, lastName: e.target.value})}
                          placeholder={t('lastNamePlaceholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        placeholder={t('phonePlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('emailAddress')}
                      </label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        placeholder={t('emailPlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    {/* Organization Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('organization')}
                      </label>
                      <input
                        type="text"
                        value={contactInfo.organization}
                        onChange={(e) => setContactInfo({...contactInfo, organization: e.target.value})}
                        placeholder={t('organizationPlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    {/* Website Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('website')}
                      </label>
                      <input
                        type="url"
                        value={contactInfo.url}
                        onChange={(e) => setContactInfo({...contactInfo, url: e.target.value})}
                        placeholder={t('websitePlaceholder')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

                {/* Customization Section */}
                <div className="border-t border-gray-200 pt-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">QR Code Customization</h3>
                  
                  {/* Color Customization */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Colors</h4>
                    
                    {/* Foreground Color Controls */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Foreground Color (QR Pattern)
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={foregroundColor}
                          onChange={(e) => {
                            setForegroundColor(e.target.value);
                            setForegroundHex(e.target.value);
                          }}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={foregroundHex}
                          onChange={handleForegroundHexChange}
                          placeholder="#000000"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                          maxLength={7}
                        />
                      </div>
                    </div>
                    
                    {/* Background Color Controls */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        Background Color
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => {
                            setBackgroundColor(e.target.value);
                            setBackgroundHex(e.target.value);
                          }}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundHex}
                          onChange={handleBackgroundHexChange}
                          placeholder="#ffffff"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Filename Customization */}
                  <div className="space-y-3">
                    <h4 className="text-md font-medium text-gray-700">Download Settings</h4>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-600">
                        File Name
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customFilename}
                          onChange={(e) => setCustomFilename(e.target.value)}
                          placeholder="qr-code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          maxLength={50}
                        />
                        <span className="text-sm text-gray-500 font-mono">.png</span>
                      </div>
                      
                      {/* Timestamp Option */}
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="addTimestamp"
                          checked={addTimestamp}
                          onChange={(e) => setAddTimestamp(e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="addTimestamp" className="text-sm text-gray-600">
                          Add timestamp ({addTimestamp ? 
                            `${customFilename || 'qr-code'}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(new Date().getHours()).padStart(2, '0')}${String(new Date().getMinutes()).padStart(2, '0')}.png` : 
                            `${customFilename || 'qr-code'}.png`})
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        {addTimestamp ? 
                          'Timestamp format: MMDD-HHMM (month, day, hour, minute)' :
                          'Enter a custom name for your downloaded QR code. Special characters will be removed automatically.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Center Image Upload */}
                  <div className="space-y-3">
                    <h4 className="text-md font-medium text-gray-700">Center Image</h4>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      
                      {/* Image Preview */}
                      {centerImage && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={centerImage} 
                            alt="Center preview" 
                            className="w-10 h-10 object-cover rounded border"
                          />
                          <span className="text-sm text-gray-600 flex-1">
                            {centerImageFile?.name || 'Center image'}
                          </span>
                          <button
                            onClick={removeCenterImage}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Upload a small logo or image to display in the center of your QR code. 
                        Keep it simple for better scannability.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetForm}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  {t('clearAllFields')}
                </button>
              </div>

              {/* QR Code Display Section */}
              <div className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">{t('generatedQrCode')}</h2>
                
                {/* QR Code Container */}
                <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-sm">
                  {qrData ? (
                    <div className="text-center">
                      <div ref={qrContainerRef} className="flex justify-center">
                        {/* QR code will be dynamically inserted here */}
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        {t('scanQrCode')}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {t('fillFormPrompt')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {qrData && (
                  <div className="flex gap-4 w-full max-w-sm">
                    <button
                      onClick={downloadQRCode}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      {t('download')}
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          {t('copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {t('copyData')}
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Data Preview */}
                {qrData && (
                  <div className="w-full max-w-sm">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{t('qrCodeData')}</h3>
                    <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-words">{qrData}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>{t('footerText')}</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;