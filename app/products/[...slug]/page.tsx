// This file was moved from /products/[slug]/page.tsx to /products/[...slug]/page.tsx to support both /products/:slug and /products/:slug/edit routes.
"use client";
import * as React from "react";
import Head from "next/head";
import { useParams, notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  useTheme,
  Container,
  CircularProgress, 
  Backdrop,
} from "@mui/material";
import { 
    ProductDetail, 
    ProductCreate, 
    ProductHeader,
} from '../../NX/Products';
import type { I_Product } from '../../NX/Products/types.d.ts';
import { useDispatch } from '../../NX/Uberedux';
import { useRouter } from 'next/navigation';

type ProductPageWrapperProps = {
  children: React.ReactNode;
  onBack: () => void;
  product?: I_Product;
};


function ProductPageWrapper({ children, product }: ProductPageWrapperProps) {
  return (
    <>
      <ProductHeader product={product ?? undefined} />
      <Container id="main" maxWidth="md" sx={{ mt: '100px' }}>
        {children}
      </Container>
    </>
  );
}

export default function ProductPage() {
  const theme = useTheme();
  const params = useParams();
  const searchParams = useSearchParams();
  let slug = params.slug;
  if (Array.isArray(slug)) {
    slug = slug[0];
  }

  const [product, setProduct] = useState<I_Product | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  // Restore search param if present
  React.useEffect(() => {
    const s = searchParams.get('s');
    if (s) {
      dispatch({ type: 'products/setKey', key: 'searchParams', value: { s } });
    }
  }, [searchParams, dispatch]);

  const handleBack = () => {
    router.push('/products');
  };

  useEffect(() => {
    if (!slug || slug === 'new') {
      setLoading(false);
      setProduct(null);
      return;
    }
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Backdrop
        open={true}
        sx={{
          color: theme.palette?.common?.white,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );

  if (slug === 'new') {
    return (
      <>
        <Head>
          <title>Products</title>
        </Head>
        <ProductPageWrapper onBack={handleBack} product={undefined}>
          <ProductCreate />
        </ProductPageWrapper>
      </>
    );
  }

  if (!product) notFound();

  return (
    <>
      <Head>
        <title>{product?.title ? product.title : "Products"}</title>
      </Head>
      <ProductPageWrapper onBack={handleBack} product={product ?? undefined}>
        <ProductDetail product={product} />
      </ProductPageWrapper>
    </>
  );
}



  const theme = useTheme();
  const params = useParams();
  const searchParams = useSearchParams();
  // Only support /products/:slug and /products/new
  let slug = params.slug;
  if (Array.isArray(slug)) {
    slug = slug[0];
  }

  const [product, setProduct] = useState<I_Product | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  // Restore search param if present
  React.useEffect(() => {
    const s = searchParams.get('s');
    if (s) {
      dispatch({ type: 'products/setKey', key: 'searchParams', value: { s } });
    }
  }, [searchParams, dispatch]);

  const handleBack = () => {
    router.push('/products');
  };

  useEffect(() => {
    if (!slug || slug === 'new') {
      setLoading(false);
      setProduct(null);
      return;
    }
    console.debug('Fetching product for slug:', slug);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [slug]);


  if (loading) return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Backdrop
        open={true}
        sx={{
          color: theme.palette?.common?.white,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );


  if (slug === 'new') {
    return (
      <>
        <Head>
          <title>Products</title>
        </Head>
        <ProductPageWrapper onBack={handleBack} product={undefined}>
          <ProductCreate />
        </ProductPageWrapper>
      </>
    );
  }


  if (!product) notFound();


  return (
    <>
      <Head>
        <title>{product?.title ? product.title : "Products"}</title>
      </Head>
      <ProductPageWrapper onBack={handleBack} product={product ?? undefined}>
        <ProductDetail product={product} />
      </ProductPageWrapper>
    </>
  );
}
