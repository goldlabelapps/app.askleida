'use client';
import type {I_Product} from '../types';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import type { FC } from 'react';
import {
    Card,
    CardHeader,
    Typography,
    Grid,
    CardActionArea,
    Collapse,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Thumbnail } from '../../Products';
import he from 'he';

const Product: FC<I_Product> = (data) => {
    // console.log('data', data);
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        title,
        price,
        image_url,
    } = data || {};

    const decodedtitle = title ? he.decode(title) : '';

    const [open, setOpen] = React.useState(false);
    const handleCardClick = () => {
        setOpen((prev) => !prev);
    };
    
    return (
        <Card variant="outlined" sx={{ width: '100%' }}>
            <CardActionArea onClick={handleCardClick}>
                <CardHeader
                    sx={{ width: '100%' }}
                    title={<Typography variant="h6" sx={{ textAlign: 'left' }} color="text.secondary">
                        {decodedtitle}
                    </Typography>}
                    subheader={
                        <>
                            <Typography variant="subtitle1" sx={{ mb: 1 }} color="text.secondary">
                                {data.description}
                            </Typography>
                        </>
                    }
                />
            </CardActionArea>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container spacing={2}>
                {image_url && (
                    <Grid
                        size={{ xs: 12, sm: 6 }}
                        sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', sm: 'flex-start' },
                        mb: { xs: 2, sm: 0 },
                        
                    }}>
                        <Thumbnail src={image_url as string} alt={decodedtitle} size={'100%'} />
                    </Grid>
                )}
                <Grid 
                    size={{ xs: 12, sm: 6 }} >
                    
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {data.slug && (
                            <li><Typography variant="body2"><b>Slug:</b> {data.slug}</Typography></li>
                        )}
                        {data.brand && (
                            <li><Typography variant="body2"><b>Brand:</b> {data.brand}</Typography></li>
                        )}
                        {data.routine_step && (
                            <li><Typography variant="body2"><b>Routine Step:</b> {data.routine_step}</Typography></li>
                        )}
                        {data.treat_sublabel && (
                            <li><Typography variant="body2"><b>Treat Sublabel:</b> {data.treat_sublabel}</Typography></li>
                        )}
                        {data.distribution_type && (
                            <li><Typography variant="body2"><b>Distribution Type:</b> {data.distribution_type}</Typography></li>
                        )}
                        {data.website_url && (
                            <li><Typography variant="body2"><b>Website:</b> <a href={data.website_url} target="_blank" rel="noopener noreferrer">{data.website_url}</a></Typography></li>
                        )}
                        {data.claude_description && (
                            <li><Typography variant="body2"><b>Claude Description:</b> {data.claude_description}</Typography></li>
                        )}
                        {data.how_to_apply && (
                            <li><Typography variant="body2"><b>How to Apply:</b> {data.how_to_apply}</Typography></li>
                        )}
                        {data.active_ingredients && (
                            <li><Typography variant="body2"><b>Active Ingredients:</b> {data.active_ingredients}</Typography></li>
                        )}
                        {data.contraindications && (
                            <li><Typography variant="body2"><b>Contraindications:</b> {data.contraindications}</Typography></li>
                        )}
                        {typeof data.is_pregnancy_safe === 'boolean' && (
                            <li><Typography variant="body2"><b>Pregnancy Safe:</b> {data.is_pregnancy_safe ? 'Yes' : 'No'}</Typography></li>
                        )}
                        {typeof data.is_breastfeeding_safe === 'boolean' && (
                            <li><Typography variant="body2"><b>Breastfeeding Safe:</b> {data.is_breastfeeding_safe ? 'Yes' : 'No'}</Typography></li>
                        )}
                        {Array.isArray(data.skin_type_tags) && data.skin_type_tags.length > 0 && (
                            <li><Typography variant="body2"><b>Skin Types:</b> {data.skin_type_tags.join(', ')}</Typography></li>
                        )}
                        {Array.isArray(data.concern_tags) && data.concern_tags.length > 0 && (
                            <li><Typography variant="body2"><b>Concerns:</b> {data.concern_tags.join(', ')}</Typography></li>
                        )}
                        {data.image_url && (
                            <li><Typography variant="body2"><b>Image:</b> <a href={data.image_url} target="_blank" rel="noopener noreferrer">View</a></Typography></li>
                        )}
                        {typeof data.is_verified === 'boolean' && (
                            <li><Typography variant="body2"><b>Verified:</b> {data.is_verified ? 'Yes' : 'No'}</Typography></li>
                        )}
                        {typeof data.is_seeded === 'boolean' && (
                            <li><Typography variant="body2"><b>Seeded:</b> {data.is_seeded ? 'Yes' : 'No'}</Typography></li>
                        )}
                        
                    </ul>

                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        {typeof price === 'number'
                            ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price)
                            : '--'}
                    </Typography>

                </Grid>
            </Grid>
            </Collapse>
        </Card>
    );
};

export default Product;

