"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Grid,
    Alert,
    Button,
    Collapse,
    Fab,
    Typography,
    CardActions,
    CardContent,
    CardHeader,
    Stack,
} from '@mui/material';
import { Icon, navigateTo } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { useSupabaseAuth } from '../../../../NX/Paywall';
import { Editable } from '../../../../Leida';
import { createProduct } from '../../Products';

type T_ProductNewProps = {
    config?: unknown;
};

type T_FormState = {
    name: string;
    category: string;
    sku: string;
    price: string;
    description: string;
    notes: string;
};

const initialForm: T_FormState = {
    name: '',
    category: '',
    sku: '',
    price: '',
    description: '',
    notes: '',
};

const parsePrice = (value: string): number | null => {
    const cleaned = value.trim();
    if (!cleaned) {
        return null;
    }

    const parsed = Number(cleaned);
    if (!Number.isFinite(parsed) || parsed < 0) {
        return null;
    }

    return parsed;
};

const ProductNew: React.FC<T_ProductNewProps> = ({ config }) => {
    void config;

    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSupabaseAuth();
    const [form, setForm] = React.useState<T_FormState>(initialForm);
    const [error, setError] = React.useState<string | null>(null);
    const [submitting, setSubmitting] = React.useState(false);
    const price = parsePrice(form.price);
    const isFormComplete = form.name.trim().length > 0 && price !== null;

    const handleChange =
        (key: keyof T_FormState) =>
            (value: string) => {
                setForm((current) => ({ ...current, [key]: value }));
            };

    const handleBack = () => {
        dispatch(navigateTo(router, '/products'));
    };

    const handleSubmit = async () => {
        const name = form.name.trim();
        const category = form.category.trim();
        const sku = form.sku.trim();
        const description = form.description.trim();
        const notes = form.notes.trim();
        const parsedPrice = parsePrice(form.price);

        if (!name) {
            setError('Product name is required.');
            return;
        }

        if (parsedPrice === null) {
            setError('Price must be a valid number greater than or equal to 0.');
            return;
        }
        try {
            setSubmitting(true);
            setError(null);

            const newProductId = await dispatch(createProduct({
                practitioner_id: user?.id ?? null,
                title: name,
                name,
                category: category || null,
                sku: sku || null,
                price: parsedPrice,
                description: description || null,
                notes: notes || null,
                data: {
                    name,
                    category: category || null,
                    sku: sku || null,
                    price: parsedPrice,
                    description: description || null,
                    notes: notes || null,
                },
            }));

            dispatch(navigateTo(router, newProductId ? `/products/${newProductId}` : '/products'));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <CardHeader 
                avatar={<>
                    <Icon icon="products" color="primary" />
                </>}
                title={<Typography variant="h6">
                    New Product
                </Typography>}  />
            <CardContent>
                <Stack spacing={2}>
                    {error ? <Alert severity="error">{error}</Alert> : null}
                    
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <Editable
                                variant="outlined"
                                label="Name"
                                value={form.name}
                                onChange={handleChange('name')}
                                required
                                autoFocus
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Editable
                                variant="outlined"
                                label="Category"
                                value={form.category}
                                onChange={handleChange('category')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Editable
                                variant="outlined"
                                label="SKU"
                                value={form.sku}
                                onChange={handleChange('sku')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Editable
                                variant="outlined"
                                label="Price"
                                value={form.price}
                                onChange={handleChange('price')}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Editable
                                variant="outlined"
                                label="Description"
                                value={form.description}
                                multiline
                                minRows={3}
                                onChange={handleChange('description')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Editable
                                variant="outlined"
                                label="Notes"
                                value={form.notes}
                                multiline
                                minRows={2}
                                onChange={handleChange('notes')}
                            />
                        </Grid>
                        
                    </Grid>
                    
                    
                    
                    
                </Stack>
            </CardContent>
            <Collapse in={isFormComplete || submitting} unmountOnExit>
                <Box
                    sx={{
                        position: 'fixed',
                        right: { xs: 16, sm: 24 },
                        bottom: { xs: 16, sm: 24 },
                        zIndex: (theme) => theme.zIndex.appBar + 1,
                    }}
                >
                    <Fab
                        color="primary"
                        disabled={submitting}
                        onClick={handleSubmit}
                    >
                        <Icon icon="save" />
                    </Fab>
                </Box>
            </Collapse>
            <CardActions>
                <Button
                    fullWidth
                    startIcon={<Icon icon="left" />}
                    variant="text"
                    onClick={handleBack}
                >
                    Back
                </Button>
            </CardActions>
        </Box>
    );
};

export default ProductNew;
