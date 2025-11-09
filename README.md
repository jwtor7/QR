# QR Code Generator

🎯 A comprehensive React-based QR code generator with advanced customization features.

## ✨ Features

- 🔗 **Multiple QR Types**: URL, Text, and Contact (vCard) generation
- 🎨 **Color Customization**: Custom foreground and background colors with hex input
- 🖼️ **Center Image Overlay**: Add logos or images to the center of your QR codes
- 📱 **Multi-language Support**: English and Spanish translations
- 📥 **Custom Downloads**: Custom filenames with optional timestamps
- 📋 **Clipboard Support**: Copy QR data as text or PNG image to clipboard
- 🎯 **High-Quality Output**: Canvas-based generation with fallback options
- 📱 **Responsive Design**: Modern UI built with Tailwind CSS
- ⚡ **Fast Development**: Built with Vite and TypeScript
- ✅ **Fully Tested**: Comprehensive test suite with 63 passing tests

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jwtor7/QR.git
cd QR

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🛠️ Technology Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **QRious** - QR Code Generation

## 📖 Usage

### URL QR Codes
1. Select the URL tab
2. Enter a website URL (protocol will be added automatically)
3. Customize colors and add center image if desired
4. Download your QR code

### Text QR Codes
1. Select the Text tab
2. Enter any text content
3. Apply customizations
4. Download the generated QR code

### Contact QR Codes (vCard)
1. Select the Contact tab
2. Fill in contact information fields
3. The app generates a vCard format QR code
4. Share contact details easily

### Customization Options

- **Colors**: Use color pickers or hex input for precise control
- **Center Images**: Upload PNG/JPG images for branding
- **Filenames**: Set custom download names with optional timestamps
- **Languages**: Toggle between English and Spanish

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run test suite
- `npm run test:ui` - Run tests with interactive UI
- `npm run test:coverage` - Generate test coverage report

### Project Structure

```
src/
├── QRCodeGenerator.tsx         # Main component (presentation layer)
├── QRCodeGenerator.test.tsx    # Integration tests for main component
├── hooks/
│   ├── useQRCodeGenerator.ts   # Custom hook (business logic & state)
│   └── useQRCodeGenerator.test.ts  # Unit tests for hook
├── lib/
│   ├── i18n.ts                 # Internationalization system
│   └── i18n.test.ts           # Unit tests for i18n
├── test/
│   └── setup.ts               # Test configuration and mocks
├── App.tsx                    # App wrapper
├── main.tsx                  # Entry point
├── index.css                 # Global styles
└── App.css                   # Component styles
```

### Testing

The project includes comprehensive test coverage with Vitest and React Testing Library:

- **Unit Tests**: Test individual functions and hooks in isolation
- **Integration Tests**: Test component interactions and user flows
- **Coverage**: 63 tests covering critical functionality

Run tests with `npm test` or use `npm run test:ui` for an interactive testing experience.

## 📋 Changelog

### [1.3.1] - 2025-11-05

#### Fixed
- **Static HTML QR Code Scannability**: Fixed QR codes in `qr-generator-static.html` not being scannable when displayed on screen
  - **Root cause**: QR codes were generated at 300x300px but CSS scaling made them too small to scan on screen
  - **Fix**: Increased QR code size from 300x300px to 400x400px for better on-screen scannability
  - Downloaded PNGs are now 400x400px (previously 300x300px) with improved scan reliability
- **Center Image QR Codes**: Fixed QR codes with center images failing to scan even after download
  - Increased error correction level from 'M' (Medium) to 'H' (High) when center image is present
  - Reduced center image size ratio from 25% to 20% for better pattern preservation
  - Higher error correction now ensures QR codes remain functional with logo overlays

#### Technical Details
- Changed `QR_CODE_SIZE` constant from 300 to 400 pixels
- Changed `CENTER_IMAGE_SIZE_RATIO` constant from 0.25 to 0.20
- Updated CSS `max-width` from 300px to 400px to match new QR code size
- Implemented dynamic error correction level selection based on center image presence
- QR codes without center images use 'M' level (balanced, ~15% error correction)
- QR codes with center images use 'H' level (maximum error correction ~30%)

### [1.3.0] - 2025-11-05

#### Added
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

#### Benefits
- No installation or build process required
- Works on any static file server or local filesystem
- Ideal for sharing or embedding in other projects
- Complete feature parity with React SPA version

#### Previous Features
- **Copy Image to Clipboard**: Copy QR code PNG directly to clipboard
  - Uses Clipboard API for modern browser compatibility
  - Supports both canvas and fallback image sources
  - Visual feedback with "Image Copied!" message
- **Comprehensive Testing**: Full test suite with Vitest and React Testing Library
  - 63 passing tests covering all major functionality
  - Unit tests for hooks and utilities
  - Integration tests for user interactions

### [1.2.4] - 2024-11-04

#### Improved
- **Code Quality**: Refactored codebase for better maintainability
  - Extracted magic numbers to named constants (`QR_CODE_SIZE`, `CENTER_IMAGE_SIZE_RATIO`, etc.)
  - Removed redundant color state (consolidated from 4 states to 2)
  - Reorganized hook return structure from 31 flat values to 7 logical groups
- **Internationalization**: Moved all hard-coded UI strings to translation system
  - Added 13 new translation keys for customization section
  - Full Spanish translation coverage
- **Documentation**: Updated CLAUDE.md to reflect modular architecture

#### Technical
- Reduced component complexity (416 → 372 lines)
- Improved type safety with grouped return values
- Better separation of concerns between presentation and business logic

## 🌐 Deployment

This project can be deployed to:

- **Vercel**: `npm run build` and deploy the `dist` folder
- **Netlify**: Connect your repo and set build command to `npm run build`
- **GitHub Pages**: Use GitHub Actions with the build artifacts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Junior Williams** - [GitHub](https://github.com/jwtor7)

---

⭐ Star this repository if you find it helpful!
