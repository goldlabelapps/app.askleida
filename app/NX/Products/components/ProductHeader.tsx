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

const ProductHeader: FC<{ product?: I_Product }> = ({ product }) => {
  
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const themeMode = theme?.palette?.mode || 'light';
  

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

              avatar={<>

                <IconButton
                  color="primary"
                  onClick={handleDashboardClick}
                >
                  <Avatar src={avatar} />
                </IconButton>

                <IconButton 
                  color="primary"
                  onClick={handleProductsClick}
                >
                  <Icon icon="products" />
                </IconButton>

              <SearchBox
                value=""
                onChange={() => { }}
                onEnter={() => { }}
                placeholder="Search products..."
              />
              </>}
              
              action={<>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>

                  <MightyButton
                    variant="outlined"
                    icon="new"
                    label="Create"
                    onClick={handleCreateClick}
                  />

                
                </Box>
              </>}
            />
          </Container>
        </AppBar>
    
      {/* <pre>product {JSON.stringify(product ?? {}, null, 2)}</pre> */}
    </>
  );
};

export default ProductHeader;
