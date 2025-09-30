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

### [1.3.0] - 2025-09-30

#### Added
- **Copy Image to Clipboard**: New button to copy QR code PNG directly to clipboard
  - Uses Clipboard API for modern browser compatibility
  - Supports both canvas and fallback image sources
  - Visual feedback with "Image Copied!" message
- **Comprehensive Testing**: Full test suite with Vitest and React Testing Library
  - 63 passing tests covering all major functionality
  - Unit tests for hooks and utilities
  - Integration tests for user interactions
  - Test scripts: `npm test`, `npm run test:ui`, `npm run test:coverage`

#### Improved
- **UI Layout**: Reorganized action buttons for better UX
  - Full-width Download button
  - Side-by-side Copy Data and Copy Image buttons
- **Translation System**: Added 2 new translation keys (copyImage, imageCopied) in English and Spanish

#### Technical
- Added ClipboardItem polyfill for testing
- Enhanced hook with `copiedImage` state and `copyImageToClipboard` function
- Updated component with Image icon from lucide-react
- Comprehensive test coverage for clipboard functionality

### [1.2.4] - 2025-09-29

#### Improved
- **Code Quality**: Refactored codebase for better maintainability
  - Extracted magic numbers to named constants (`QR_CODE_SIZE`, `CENTER_IMAGE_SIZE_RATIO`, etc.)
  - Removed redundant color state (consolidated from 4 states to 2)
  - Reorganized hook return structure from 31 flat values to 7 logical groups
- **Internationalization**: Moved all hard-coded UI strings to translation system
  - Added 13 new translation keys for customization section
  - Full Spanish translation coverage
- **Documentation**: Updated CLAUDE.md to reflect modular architecture
  - Accurate line counts and file structure
  - Detailed hook return structure documentation

#### Technical
- Reduced component complexity (416 → 372 lines)
- Improved type safety with grouped return values
- Better separation of concerns between presentation and business logic
- Bundle size reduced by ~240 bytes

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
