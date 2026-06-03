
'use client';

import * as React from 'react';
import {
    Box,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Stack,
    type SelectChangeEvent,
} from '@mui/material';
import { Icon } from '../../../../NX/DesignSystem';
import { useDispatch } from '../../../../NX/Uberedux';
import { setTips, useTips } from '..';

export default function TipCategories() {
    const dispatch = useDispatch();
    const tips = useTips();
    const categories = tips?.categories;
    const selectedCategory = typeof tips?.category === 'string' ? tips.category : '';

    if (!Array.isArray(categories)) return null;

    const handleChange = (event: SelectChangeEvent<string>) => {
        const nextCategory = event.target.value;
        dispatch(setTips('category', nextCategory));
    };

    const handleClear = () => {
        dispatch(setTips('category', ''));
    };

    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0, minWidth: 200 }}>
            <FormControl fullWidth>
                <Select
                    id="tip-categories"
                    value={selectedCategory}
                    onChange={handleChange}
                    variant="standard"
                    displayEmpty={true}
                >
                    <MenuItem value="">
                        <em>All categories</em>
                    </MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={String(category)} value={String(category)}>
                            {String(category)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedCategory && (
                <Box sx={{ mt: 2 }}>
                    <IconButton
                        color="primary"
                        onClick={handleClear}
                        aria-label="Clear selected category"
                    >
                        <Icon icon="cancel" />
                    </IconButton>
                </Box>
            )}
            
        </Stack>
    );
}