// This file was moved from /products/[slug]/page.tsx to /products/[...slug]/page.tsx to support both /products/:slug and /products/:slug/edit routes.
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
import { ProductDetail, ProductCreate, ProductHeader,
  ProductUpdate,
 } from '../../NX/Products';
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
    router.push('/products');
  }

  const handleNew = () => {
    router.push('/products/new');
  }


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
  const theme = useTheme();
  const params = useParams();
  // Support both /products/:slug and /products/:slug/edit
  let slug = params.slug;
  let isEdit = false;
  if (Array.isArray(slug)) {
    // e.g. ['my-product', 'edit']
    if (slug.length > 1 && slug[1] === 'edit') {
      isEdit = true;
      slug = slug[0];
    } else {
      slug = slug.join('/');
    }
  }


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

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
    <Backdrop
      open={true}
      sx={{
        color: theme.palette?.common?.white,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );

  if (slug === 'new') {
    return (
      <ProductPageWrapper onBack={handleBack} product={null}>
        <ProductCreate />
      </ProductPageWrapper>
    );
  }

  if (!product) notFound();

  if (isEdit) {
    return (
      <ProductPageWrapper onBack={handleBack} product={product}>
        <ProductUpdate product={product} />
      </ProductPageWrapper>
    );
  }

  return (
    <ProductPageWrapper onBack={handleBack} product={product}>
      <ProductDetail product={product} />
    </ProductPageWrapper>
  );
}
