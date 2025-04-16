import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
    Box,
    CircularProgress,
    IconButton,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ImageModal from '../ImageModal';
import { ProductImageCarouselProps } from './ProductImageCarousel.types';

/**
 * A reusable product image carousel component with navigation controls
 * and optional modal view support
 */
const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
    images,
    productName,
    aspectRatio = '75%', // Default to 4:3 aspect ratio
    showControls = true,
    showIndicators = true,
    enableModal = true
}) => {
    const theme = useTheme();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    const handleImageSwitch = () => {
        setIsImageLoading(true);
    };

    // Reset loading state when image changes
    useEffect(() => {
        handleImageSwitch();
    }, [currentImageIndex]);

    const handlePrevImage = () => {
        setCurrentImageIndex(prev =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const handleImageClick = () => {
        if (enableModal) {
            setIsModalOpen(true);
        }
    };

    // Don't render anything if no images
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <>
            <Box sx={{
                position: 'relative',
                paddingTop: aspectRatio,
                backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                {isImageLoading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    }}>
                        <CircularProgress />
                    </Box>
                )}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <img
                        src={images[currentImageIndex]}
                        alt={`${productName} - view ${currentImageIndex + 1}`}
                        onLoad={handleImageLoad}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center center',
                            cursor: enableModal ? 'pointer' : 'default',
                            opacity: isImageLoading ? 0.5 : 1,
                            transition: 'opacity 0.3s'
                        }}
                        onClick={handleImageClick}
                    />
                </Box>

                {/* Show navigation buttons only if there's more than one image and controls are enabled */}
                {showControls && images.length > 1 && (
                    <>
                        <IconButton
                            onClick={handlePrevImage}
                            sx={{
                                position: 'absolute',
                                left: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: theme.palette.mode === 'dark'
                                    ? 'rgba(0,0,0,0.7)'
                                    : 'rgba(255,255,255,0.8)',
                                color: theme.palette.mode === 'dark'
                                    ? theme.palette.common.white
                                    : theme.palette.common.black,
                                '&:hover': {
                                    bgcolor: theme.palette.mode === 'dark'
                                        ? 'rgba(0,0,0,0.9)'
                                        : 'rgba(255,255,255,0.9)'
                                }
                            }}
                            size="small"
                            aria-label="Previous image"
                        >
                            <ChevronLeft />
                        </IconButton>
                        <IconButton
                            onClick={handleNextImage}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                bgcolor: theme.palette.mode === 'dark'
                                    ? 'rgba(0,0,0,0.7)'
                                    : 'rgba(255,255,255,0.8)',
                                color: theme.palette.mode === 'dark'
                                    ? theme.palette.common.white
                                    : theme.palette.common.black,
                                '&:hover': {
                                    bgcolor: theme.palette.mode === 'dark'
                                        ? 'rgba(0,0,0,0.9)'
                                        : 'rgba(255,255,255,0.9)'
                                }
                            }}
                            size="small"
                            aria-label="Next image"
                        >
                            <ChevronRight />
                        </IconButton>
                    </>
                )}
            </Box>

            {/* Image indicators */}
            {showIndicators && images.length > 1 && (
                <Box sx={{
                    display: 'flex',
                    gap: { xs: 0.5, sm: 1 },
                    mt: { xs: 1, sm: 2 },
                    justifyContent: 'center'
                }}>
                    {images.map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: index === currentImageIndex
                                    ? theme.palette.primary.main
                                    : theme.palette.mode === 'dark'
                                        ? 'grey.700'
                                        : 'grey.300',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onClick={() => setCurrentImageIndex(index)}
                            aria-label={`View image ${index + 1}`}
                        />
                    ))}
                </Box>
            )}

            {/* Image Modal for full-screen view */}
            {enableModal && (
                <ImageModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    images={images}
                    initialIndex={currentImageIndex}
                    title={productName}
                />
            )}
        </>
    );
};

export default ProductImageCarousel; 