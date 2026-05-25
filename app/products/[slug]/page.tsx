"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";


export default function ProductSlugPage() {

    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!slug) return;
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        });
    }, [slug]);

    if (loading) return <Box p={4}><Typography>Loading...</Typography></Box>;
    if (!product) return <Box p={4}><Typography>Product not found.</Typography></Box>;

    return (
      <Box p={4}>
        <Typography variant="h5" mb={2}>Product: {slug}</Typography>
        <pre>
          {JSON.stringify(product, null, 2)}
        </pre>
      </Box>
    );
  }
