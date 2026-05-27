'use client';
import * as React from 'react';
import type { FC } from 'react';
import { 
  Box,
  AppBar,
  CardHeader, 
  Container,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material';
import type { I_Product } from '../types';
import { useRouter } from 'next/navigation';
import { useDispatch } from '../../Uberedux';
import { 
  Icon,
  SearchBox,
  MightyButton,
} from '../../DesignSystem';
import { useState as useProductsState } from '../hooks/useState';
import { setKey, search } from '../index';
import { debounce } from 'lodash';

const ProductHeader: FC<{ product?: I_Product }> = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const themeMode = theme?.palette?.mode || 'light';
  const state = useProductsState() || {};
  const searchParams = state.searchParams || {};
  const searchValue = searchParams.s || '';

  const avatars = {
    "light": "/askleida/svg/avatarLight.svg",
    "dark": "/askleida/svg/avatarDark.svg"
  };
  const avatar = avatars[themeMode] || '';
  const title = product?.title || 'Products';

  const handleProductsClick = () => {
    router.push('/products');
  };
  const handleCreateClick = () => {
    router.push('/products/new');
  };
  const handleDashboardClick = () => {
    router.push(`/`);
  };

  const debouncedSearch = React.useMemo(() => debounce((val: string) => {
    dispatch(setKey('searchParams', { ...searchParams, s: val, page: 1 }));
    dispatch(search());
  }, 400), [dispatch, searchParams]);

  const handleSearchChange = (val: string) => {
    debouncedSearch(val);
  };

  const handleSearchEnter = (val: string) => {
    dispatch(setKey('searchParams', { ...searchParams, s: val, page: 1 }));
    dispatch(search());
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        sx={{
          boxShadow: 0,
          background: theme.palette?.background?.default || 'inherit',
        }}>
        <Container maxWidth="md">
          <CardHeader
            avatar={<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton color="primary" onClick={handleDashboardClick}>
                <Avatar src={avatar} />
              </IconButton>
              <IconButton color="primary" onClick={handleProductsClick}>
                <Icon icon="products" />
              </IconButton>
              <SearchBox
                value={searchValue}
                onChange={handleSearchChange}
                onEnter={handleSearchEnter}
                placeholder="Search products..."
              />
            </Box>}
            action={<>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <MightyButton
                  variant="outlined"
                  icon="new"
                  label="New Product"
                  onClick={handleCreateClick}
                />
              </Box>
            </>}
          />
        </Container>
      </AppBar>
    </>
  );
};

export default ProductHeader;
