# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QR Code Generator is a React-based web application built with TypeScript and Vite that generates customizable QR codes. The app supports multiple QR code types (URL, text, contact/vCard), color customization, center image overlays, clipboard operations (copy text data or PNG image), and custom filename downloads with multi-language support (English/Spanish). Includes comprehensive test suite with 63 passing tests.

## Key Commands

**Development:**
```bash
npm run dev          # Start dev server on http://localhost:3000 (auto-opens browser)
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
```

**Linting:**
```bash
npm run lint         # Run ESLint checks
npm run lint:fix     # Auto-fix ESLint issues
```

**Testing:**
```bash
npm test             # Run all tests once
npm run test:ui      # Run tests with interactive UI
npm run test:coverage # Generate coverage report
```

**Node version:** Project uses Volta with Node 20.19.5 and npm 11.6.1 (specified in package.json)

## Architecture

### Modular Architecture
The application follows a clean separation of concerns:

- **`src/QRCodeGenerator.tsx`** (~391 lines) - Presentation layer with UI components and layout
- **`src/hooks/useQRCodeGenerator.ts`** (~609 lines) - Business logic, state management, and QR generation
- **`src/lib/i18n.ts`** (~151 lines) - Internationalization system with locale detection and translation utilities
- **Testing files** - Comprehensive test suite with 63 tests
  - `src/QRCodeGenerator.test.tsx` - Integration tests
  - `src/hooks/useQRCodeGenerator.test.ts` - Hook unit tests
  - `src/lib/i18n.test.ts` - i18n utility tests
  - `src/test/setup.ts` - Test configuration and mocks

This modular design separates:
- **UI/Presentation** from business logic (component only handles rendering)
- **State management** in a custom hook (all useState, useEffect, useCallback logic)
- **Utilities** in dedicated modules (translation system with type-safe keys)

### QR Code Generation Strategy
The app uses a **dynamic script loading** approach with fallback mechanisms:

1. **Primary:** Dynamically loads QRious library (v4.0.2) from CDN on first use
2. **Canvas-based rendering:** QRious generates QR codes on HTML5 canvas for high-quality customization
3. **Center image overlay:** Custom canvas manipulation adds circular center images with high-quality rendering
4. **Fallback services:** If QRious fails, falls back to Google Charts API, then QR Server API

### Key Implementation Details

**Color Customization:**
- Dual input: color picker + hex text input (both use single source of truth)
- Hex validation with regex `/^#[0-9A-F]{6}$/i` before applying colors
- Applied directly to QRious library's `foreground` and `background` options
- Text input only updates state when complete valid hex is entered

**Center Image Processing:**
- File uploads converted to base64 data URLs via FileReader API
- Images rendered at 25% of canvas size (`CENTER_IMAGE_SIZE_RATIO`) with 8px padding circle (`CENTER_IMAGE_PADDING`)
- High-quality rendering: `imageSmoothingEnabled: true`, `imageSmoothingQuality: 'high'`
- Clipped to circular shape for professional appearance

**Download System:**
- Canvas-based QR: Uses `canvas.toBlob()` for high-quality PNG export
- Image-based fallback: Recreates on canvas to download
- Filename sanitization: Removes invalid characters with regex `/[^a-zA-Z0-9\-_\s]/g`
- Optional timestamp: Format `MMDD-HHMM` appended to filename

**Clipboard Operations:**
- **Copy Text Data:** Copies QR data (URL, text, or vCard) to clipboard using `navigator.clipboard.writeText()`
- **Copy Image:** Converts canvas/image to PNG blob and copies to clipboard using `navigator.clipboard.write()` with `ClipboardItem`
- Supports both canvas-based QR codes and fallback image sources
- Visual feedback with timeout (2 seconds) for both copy operations
- Independent state tracking: `copied` for text, `copiedImage` for image

**vCard Generation (Contact QR):**
- Generates vCard v3.0 format string
- Multi-line format with proper line breaks for vCard specification
- Only generates if at least one field is filled

**Multi-language System (src/lib/i18n.ts):**
- Translation object `TRANSLATIONS` with 'en-US' and 'es-ES'
- Type-safe translation keys via TypeScript
- Auto-detects browser locale via `navigator.languages`
- Template literal `{{APP_LOCALE}}` allows build-time locale override
- Fallback chain: app locale → browser locale → 'en-US'
- Exports `createTranslator()`, `resolveLocale()`, `findMatchingLocale()` utilities

### State Management Patterns (src/hooks/useQRCodeGenerator.ts)

All state is managed via a custom hook with React hooks (no external state library):
- **Form inputs:** `urlInput`, `textInput`, `contactInfo` (object)
- **Customization:** `foregroundColor`, `backgroundColor`, `centerImage`, `customFilename`, `addTimestamp`
- **UI state:** `activeTab`, `qrData`, `copied`, `copiedImage`
- **Refs:** `qrContainerRef` for DOM manipulation of QR container, `copyTimeoutRef` and `copyImageTimeoutRef` for clipboard feedback
- **Constants (lines 23-30):** `QR_CODE_SIZE`, `CENTER_IMAGE_SIZE_RATIO`, `CENTER_IMAGE_PADDING`, `CLIPBOARD_RESET_TIMEOUT`, etc.

**Critical useEffect (line ~545-548):** QR regenerates on changes to `[activeTab, urlInput, textInput, contactInfo, formatUrl, generateQRCode, generateVCard]`

**Hook Return Structure:** The hook returns 7 grouped objects instead of flat values for better organization:
- `tab` - Active tab state and setter
- `qr` - QR code data, container ref, clipboard state (copied, copiedImage), copy functions (copyToClipboard, copyImageToClipboard)
- `form` - All form input states and setters
- `colors` - Foreground/background colors with handlers (single source of truth)
- `centerImage` - Image state, file, upload handler, remove function
- `download` - Filename settings, timestamp options, download function
- `resetForm` - Top-level reset action

## Styling

- **Tailwind CSS** for all styling (configured in `tailwind.config.js`)
- Gradient design system: Purple (`from-purple-600`) to Blue (`to-blue-600`)
- Responsive grid: `lg:grid-cols-2` for form/preview layout
- Custom styles in `src/App.css` and `src/index.css` (minimal global styles)

## Common Development Scenarios

**Adding a new QR type:**
1. Add translation keys to `TRANSLATIONS` in `src/lib/i18n.ts`
2. Update `ActiveTab` type in `src/hooks/useQRCodeGenerator.ts` (line 5)
3. Add tab to `tabs` array in `src/QRCodeGenerator.tsx` (line 49-56)
4. Add case to switch statement in `useEffect` in `src/hooks/useQRCodeGenerator.ts` (line 458-479)
5. Add form UI in render section in `src/QRCodeGenerator.tsx` (lines 105-219)

**Modifying QR generation (src/hooks/useQRCodeGenerator.ts):**
- Edit `createQR()` function (line ~165-202) for QRious options
- Modify `addCenterImage()` (line ~88-137) for center image rendering
- Edit `generateFallbackQR()` (line ~139-163) for fallback behavior
- Edit `generateQRCode()` (line ~204-233) for library loading logic

**Changing download behavior (src/hooks/useQRCodeGenerator.ts):**
- Edit `downloadQRCode()` (line ~358-411) for main download logic
- Modify filename generation with `sanitizeFilename()` (line ~63-67) and `createTimestampedFilename()` (line ~69-77)
- Edit `downloadFromImage()` (line ~296-356) for fallback downloads

**Modifying clipboard behavior (src/hooks/useQRCodeGenerator.ts):**
- Edit `copyToClipboard()` (line ~413-430) for text data copying
- Edit `copyImageToClipboard()` (line ~432-495) for PNG image copying to clipboard
- Both functions use separate state (`copied`, `copiedImage`) and timeout refs

**Adding translations:**
- Add new keys to both `"en-US"` and `"es-ES"` objects in `src/lib/i18n.ts`
- TypeScript will enforce that all translation keys exist in both locales

## Important Constraints

- **No external QR libraries in package.json:** QRious is loaded dynamically from CDN
- **Browser-only:** No server-side rendering considerations
- **No data persistence:** Everything is client-side only, no backend

## Testing

The project has comprehensive test coverage with **Vitest** and **React Testing Library**:

- **Test Runner:** Vitest (v3.2.4)
- **Testing Libraries:** @testing-library/react, @testing-library/user-event, @testing-library/jest-dom
- **Test Environment:** jsdom (DOM simulation)
- **Coverage:** 63 tests across 3 test files

**Test Files:**
- `src/lib/i18n.test.ts` (16 tests) - Translation utilities, locale resolution, completeness validation
- `src/hooks/useQRCodeGenerator.test.ts` (24 tests) - Hook state management, QR generation, clipboard operations
- `src/QRCodeGenerator.test.tsx` (23 tests) - Component rendering, user interactions, integration flows

**Test Configuration:**
- `vitest.config.ts` - Vitest configuration with coverage settings
- `src/test/setup.ts` - Test setup with mocks for canvas, QRious, ClipboardItem, and clipboard API

**Running Tests:**
```bash
npm test              # Run all tests once
npm run test:ui       # Interactive test UI
npm run test:coverage # Generate coverage report
```

**Key Test Patterns:**
- Mock canvas operations and QR library loading
- Mock Clipboard API with `navigator.clipboard.write()` and `writeText()`
- Use `renderHook()` for testing custom hooks in isolation
- Use `userEvent` for simulating user interactions
- Use `waitFor()` for async state updates