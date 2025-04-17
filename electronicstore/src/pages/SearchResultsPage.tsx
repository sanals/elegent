import { Box, CircularProgress, Container, Grid, Pagination, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const {
        fetchProducts,
        filteredProducts,
        loading,
        totalPages,
        currentPage,
        setPage
    } = useProducts();
    const [searched, setSearched] = useState(false);
    // Use a ref to track if we've already fetched for this query
    const searchedQueryRef = useRef<string | null>(null);

    useEffect(() => {
        // Only fetch if this query hasn't been searched yet
        if (query && searchedQueryRef.current !== query) {
            searchedQueryRef.current = query;
            fetchProducts(query);
            setSearched(true);
        }
    }, [query]); // Remove fetchProducts from dependencies

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1); // API uses 0-based indexing
        window.scrollTo(0, 0);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Search Results for "{query}"
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : searched && filteredProducts.length === 0 ? (
                <Typography variant="body1" sx={{ py: 4 }}>
                    No products found matching "{query}". Try a different search term.
                </Typography>
            ) : (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {filteredProducts.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage + 1}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default SearchResultsPage; 