"use client";
import * as React from "react";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  useTheme,
  Container,
  CircularProgress, 
  Backdrop,
} from "@mui/material";
import { ProductDetail, ProductCreate, ProductHeader } from '../../NX/Products';
import { useDispatch } from '../../NX/Uberedux';
import { navigateTo, Icon } from '../../NX/DesignSystem';
import { useRouter } from 'next/navigation';

type ProductPageWrapperProps = {
  children: React.ReactNode;
  onBack: () => void;
  product: any;
};

function ProductPageWrapper({ children, onBack, product }: ProductPageWrapperProps) {

  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleBack = () => {
    dispatch(navigateTo(router, '/products'));
  }

  const handleNew = () => {
    dispatch(navigateTo(router, '/products/new'));
  }

  console.log('product', product);

  return (
    <>
      <ProductHeader product={product} />
      <Container id="main" maxWidth="md" sx={{mt: '100px'}}>
        {children}
      </Container>
    </>
  );
}

export default function ProductSlugPage() {

    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();
    console.debug('ProductSlugPage: slug', slug);

    const handleBack = () => {
      dispatch(navigateTo(router, '/products'));
    }

    useEffect(() => {
      if (!slug || slug === 'new') return;
      console.debug('Fetching product for slug:', slug);
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          console.debug('API response for product:', data);
          setProduct(data.data); // Only set the product data
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching product:', err);
          setLoading(false);
        });
    }, [slug]);


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

    if (slug === 'new') {
      return (
        <ProductPageWrapper onBack={handleBack} product={product}>
          <ProductCreate />
        </ProductPageWrapper>
      );
    }
    return (
      <ProductPageWrapper onBack={handleBack} product={product}>
        <ProductDetail product={product} />
      </ProductPageWrapper>
    );
  }
