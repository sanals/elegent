import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ProductImageCarousel from './ProductImageCarousel';

// Mock data
const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
];

// Create theme for testing
const theme = createTheme({
    palette: {
        mode: 'light'
    }
});

// Test wrapper component with theme provider
const renderWithTheme = (ui: React.ReactElement) => {
    return render(
        <ThemeProvider theme={theme}>
            {ui}
        </ThemeProvider>
    );
};

describe('ProductImageCarousel', () => {
    test('renders correctly with multiple images', () => {
        renderWithTheme(
            <ProductImageCarousel
                images={mockImages}
                productName="Test Product"
            />
        );

        // Initial image should be displayed
        const image = screen.getByAltText('Test Product - view 1');
        expect(image).toBeInTheDocument();

        // Navigation buttons should be present
        const prevButton = screen.getByLabelText('Previous image');
        const nextButton = screen.getByLabelText('Next image');
        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();

        // Indicators should be present (3 dots for 3 images)
        const indicators = screen.getAllByLabelText(/View image \d/);
        expect(indicators).toHaveLength(3);
    });

    test('navigates to next and previous images when buttons are clicked', () => {
        renderWithTheme(
            <ProductImageCarousel
                images={mockImages}
                productName="Test Product"
            />
        );

        // Initially we should see the first image
        expect(screen.getByAltText('Test Product - view 1')).toBeInTheDocument();

        // Click next button
        fireEvent.click(screen.getByLabelText('Next image'));
        expect(screen.getByAltText('Test Product - view 2')).toBeInTheDocument();

        // Click next button again
        fireEvent.click(screen.getByLabelText('Next image'));
        expect(screen.getByAltText('Test Product - view 3')).toBeInTheDocument();

        // Click next button again should cycle back to first image
        fireEvent.click(screen.getByLabelText('Next image'));
        expect(screen.getByAltText('Test Product - view 1')).toBeInTheDocument();

        // Click prev button to go to last image
        fireEvent.click(screen.getByLabelText('Previous image'));
        expect(screen.getByAltText('Test Product - view 3')).toBeInTheDocument();
    });

    test('clicking on an indicator dot changes the current image', () => {
        renderWithTheme(
            <ProductImageCarousel
                images={mockImages}
                productName="Test Product"
            />
        );

        // Initially we should see the first image
        expect(screen.getByAltText('Test Product - view 1')).toBeInTheDocument();

        // Click on the third indicator
        const indicators = screen.getAllByLabelText(/View image \d/);
        fireEvent.click(indicators[2]);

        // Should display the third image
        expect(screen.getByAltText('Test Product - view 3')).toBeInTheDocument();
    });

    test('hides controls when showControls is false', () => {
        renderWithTheme(
            <ProductImageCarousel
                images={mockImages}
                productName="Test Product"
                showControls={false}
            />
        );

        // Navigation buttons should not be present
        expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    });

    test('hides indicators when showIndicators is false', () => {
        renderWithTheme(
            <ProductImageCarousel
                images={mockImages}
                productName="Test Product"
                showIndicators={false}
            />
        );

        // Indicators should not be present
        const indicators = screen.queryAllByLabelText(/View image \d/);
        expect(indicators).toHaveLength(0);
    });

    test('renders nothing when images array is empty', () => {
        const { container } = renderWithTheme(
            <ProductImageCarousel
                images={[]}
                productName="Test Product"
            />
        );

        // Container should be empty
        expect(container.firstChild).toBeNull();
    });
}); 