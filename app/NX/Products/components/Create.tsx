"use client";
import React, { useState } from 'react';
import { useDispatch } from '../../../NX/Uberedux';
import { T_Product } from '../exampleProduct';
import { createProduct } from '../actions/createProduct';
import { Button, TextField, Box, Typography } from '@mui/material';

const initialState: Partial<T_Product> = {
  title: '',
  description: '',
  brand: '',
  price: undefined,
};

export default function Create() {
  const dispatch = useDispatch();
  const [form, setForm] = useState<Partial<T_Product>>(initialState);
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
    dispatch(createProduct(form as T_Product));
    setSuccess(true);
    setForm(initialState);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2}>Create Product</Typography>
      <TextField
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
        inputProps={{ minLength: 5 }}
      />
      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Brand"
        name="brand"
        value={form.brand}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        name="price"
        type="number"
        value={form.price ?? ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {error && <Typography color="error" mt={1}>{error}</Typography>}
      {success && <Typography color="primary" mt={1}>Product created!</Typography>}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
}
