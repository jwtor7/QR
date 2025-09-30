export const TRANSLATIONS = {
  "en-US": {
    appTitle: "QR Code Generator",
    appDescription: "Generate QR codes for URLs, text, and contact information",
    urlTab: "URL",
    textTab: "Text",
    contactTab: "Contact",
    enterUrl: "Enter URL",
    enterText: "Enter Text",
    contactInformation: "Contact Information",
    websiteUrl: "Website URL",
    urlPlaceholder: "example.com or https://example.com",
    urlHelp: "Enter a website URL. If you don't include http://, we'll add https:// automatically.",
    textContent: "Text Content",
    textPlaceholder: "Enter any text to generate QR code...",
    firstName: "First Name",
    firstNamePlaceholder: "John",
    lastName: "Last Name",
    lastNamePlaceholder: "Doe",
    phoneNumber: "Phone Number",
    phonePlaceholder: "+1 (555) 123-4567",
    emailAddress: "Email Address",
    emailPlaceholder: "john.doe@example.com",
    organization: "Organization",
    organizationPlaceholder: "Company Name",
    website: "Website",
    websitePlaceholder: "https://example.com",
    clearAllFields: "Clear All Fields",
    generatedQrCode: "Generated QR Code",
    scanQrCode: "Scan this QR code with your device",
    fillFormPrompt: "Fill in the form to generate your QR code",
    download: "Download",
    copyData: "Copy Data",
    copied: "Copied!",
    qrCodeData: "QR Code Data:",
    footerText: "Generate QR codes instantly • No data stored • Free to use",
    qrCodeAlt: "Generated QR Code"
  },
  "es-ES": {
    appTitle: "Generador de Códigos QR",
    appDescription: "Genera códigos QR para URLs, texto e información de contacto",
    urlTab: "URL",
    textTab: "Texto",
    contactTab: "Contacto",
    enterUrl: "Ingresa URL",
    enterText: "Ingresa Texto",
    contactInformation: "Información de Contacto",
    websiteUrl: "URL del Sitio Web",
    urlPlaceholder: "ejemplo.com o https://ejemplo.com",
    urlHelp: "Ingresa una URL de sitio web. Si no incluyes http://, agregaremos https:// automáticamente.",
    textContent: "Contenido de Texto",
    textPlaceholder: "Ingresa cualquier texto para generar código QR...",
    firstName: "Nombre",
    firstNamePlaceholder: "Juan",
    lastName: "Apellido",
    lastNamePlaceholder: "Pérez",
    phoneNumber: "Número de Teléfono",
    phonePlaceholder: "+1 (555) 123-4567",
    emailAddress: "Dirección de Correo",
    emailPlaceholder: "juan.perez@ejemplo.com",
    organization: "Organización",
    organizationPlaceholder: "Nombre de la Empresa",
    website: "Sitio Web",
    websitePlaceholder: "https://ejemplo.com",
    clearAllFields: "Limpiar Todos los Campos",
    generatedQrCode: "Código QR Generado",
    scanQrCode: "Escanea este código QR con tu dispositivo",
    fillFormPrompt: "Completa el formulario para generar tu código QR",
    download: "Descargar",
    copyData: "Copiar Datos",
    copied: "¡Copiado!",
    qrCodeData: "Datos del Código QR:",
    footerText: "Genera códigos QR al instante • No se almacenan datos • Gratis",
    qrCodeAlt: "Código QR Generado"
  }
} as const;

export type LocaleKey = keyof typeof TRANSLATIONS;
export type TranslationKey = keyof (typeof TRANSLATIONS)[LocaleKey];
export type Translator = (key: TranslationKey) => string;

export const DEFAULT_LOCALE: LocaleKey = "en-US";

export const findMatchingLocale = (locale: string): LocaleKey => {
  if (TRANSLATIONS[locale as LocaleKey]) {
    return locale as LocaleKey;
  }

  const language = locale.split("-")[0];
  const match = (Object.keys(TRANSLATIONS) as LocaleKey[]).find((key) => key.startsWith(`${language}-`));

  return match || DEFAULT_LOCALE;
};

export const resolveLocale = (appLocale: string): LocaleKey => {
  if (appLocale && appLocale !== "{{APP_LOCALE}}") {
    return findMatchingLocale(appLocale);
  }

  if (typeof navigator !== "undefined") {
    const browserLocale = navigator.languages?.[0] || navigator.language;
    if (browserLocale) {
      return findMatchingLocale(browserLocale);
    }
  }

  return DEFAULT_LOCALE;
};

export const createTranslator = (locale: string) => {
  const matchedLocale = findMatchingLocale(locale);

  const translate: Translator = (key) => {
    const localeTranslations = TRANSLATIONS[matchedLocale];
    return localeTranslations[key] ?? TRANSLATIONS[DEFAULT_LOCALE][key] ?? key;
  };

  return { locale: matchedLocale, t: translate };
};
