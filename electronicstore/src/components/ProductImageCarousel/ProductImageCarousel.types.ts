export interface ProductImageCarouselProps {
    /**
     * Array of image URLs to display in the carousel
     */
    images: string[];

    /**
     * Name of the product for accessibility and modal title
     */
    productName: string;

    /**
     * CSS value for the aspect ratio of the image container (default: '75%')
     */
    aspectRatio?: string;

    /**
     * Whether to show navigation controls
     */
    showControls?: boolean;

    /**
     * Whether to show indicator dots
     */
    showIndicators?: boolean;

    /**
     * Whether to enable the fullscreen modal on image click
     */
    enableModal?: boolean;
} 