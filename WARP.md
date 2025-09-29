# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

QR Code Generator is a comprehensive React-based web application for generating customizable QR codes. The app supports multiple input types (URL, text, and contact information) with extensive customization options including colors, center images, and custom filenames.

## Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom gradients and responsive design
- **Icons**: Lucide React for consistent iconography
- **QR Generation**: QRious library (loaded dynamically) with fallback to external APIs

### Key Components
- **QRCodeGenerator.tsx**: Main component containing all QR generation logic, form handling, and UI
- **App.tsx**: Minimal wrapper component
- **main.tsx**: React application entry point

### Application Structure
```
src/
├── QRCodeGenerator.tsx  # Core component (~1000+ lines)
├── App.tsx             # App wrapper
├── main.tsx           # Entry point
├── index.css          # Global Tailwind styles
└── App.css            # Component-specific styles
```

### Core Features Architecture
1. **Multi-Type Input Handling**: Tab-based interface for URL, text, and vCard contact generation
2. **Dynamic QR Generation**: Uses QRious library with canvas-based rendering and external service fallbacks
3. **Customization System**: Real-time color picker integration with hex input validation
4. **Image Overlay**: Canvas-based center image rendering with high-quality scaling and circular masking
5. **Download System**: Blob-based downloads with custom filename support and timestamp options
6. **Internationalization**: Built-in multi-language support (English/Spanish) with browser locale detection

## Development Commands

### Package Management
Use `uv pip install` instead of `npm install` when working with Python dependencies (though this project uses Node.js).

### Core Development
```bash
# Install dependencies
npm install

# Start development server (runs on port 3000, opens automatically)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

### Development Server Configuration
- **Port**: 3000 (configured in vite.config.ts)
- **Auto-open**: Enabled
- **Build output**: `dist/` directory
- **Source maps**: Enabled in production builds

## Code Architecture Details

### State Management Pattern
The application uses React hooks for state management with clearly separated concerns:
- **Form states**: `urlInput`, `textInput`, `contactInfo`
- **Customization states**: `foregroundColor`, `backgroundColor`, `centerImage`
- **UI states**: `activeTab`, `copied`, `qrData`

### QR Code Generation Flow
1. **Input Processing**: Based on active tab, formats data (URL protocol addition, vCard generation)
2. **Library Loading**: Dynamically loads QRious library or falls back to external APIs
3. **Canvas Rendering**: Creates high-quality QR codes with custom colors and optional center images
4. **Error Handling**: Multiple fallback strategies for QR generation failures

### File Upload and Image Processing
- **File Handling**: FileReader API converts uploaded images to base64 data URLs
- **Canvas Integration**: High-quality image scaling with circular masking
- **Validation**: Automatic image size optimization (25% of QR code size)

### Download System
- **Primary**: Canvas.toBlob() for high-quality PNG exports
- **Fallback**: Canvas.toDataURL() for compatibility
- **External Images**: Re-renders on canvas to bypass CORS restrictions
- **Filename Sanitization**: Removes invalid characters automatically

## Development Guidelines

### Component Modifications
- **Main Logic**: All core functionality is in `QRCodeGenerator.tsx`
- **State Updates**: Use functional state updates for complex state objects
- **Effect Dependencies**: Pay attention to useEffect dependency arrays for QR regeneration

### Styling Approach
- **Tailwind First**: Use Tailwind classes for all styling
- **Custom CSS**: Minimal custom CSS in App.css and index.css
- **Responsive Design**: Mobile-first approach with lg: breakpoints for desktop

### Adding New QR Types
To add new QR code input types:
1. Add new tab configuration in `tabs` array
2. Create corresponding form UI in the render section
3. Add data processing logic in the main `useEffect`
4. Update the `activeTab` switch statement

### Color System
- **Validation**: Hex color validation using regex `/^#[0-9A-F]{6}$/i`
- **Synchronization**: Color picker and hex input stay synchronized
- **Real-time Updates**: QR codes regenerate automatically on color changes

### Internationalization
- **Translation Object**: `TRANSLATIONS` contains all UI text
- **Locale Detection**: Automatic browser locale detection with fallback to English
- **Adding Languages**: Add new locale objects to `TRANSLATIONS`

## Testing and Quality Assurance

### Manual Testing Checklist
- Test all three QR code types (URL, text, contact)
- Verify color customization with both picker and hex input
- Test image upload with various file formats
- Validate download functionality across browsers
- Check responsive design on mobile devices

### Browser Compatibility
- **Modern Browsers**: Full functionality with QRious library
- **Fallback Support**: External API fallback for older browsers
- **Canvas Support**: Required for advanced features (center images, custom colors)

## Deployment Notes

### Build Configuration
- **Output Directory**: `dist/`
- **Static Assets**: Handled by Vite automatically
- **Environment**: No environment variables required for basic functionality

### Hosting Recommendations
- **Static Hosting**: Vercel, Netlify, or GitHub Pages
- **Build Command**: `npm run build`
- **Serve Directory**: `dist/`

### External Dependencies
- **QRious Library**: Loaded via CDN (cdnjs.cloudflare.com)
- **Fallback Services**: Google Charts API and QR Server API
- **No Backend Required**: Fully client-side application

## Performance Considerations

### Bundle Optimization
- **Dynamic Loading**: QRious library loaded only when needed
- **Tree Shaking**: Vite automatically removes unused code
- **Asset Optimization**: Vite handles image and CSS optimization

### Runtime Performance
- **Canvas Rendering**: High-quality QR generation with proper memory management
- **Image Processing**: Efficient base64 conversion and canvas operations
- **State Updates**: Optimized re-renders through proper dependency management