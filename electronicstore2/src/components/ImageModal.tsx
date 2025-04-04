import React, { useState } from 'react';
import { 
  Modal, 
  IconButton, 
  Box,
  Stack,
  CircularProgress 
} from '@mui/material';
import { 
  Close as CloseIcon,
  ChevronLeft, 
  ChevronRight 
} from '@mui/icons-material';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  open,
  onClose,
  images,
  initialIndex = 0,
  title
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  // Update currentIndex when initialIndex changes
  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageSwitch = () => {
    setIsLoading(true);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  React.useEffect(() => {
    handleImageSwitch();
  }, [currentIndex]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.9)'
      }}
      onClick={handleBackdropClick}
    >
      <Box 
        sx={{ 
          position: 'relative', 
          width: '90vw',
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isLoading && (
            <CircularProgress 
              sx={{ 
                position: 'absolute',
                zIndex: 1
              }} 
            />
          )}
          <img
            src={images[currentIndex]}
            alt={`Full view ${currentIndex + 1}`}
            onLoad={handleImageLoad}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              opacity: isLoading ? 0.5 : 1,
              transition: 'opacity 0.3s'
            }}
          />
        </Box>

        {images.length > 1 && (
          <>
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              left: 0,
              display: 'flex',
              justifyContent: 'space-between',
              px: 2
            }}>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  width: 56,
                  height: 56,
                  '& .MuiSvgIcon-root': {
                    fontSize: 40
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  width: 56,
                  height: 56,
                  '& .MuiSvgIcon-root': {
                    fontSize: 40
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>

            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: 2,
                p: 1,
                zIndex: 1
              }}
            >
              {images.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                    transition: 'background-color 0.3s'
                  }}
                />
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ImageModal; 