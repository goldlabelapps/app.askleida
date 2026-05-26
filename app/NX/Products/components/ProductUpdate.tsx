"use client";
import React, { useState } from 'react';
import { useDispatch } from '../../../NX/Uberedux';
import type { I_Product } from '../types.d.ts';
import { createProduct } from '../../Products';

import { Icon } from '../../DesignSystem';
import { Button, TextField, Box, Typography } from '@mui/material';

const initialState: Partial<I_Product> = {
  title: '',
};


interface ProductUpdateProps {
  product?: Partial<I_Product>;
  onCreated?: (slug: string) => void;
}

export default function ProductUpdate({ product, onCreated }: ProductUpdateProps) {
  const dispatch = useDispatch();
  const [form, setForm] = useState<Partial<I_Product>>(product || initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!form.title || form.title.length < 5) {
      setError('Title is required and must be at least 5 characters.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Auto-generate slug from title, max 40 chars
    let slug = form.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || '';
    const MAX_SLUG_LENGTH = 40;
    if (slug.length > MAX_SLUG_LENGTH) {
      slug = slug.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '');
    }
    dispatch(createProduct({ ...form, slug } as I_Product));
    setSuccess(true);
    setForm(initialState);
    if (onCreated) onCreated(slug);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{  }}>
      <TextField
        autoFocus
        label="Title"
        name="title"
        variant="standard"
        value={form.title}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        inputProps={{ minLength: 5 }}
      />
      {error && <Typography color="error" mt={1}>{error}</Typography>}
      {success && <Typography color="primary" mt={1}>Product created!</Typography>}
      <Button 
        fullWidth
        type="submit"
        color="primary" 
        sx={{ mt: 2 }}
        startIcon={<Icon icon="tick" />}
      >
        Create Product 
      </Button>
    </Box>
  );
}
