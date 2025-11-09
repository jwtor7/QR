# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2025-11-05

### Fixed
- **Static HTML QR Code Scannability**: Fixed QR codes in `qr-generator-static.html` not being scannable when displayed on screen
  - **Root cause**: QR codes were generated at 300x300px but CSS scaling made them too small to scan on screen
  - **Fix**: Increased QR code size from 300x300px to 400x400px for better on-screen scannability
  - Downloaded PNGs are now 400x400px (previously 300x300px) with improved scan reliability
- **Center Image QR Codes**: Fixed QR codes with center images failing to scan even after download
  - Increased error correction level from 'M' (Medium) to 'H' (High) when center image is present
  - Reduced center image size ratio from 25% to 20% for better pattern preservation
  - Higher error correction now ensures QR codes remain functional with logo overlays

### Technical Details
- Changed `QR_CODE_SIZE` constant from 300 to 400 pixels
- Changed `CENTER_IMAGE_SIZE_RATIO` constant from 0.25 to 0.20
- Updated CSS `max-width` from 300px to 400px to match new QR code size
- Implemented dynamic error correction level selection based on center image presence
- QR codes without center images use 'M' level (balanced, ~15% error correction)
- QR codes with center images use 'H' level (maximum error correction ~30%)

## [1.3.0] - 2025-11-05

### Added
- **Standalone Static HTML Version**: Created `qr-generator-static.html` - a complete single-file implementation
  - Zero dependencies (except QRious CDN)
  - All features from React version: URL, Text, Contact/vCard QR codes
  - Color customization with dual color picker and hex input validation
  - Center image overlay with circular clipping and high-quality rendering
  - Custom filename downloads with optional MMDD-HHMM timestamps
  - Clipboard operations: copy text data and PNG image
  - Multi-language support (English/Spanish) with automatic browser locale detection
  - Responsive design matching original UI/UX
  - Can be opened directly in any modern browser without build tools or dev server
  - Perfect for offline use, distribution, or simple hosting scenarios

### Benefits
- No installation or build process required
- Works on any static file server or local filesystem
- Ideal for sharing or embedding in other projects
- Complete feature parity with React SPA version

## [1.2.4] - 2024-11-04

### Previous Release
- Base version with React/TypeScript implementation
- Comprehensive test suite (63 passing tests)
- Multi-language support (English/Spanish)
- All core QR generation features
