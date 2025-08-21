# Color Palette Generator

A interactive color palette generator that creates harmonious color schemes using different color theory principles. Generate palettes from scratch or build them around your specific starting colors.

## ✨ Features

### 🎨 Color Generation
- **Optional Starting Color**: Specify a base color (hex format) or leave empty for random generation
- **Multiple Harmony Types**: 7 different color harmony algorithms
  - Mixed Harmony (combination approach)
  - Monochromatic (same hue, varied saturation/lightness)
  - Analogous (adjacent colors on color wheel)
  - Complementary (opposite colors)
  - Split-Complementary (base + two adjacent to complement)
  - Triadic (three evenly spaced colors)
  - Tetradic (two complementary pairs)

### 📤 Export & Share
- **JSON Export**: Download palettes with complete color data
- **Enhanced Metadata**: Exports include harmony type, starting color, and timestamp
- **Multiple Formats**: Each color exported in HEX, RGB, HSL, and individual component values

## 🚀 Live Demo

Visit the live site: [https://bouldouklu.github.io/color-palette-generator](https://bouldouklu.github.io/color-palette-generator)

## 🛠 Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/bouldouklu/color-palette-generator.git

# Navigate to directory
cd color-palette-generator

# Open in browser
open index.html
```

### File Structure
```
color-palette-generator/
├── index.html          # Main HTML structure
├── style.css           # Complete styling and responsive design
├── script.js           # Core color generation logic
└── README.md           # This file
```

### No Build Process Required
Simply open `index.html` in any modern web browser. The application uses vanilla JavaScript and CSS - no frameworks or build tools needed.

## 🎨 Color Theory Background

This generator implements mathematical color harmony principles:

- **Hue Relationships**: Based on positions on the color wheel (0-360°)
- **Saturation Control**: Maintains vibrant colors while allowing variation
- **Lightness Balance**: Ensures readable and visually pleasing combinations
- **Mathematical Precision**: Uses HSL color space for accurate calculations

## 📱 Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Clipboard API
- HTML5 color input type

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).