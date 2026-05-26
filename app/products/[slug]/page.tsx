"use client";
import * as React from "react";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Button, 
  CircularProgress, 
  Backdrop,
} from "@mui/material";
import { ProductDetail, ProductCreate } from '../../NX/Products';
import { useDispatch } from '../../NX/Uberedux';
import { navigateTo, Icon } from '../../NX/DesignSystem';
import { useRouter } from 'next/navigation';

type ProductPageWrapperProps = {
  children: React.ReactNode;
  onBack: () => void;
};

function ProductPageWrapper({ children, onBack }: ProductPageWrapperProps) {

  const dispatch = useDispatch();
  const router = useRouter();

  const handleBack = () => {
    dispatch(navigateTo(router, '/products'));
  }

  const handleNew = () => {
    dispatch(navigateTo(router, '/products/new'));
  }
  return (
    <Container id="main" maxWidth="md">
      <AppBar position="static" color="default" elevation={1} sx={{ mb: 3, mt: '100px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon="products" />}
            onClick={onBack}
          >
            All
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon="new" />}
            onClick={handleNew}
          >
            New
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </Container>
  );
}

export default function ProductSlugPage() {

    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleBack = () => {
      dispatch(navigateTo(router, '/products'));
    }

    useEffect(() => {
      if (!slug || slug === 'new') return;
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data.data); // Only set the product data
          setLoading(false);
        });
    }, [slug]);



    if (slug === 'new') {
      return (
        <ProductPageWrapper onBack={handleBack}>
          <ProductCreate />
        </ProductPageWrapper>
      );
    }

    if (loading) return (
      <Backdrop
        open={true}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

    if (!product) notFound();

    return (
      <ProductPageWrapper onBack={handleBack}>
        <ProductDetail product={product} />
      </ProductPageWrapper>
    );
  }
