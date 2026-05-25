"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Box, Typography, AppBar, Toolbar, IconButton, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ProductDetail } from '../../NX/Products';
import { useDispatch } from '../../NX/Uberedux';
import { navigateTo } from '../../NX/DesignSystem';
import { useRouter } from 'next/navigation';

export default function ProductSlugPage() {

    const dispatch = useDispatch();
    const router = useRouter();
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!slug) return;
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data.data); // Only set the product data
          setLoading(false);
        });
    }, [slug]);

    if (loading) return <Box p={4}><Typography>Loading...</Typography></Box>;
    if (!product) return <Box p={4}><Typography>Product not found.</Typography></Box>;


    return (
        <Container id="main" maxWidth="md">
          <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.push('/products')}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Product Details
              </Typography>
              {/* Add more action buttons here if needed */}
            </Toolbar>
          </AppBar>
          <ProductDetail product={product} />
        </Container>

    );
  }

/*
<pre>
  {JSON.stringify(product, null, 2)}
</pre>
*/