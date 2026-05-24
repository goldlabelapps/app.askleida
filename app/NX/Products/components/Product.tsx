'use client';
import type {I_Product} from '../types';
import * as React from 'react';
import type { FC } from 'react';
import {
    Card,
    CardHeader,
    Typography,
    ButtonBase,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useDispatch } from '../../../NX/Uberedux';
import { Icon } from '../../DesignSystem';
import { Thumbnail } from '../../Products';
import he from 'he';


const Product: FC<I_Product> = (data) => {
    // console.log('data', data);
    const dispatch = useDispatch();

    const {
        name,
        price,
        image_url,
    } = data || {};

    const decodedName = name ? he.decode(name) : '';
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <>
            <ButtonBase
                sx={{width: '100%', textAlign: 'left', my: 0.5 }}
                onClick={() => setOpen(true)}
            >
                <Card 
                    variant="outlined"
                    sx={{ width: '100%', 
                        backgroundColor: theme.palette.background.default, 
                        bProductColor: theme.palette.divider }}
                >
                    <CardHeader 
                        // avatar={<Icon icon="Products" color="primary"/>}
                        title={decodedName}
                        subheader={<Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                            {typeof price === 'number' ?
                                new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price)
                                : '--'}
                        </Typography>}
                        action={<Thumbnail src={image_url as string} alt={decodedName} size={50}/>} 
                    />
                </Card>
            </ButtonBase>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" 
            fullWidth fullScreen={isMobile}>
                <DialogContent>
                    <div style={{ display: 'flex', justifyContent: 'center', 
                        marginBottom: 16 }}>
                        <Thumbnail src={image_url as string} 
                        alt={decodedName} size={120} />
                    </div>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                    {/* Product details or additional content can go here if needed */}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                        color="primary">
                        Close
                    </Button>

                    <Button
                        onClick={() => setOpen(false)}
                        color="primary"
                        startIcon={<Icon icon="left" />}
                        variant="outlined">
                        Previous
                    </Button>

                    <Button
                        onClick={() => setOpen(false)}
                        color="primary"
                        startIcon={<Icon icon="right" />}
                        variant="outlined">
                        Next
                    </Button>
                    
                    <Button
                        onClick={() => setOpen(false)}
                        color="primary"
                        startIcon={<Icon icon="heart" />}
                        variant="outlined">
                        WishList
                    </Button>
                    
                    <Button
                        onClick={() => setOpen(false)}
                        color="primary"
                        startIcon={<Icon icon="products" />}
                        variant="contained">
                        Buy
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    );
};

export default Product;

