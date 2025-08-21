class ColorPaletteGenerator {
    constructor() {
        this.paletteContainer = document.getElementById('paletteContainer');
        this.generateBtn = document.getElementById('generateBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.currentPalette = [];
        
        this.init();
    }
    
    init() {
        this.generateBtn.addEventListener('click', () => this.generatePalette());
        this.exportBtn.addEventListener('click', () => this.exportPalette());
        
        // Generate initial palette
        this.generatePalette();
    }
    
    generateRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 50; // 50-100%
        const lightness = Math.floor(Math.random() * 40) + 30; // 30-70%
        
        return {
            hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            hex: this.hslToHex(hue, saturation, lightness),
            hue,
            saturation,
            lightness
        };
    }
    
    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    
    generateHarmoniousPalette() {
        const baseColor = this.generateRandomColor();
        const colors = [baseColor];
        
        // Generate complementary and analogous colors
        for (let i = 1; i < 5; i++) {
            let newHue;
            if (i === 1) {
                // Complementary color
                newHue = (baseColor.hue + 180) % 360;
            } else if (i === 2) {
                // Analogous color 1
                newHue = (baseColor.hue + 30) % 360;
            } else if (i === 3) {
                // Analogous color 2
                newHue = (baseColor.hue - 30 + 360) % 360;
            } else {
                // Triadic color
                newHue = (baseColor.hue + 120) % 360;
            }
            
            const saturation = Math.floor(Math.random() * 30) + 50; // 50-80%
            const lightness = Math.floor(Math.random() * 40) + 30; // 30-70%
            
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
    
    generatePalette() {
        this.currentPalette = this.generateHarmoniousPalette();
        this.renderPalette();
    }
    
    renderPalette() {
        this.paletteContainer.innerHTML = '';
        
        this.currentPalette.forEach((color, index) => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color.hsl;
            
            const colorInfo = document.createElement('div');
            colorInfo.className = 'color-info';
            
            const colorCode = document.createElement('div');
            colorCode.className = 'color-code';
            colorCode.textContent = color.hex;
            
            const colorName = document.createElement('div');
            colorName.className = 'color-name';
            colorName.textContent = this.getColorName(color.hue);
            
            colorInfo.appendChild(colorCode);
            colorInfo.appendChild(colorName);
            colorBox.appendChild(colorInfo);
            
            colorBox.addEventListener('click', () => this.copyToClipboard(color.hex));
            
            this.paletteContainer.appendChild(colorBox);
        });
    }
    
    getColorName(hue) {
        const colorNames = [
            'Red', 'Red-Orange', 'Orange', 'Yellow-Orange', 'Yellow', 'Yellow-Green',
            'Green', 'Blue-Green', 'Blue', 'Blue-Violet', 'Violet', 'Red-Violet'
        ];
        
        const index = Math.floor(hue / 30);
        return colorNames[index] || 'Red';
    }
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showCopyNotification(text);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }
    
    showCopyNotification(color) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = `Copied ${color} to clipboard!`;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    exportPalette() {
        const paletteData = {
            colors: this.currentPalette.map(color => ({
                hex: color.hex,
                hsl: color.hsl
            })),
            timestamp: new Date().toISOString(),
            name: `Palette_${Date.now()}`
        };
        
        const dataStr = JSON.stringify(paletteData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${paletteData.name}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
        
        this.showCopyNotification('Palette exported successfully!');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ColorPaletteGenerator();
});