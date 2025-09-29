# QR Code Generator

🎯 A comprehensive React-based QR code generator with advanced customization features.

## ✨ Features

- 🔗 **Multiple QR Types**: URL, Text, and Contact (vCard) generation
- 🎨 **Color Customization**: Custom foreground and background colors with hex input
- 🖼️ **Center Image Overlay**: Add logos or images to the center of your QR codes
- 📱 **Multi-language Support**: English and Spanish translations
- 📥 **Custom Downloads**: Custom filenames with optional timestamps
- 🎯 **High-Quality Output**: Canvas-based generation with fallback options
- 📱 **Responsive Design**: Modern UI built with Tailwind CSS
- ⚡ **Fast Development**: Built with Vite and TypeScript

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

### Project Structure

```
src/
├── QRCodeGenerator.tsx  # Main component with all functionality
├── App.tsx             # App wrapper
├── main.tsx           # Entry point
├── index.css          # Global styles
└── App.css            # Component styles
```

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
