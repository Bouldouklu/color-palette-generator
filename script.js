// Main class that handles all color palette generation functionality
class ColorPaletteGenerator {
    constructor() {
        // Get references to HTML elements we'll need to interact with
        this.paletteContainer = document.getElementById('paletteContainer');
        this.generateBtn = document.getElementById('generateBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.harmonyTypeSelector = document.getElementById('harmonyType');
        
        // Store the current palette colors for export functionality
        this.currentPalette = [];
        
        // Initialize the application
        this.init();
    }
    
    // Set up event listeners and generate the first palette
    init() {
        // When generate button is clicked, create a new palette
        this.generateBtn.addEventListener('click', () => this.generatePalette());
        
        // When export button is clicked, download the current palette as JSON
        this.exportBtn.addEventListener('click', () => this.exportPalette());
        
        // When harmony type changes, generate a new palette automatically
        this.harmonyTypeSelector.addEventListener('change', () => this.generatePalette());
        
        // Create an initial palette when the app loads
        this.generatePalette();
    }
    
    // Generate a single random color with good saturation and lightness values
    generateRandomColor() {
        // Hue: 0-359 degrees (full color wheel)
        const hue = Math.floor(Math.random() * 360);
        
        // Saturation: 50-100% (ensures vibrant colors, not washed out)
        const saturation = Math.floor(Math.random() * 50) + 50;
        
        // Lightness: 30-70% (avoids too dark or too light colors)
        const lightness = Math.floor(Math.random() * 40) + 30;
        
        // Return color in multiple formats
        return {
            hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,           // CSS HSL format
            hex: this.hslToHex(hue, saturation, lightness),             // Hex format (#RRGGBB)
            hue,                                                        // Store individual values
            saturation,                                                 // for future calculations
            lightness
        };
    }
    
    // Convert HSL color values to HEX format
    // This is a mathematical conversion formula
    hslToHex(h, s, l) {
        l /= 100; // Convert lightness percentage to decimal (0-1)
        
        // Calculate the chroma (color intensity)
        const a = s * Math.min(l, 1 - l) / 100;
        
        // Function to calculate RGB component for each channel (Red, Green, Blue)
        const f = n => {
            const k = (n + h / 30) % 12;  // Position on the color wheel
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            
            // Convert to 0-255 range and format as 2-digit hex
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        
        // Combine RGB components into hex format
        return `#${f(0)}${f(8)}${f(4)}`;  // f(0)=Red, f(8)=Green, f(4)=Blue
    }
    
    // Generate monochromatic palette (same hue, different saturation/lightness)
    generateMonochromaticPalette() {
        const baseColor = this.generateRandomColor();
        const colors = [baseColor];
        
        // Create 4 variations of the same hue with different saturation/lightness
        for (let i = 1; i < 5; i++) {
            // Vary saturation: from light/desaturated to deep/saturated
            const saturation = Math.max(20, Math.min(90, baseColor.saturation + (i - 2) * 15));
            
            // Vary lightness: create a range from dark to light
            const lightness = Math.max(20, Math.min(80, baseColor.lightness + (i - 2) * 12));
            
            colors.push({
                hsl: `hsl(${baseColor.hue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(baseColor.hue, saturation, lightness),
                hue: baseColor.hue,
                saturation,
                lightness
            });
        }
        
        return colors;
    }
    
    // Generate analogous palette (adjacent colors on color wheel)
    generateAnalogousPalette() {
        const baseColor = this.generateRandomColor();
        const colors = [baseColor];
        
        // Create colors that are 15-30 degrees apart on the color wheel
        for (let i = 1; i < 5; i++) {
            const hueOffset = i * 20 - 40; // Creates spread: -40, -20, 0, +20, +40
            const newHue = (baseColor.hue + hueOffset + 360) % 360;
            
            // Slight variation in saturation and lightness for visual interest
            const saturation = Math.max(40, Math.min(90, baseColor.saturation + (Math.random() - 0.5) * 20));
            const lightness = Math.max(25, Math.min(75, baseColor.lightness + (Math.random() - 0.5) * 20));
            
            colors.push({
                hsl: `hsl(${newHue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(newHue, saturation, lightness),
                hue: newHue,
                saturation,
                lightness
            });
        }
        
        return colors;
    }
    
    // Generate complementary palette (opposite colors + variations)
    generateComplementaryPalette() {
        const baseColor = this.generateRandomColor();
        const complementHue = (baseColor.hue + 180) % 360;
        
        const colors = [baseColor];
        
        // Add the direct complement
        colors.push({
            hsl: `hsl(${complementHue}, ${baseColor.saturation}%, ${baseColor.lightness}%)`,
            hex: this.hslToHex(complementHue, baseColor.saturation, baseColor.lightness),
            hue: complementHue,
            saturation: baseColor.saturation,
            lightness: baseColor.lightness
        });
        
        // Add variations of base color and complement
        for (let i = 0; i < 3; i++) {
            const useBase = i < 2;
            const hue = useBase ? baseColor.hue : complementHue;
            const saturation = Math.max(30, Math.min(90, baseColor.saturation + (Math.random() - 0.5) * 30));
            const lightness = Math.max(25, Math.min(75, baseColor.lightness + (Math.random() - 0.5) * 30));
            
            colors.push({
                hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(hue, saturation, lightness),
                hue,
                saturation,
                lightness
            });
        }
        
        return colors;
    }
    
    // Generate split-complementary palette (base + two colors adjacent to complement)
    generateSplitComplementaryPalette() {
        const baseColor = this.generateRandomColor();
        const colors = [baseColor];
        
        // Calculate split-complement colors (150° and 210° from base)
        const splitComp1 = (baseColor.hue + 150) % 360;
        const splitComp2 = (baseColor.hue + 210) % 360;
        
        // Add the two split-complementary colors
        [splitComp1, splitComp2].forEach(hue => {
            const saturation = Math.max(40, Math.min(85, baseColor.saturation + (Math.random() - 0.5) * 25));
            const lightness = Math.max(30, Math.min(70, baseColor.lightness + (Math.random() - 0.5) * 25));
            
            colors.push({
                hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(hue, saturation, lightness),
                hue,
                saturation,
                lightness
            });
        });
        
        // Add two more variations mixing base and split-complement characteristics
        for (let i = 0; i < 2; i++) {
            const hue = i === 0 ? baseColor.hue : (Math.random() > 0.5 ? splitComp1 : splitComp2);
            const saturation = Math.max(35, Math.min(80, baseColor.saturation + (Math.random() - 0.5) * 30));
            const lightness = Math.max(25, Math.min(75, baseColor.lightness + (Math.random() - 0.5) * 30));
            
            colors.push({
                hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(hue, saturation, lightness),
                hue,
                saturation,
                lightness
            });
        }
        
        return colors;
    }
    
    // Generate triadic palette (three colors evenly spaced around color wheel)
    generateTriadicPalette() {
        const baseColor = this.generateRandomColor();
        const colors = [baseColor];
        
        // Calculate triadic colors (120° and 240° from base)
        const triadic1 = (baseColor.hue + 120) % 360;
        const triadic2 = (baseColor.hue + 240) % 360;
        
        // Add the two triadic colors
        [triadic1, triadic2].forEach(hue => {
            const saturation = Math.max(45, Math.min(85, baseColor.saturation + (Math.random() - 0.5) * 20));
            const lightness = Math.max(30, Math.min(70, baseColor.lightness + (Math.random() - 0.5) * 20));
            
            colors.push({
                hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(hue, saturation, lightness),
                hue,
                saturation,
                lightness
            });
        });
        
        // Add two more colors as variations of the triadic colors
        [baseColor.hue, triadic1].forEach(hue => {
            const saturation = Math.max(40, Math.min(80, baseColor.saturation + (Math.random() - 0.5) * 25));
            const lightness = Math.max(25, Math.min(75, baseColor.lightness + (Math.random() - 0.5) * 25));
            
            colors.push({
                hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(hue, saturation, lightness),
                hue,
                saturation,
                lightness
            });
        });
        
        return colors;
    }
    
    // Generate tetradic/rectangle palette (two pairs of complementary colors)
    generateTetradicPalette() {
        const baseColor = this.generateRandomColor();
        const colors = [baseColor];
        
        // Calculate tetradic colors (90°, 180°, 270° from base)
        const tetradic1 = (baseColor.hue + 90) % 360;   // 90° from base
        const tetradic2 = (baseColor.hue + 180) % 360;  // Complement of base
        const tetradic3 = (baseColor.hue + 270) % 360;  // Complement of first tetradic
        
        // Add the three tetradic colors
        [tetradic1, tetradic2, tetradic3].forEach(hue => {
            const saturation = Math.max(40, Math.min(85, baseColor.saturation + (Math.random() - 0.5) * 25));
            const lightness = Math.max(30, Math.min(70, baseColor.lightness + (Math.random() - 0.5) * 25));
            
            colors.push({
                hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(hue, saturation, lightness),
                hue,
                saturation,
                lightness
            });
        });
        
        // Add one more variation
        const extraHue = [baseColor.hue, tetradic1, tetradic2, tetradic3][Math.floor(Math.random() * 4)];
        const saturation = Math.max(35, Math.min(80, baseColor.saturation + (Math.random() - 0.5) * 30));
        const lightness = Math.max(25, Math.min(75, baseColor.lightness + (Math.random() - 0.5) * 30));
        
        colors.push({
            hsl: `hsl(${extraHue}, ${saturation}%, ${lightness}%)`,
            hex: this.hslToHex(extraHue, saturation, lightness),
            hue: extraHue,
            saturation,
            lightness
        });
        
        return colors;
    }
    
    // Generate mixed harmony palette (original algorithm - combination of different harmony types)
    generateMixedHarmonyPalette() {
        const baseColor = this.generateRandomColor();
        const colors = [baseColor];
        
        // Generate 4 additional colors using different harmony relationships
        for (let i = 1; i < 5; i++) {
            let newHue;
            
            if (i === 1) {
                // COMPLEMENTARY: Opposite on color wheel (180° apart)
                newHue = (baseColor.hue + 180) % 360;
            } else if (i === 2) {
                // ANALOGOUS: Adjacent color (+30° on color wheel)
                newHue = (baseColor.hue + 30) % 360;
            } else if (i === 3) {
                // ANALOGOUS: Adjacent color (-30° on color wheel)
                newHue = (baseColor.hue - 30 + 360) % 360;
            } else {
                // TRIADIC: 120° apart on color wheel
                newHue = (baseColor.hue + 120) % 360;
            }
            
            // Vary saturation and lightness for each new color to add variety
            const saturation = Math.floor(Math.random() * 30) + 50; // 50-80%
            const lightness = Math.floor(Math.random() * 40) + 30;  // 30-70%
            
            colors.push({
                hsl: `hsl(${newHue}, ${saturation}%, ${lightness}%)`,
                hex: this.hslToHex(newHue, saturation, lightness),
                hue: newHue,
                saturation,
                lightness
            });
        }
        
        return colors;
    }
    
    // Main function to generate a palette based on selected harmony type
    generatePalette() {
        const harmonyType = this.harmonyTypeSelector.value;
        
        // Generate palette based on selected harmony type
        switch (harmonyType) {
            case 'monochromatic':
                this.currentPalette = this.generateMonochromaticPalette();
                break;
            case 'analogous':
                this.currentPalette = this.generateAnalogousPalette();
                break;
            case 'complementary':
                this.currentPalette = this.generateComplementaryPalette();
                break;
            case 'split-complementary':
                this.currentPalette = this.generateSplitComplementaryPalette();
                break;
            case 'triadic':
                this.currentPalette = this.generateTriadicPalette();
                break;
            case 'tetradic':
                this.currentPalette = this.generateTetradicPalette();
                break;
            case 'mixed':
            default:
                this.currentPalette = this.generateMixedHarmonyPalette();
                break;
        }
        
        // Update the visual display
        this.renderPalette();
    }
    
    // Create the HTML elements to display the color palette
    renderPalette() {
        // Clear any existing colors from the display
        this.paletteContainer.innerHTML = '';
        
        // Create a visual box for each color in the palette
        this.currentPalette.forEach((color, index) => {
            // Create the main color box container
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color.hsl; // Set the background to the color
            
            // Create container for color information text
            const colorInfo = document.createElement('div');
            colorInfo.className = 'color-info';
            
            // Display the hex code (e.g., #FF5733)
            const colorCode = document.createElement('div');
            colorCode.className = 'color-code';
            colorCode.textContent = color.hex;
            
            // Assemble the color info display
            colorInfo.appendChild(colorCode);
            colorBox.appendChild(colorInfo);
            
            // Make the color box clickable to copy the hex code
            colorBox.addEventListener('click', () => this.copyToClipboard(color.hex));
            
            // Add the completed color box to the palette container
            this.paletteContainer.appendChild(colorBox);
        });
    }
    
    // Copy text to the user's clipboard using the modern Clipboard API
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Success: show confirmation to user
                this.showCopyNotification(text);
            })
            .catch(err => {
                // Error: log to console (could add user-visible error message)
                console.error('Failed to copy: ', err);
            });
    }
    
    // Display a temporary notification when color is copied
    showCopyNotification(color) {
        // Remove any existing notification to avoid duplicates
        const existingNotification = document.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification element
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = `Copied ${color} to clipboard!`;
        
        // Add to page (starts off-screen due to CSS transform)
        document.body.appendChild(notification);
        
        // Trigger slide-in animation after a tiny delay
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto-remove after 3 seconds with slide-out animation
        setTimeout(() => {
            notification.classList.remove('show');           // Start slide-out
            setTimeout(() => notification.remove(), 300);    // Remove from DOM after animation
        }, 3000);
    }
    
    // Export the current palette as a downloadable JSON file
    exportPalette() {
        const harmonyType = this.harmonyTypeSelector.value;
        
        // Create structured data object for export
        const paletteData = {
            harmonyType: harmonyType,               // Include the harmony type used
            colors: this.currentPalette.map(color => ({
                hex: color.hex,
                hsl: color.hsl,
                hue: color.hue,
                saturation: color.saturation,
                lightness: color.lightness
            })),
            timestamp: new Date().toISOString(),    // When palette was created
            name: `${harmonyType}_palette_${Date.now()}`  // Descriptive filename
        };
        
        // Convert to JSON string with nice formatting
        const dataStr = JSON.stringify(paletteData, null, 2);
        
        // Create a downloadable file blob
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create invisible download link and trigger it
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);      // Create temporary URL for the blob
        link.download = `${paletteData.name}.json`;     // Set filename
        link.click();                                   // Trigger download
        
        // Clean up: release the temporary URL to free memory
        URL.revokeObjectURL(link.href);
        
        // Show success message
        this.showCopyNotification('Palette exported successfully!');
    }
}

// Initialize the entire application when the HTML page finishes loading
document.addEventListener('DOMContentLoaded', () => {
    new ColorPaletteGenerator(); // Create and start the app
});