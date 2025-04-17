import { Container } from '@mui/material';
import React from 'react';
import { OutletList } from '../../components/outlets';

const OutletsPage: React.FC = () => {
  return (
    <Container>
      <OutletList />
    </Container>
  );
};

export default OutletsPage;
