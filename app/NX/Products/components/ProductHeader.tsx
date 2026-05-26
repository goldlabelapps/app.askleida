'use client';
import * as React from 'react';
import type { FC } from 'react';
import { 
  AppBar,
  CardHeader, 
  Container,
  IconButton,
  Avatar,
  Button,
  Typography, 
  useTheme,
} from '@mui/material';
import type { I_Product } from '../types';
import { useRouter } from 'next/navigation';
import { useDispatch } from '../../Uberedux';
import { navigateTo, Icon } from '../../DesignSystem';

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
    if (product && product.slug) {
      dispatch(navigateTo(router, `/products/${product.slug}`));
    }
  };

  const handleCreateClick = () => {
      dispatch(navigateTo(router, `/products/new`));
  };

  const handleDashboardClick = () => {
    dispatch(navigateTo(router, `/`));
  };
  

  return (
    <>
      <header>
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
              </>}

              title={<Typography
                color='secondary'
                variant="h5"
                component="h1"
                sx={{ mt: 0.25 }}>
                {title}
              </Typography>}
              
              action={<>

                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleCreateClick} 
                >

                  Create
                </Button>
                
                <IconButton color="primary">
                  <Icon icon="new" />
                </IconButton>
              </>}
            />
          </Container>
        </AppBar>
      </header>
      {/* <pre>product {JSON.stringify(product ?? {}, null, 2)}</pre> */}
    </>
  );
};

export default ProductHeader;
