import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    addButtonLabel?: string;
    addButtonPath?: string;
    onAddClick?: () => void;
    hideAddButton?: boolean;
}

/**
 * Reusable page header component with title and action button
 */
const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    addButtonLabel = `Add ${title.endsWith('s') ? title.slice(0, -1) : title}`,
    addButtonPath,
    onAddClick,
    hideAddButton = false
}) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
                {title}
            </Typography>

            {!hideAddButton && (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    {...(addButtonPath ? { component: Link, to: addButtonPath } : { onClick: onAddClick })}
                >
                    {addButtonLabel}
                </Button>
            )}
        </Box>
    );
};

export default PageHeader; 