/**
 * Theme Color Update Script
 * 
 * This script allows easy updating of the color theme across all applications.
 * Run with Node.js: node update-theme.js
 */

const fs = require('fs');
const path = require('path');

// The color configuration
const COLORS = {
    // Primary brand color - EDIT THIS TO CHANGE THE MAIN COLOR
    PRIMARY: '#203120',

    // Secondary color for accents
    SECONDARY: '#558855',

    // Background colors
    LIGHT_BG: '#f8f9f6',
    DARK_BG: '#0f170f',

    // Paper colors (cards, dialogs, etc)
    LIGHT_PAPER: '#ffffff',
    DARK_PAPER: '#192619',

    // Text colors
    LIGHT_TEXT: '#263126',
    DARK_TEXT: '#e0e8e0',

    // Error, warning, info, success
    ERROR: '#d32f2f',
    WARNING: '#ed6c02',
    INFO: '#0288d1',
    SUCCESS: '#2e7d32'
};

// Target files to update
const files = [
    path.join(__dirname, 'types', 'colors.ts'),
    path.join(__dirname, 'electronicstore', 'src', 'context', 'ThemeContext.tsx'),
    path.join(__dirname, 'electronicstoreadmin', 'src', 'context', 'ThemeContext.tsx')
];

// Generate the color constants snippet
const generateColorsCode = () => {
    let code = `const COLORS = {
    // Primary brand color
    PRIMARY: '${COLORS.PRIMARY}',
    
    // Secondary color for accents
    SECONDARY: '${COLORS.SECONDARY}',
    
    // Background colors
    LIGHT_BG: '${COLORS.LIGHT_BG}',
    DARK_BG: '${COLORS.DARK_BG}',
    
    // Paper colors (cards, dialogs, etc)
    LIGHT_PAPER: '${COLORS.LIGHT_PAPER}',
    DARK_PAPER: '${COLORS.DARK_PAPER}',
    
    // Text colors
    LIGHT_TEXT: '${COLORS.LIGHT_TEXT}',
    DARK_TEXT: '${COLORS.DARK_TEXT}',
`;

    if (files[0].includes('colors.ts')) {
        code += `    
    // Error, warning, info, success
    ERROR: '${COLORS.ERROR}',
    WARNING: '${COLORS.WARNING}',
    INFO: '${COLORS.INFO}',
    SUCCESS: '${COLORS.SUCCESS}'
}`;
    } else {
        code += `};`;
    }

    return code;
};

// Update the colors in each file
const updateFiles = () => {
    files.forEach(filePath => {
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');

        if (filePath.includes('colors.ts')) {
            // Update the entire colors.ts file
            content = `/**
 * Shared color palette for the Elegent Electronics Store
 * This file serves as the single source of truth for colors across all applications
 */

export ${generateColorsCode()}`;
        } else {
            // Update just the COLORS constant in theme context files
            const colorsRegex = /const COLORS = \{[\s\S]*?\};/;
            content = content.replace(colorsRegex, generateColorsCode());
        }

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    });
};

// Run the update
console.log('Updating theme colors...');
updateFiles();
console.log('Theme colors updated successfully!');
console.log(`Main color is now: ${COLORS.PRIMARY}`); 