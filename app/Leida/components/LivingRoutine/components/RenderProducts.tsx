import React from 'react';
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    MobileStepper,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { exampleProducts } from '..';

type Product = {
    name?: string;
    cadence?: string;
};

type RenderProductsProps = {
    products: Product[];
};

type ExampleProduct = {
    title?: string;
    data?: {
        name?: string;
        image?: string;
        category?: string;
        description?: string;
        awinRow?: {
            data?: {
                merchant_deep_link?: string;
                merchant_image_url?: string;
            };
        };
    };
};

const CARD_HEIGHT = 420;
const SWIPE_THRESHOLD_PX = 50;

const shorten = (value: string, max = 140): string => {
    if (value.length <= max) return value;
    return `${value.slice(0, max).trimEnd()}...`;
};

const RenderProducts: React.FC<RenderProductsProps> = () => {
    const theme = useTheme();
    const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
    const [canSwipeByTouch, setCanSwipeByTouch] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const touchStartX = React.useRef<number | null>(null);

    React.useEffect(() => {
        const touchCapable =
            typeof window !== 'undefined' &&
            ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        setCanSwipeByTouch(touchCapable);
    }, []);

    const productsData = Array.isArray(exampleProducts?.data)
        ? (exampleProducts.data as ExampleProduct[])
        : [];

    const maxSteps = productsData.length;
    const enableSwipe = isPhone && canSwipeByTouch && maxSteps > 1;
    const currentProduct = productsData[activeStep];

    const handleNext = () => {
        setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (event) => {
        if (!enableSwipe) return;
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
    };

    const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (event) => {
        if (!enableSwipe || touchStartX.current === null) return;

        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const deltaX = touchStartX.current - endX;
        touchStartX.current = null;

        if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
        if (deltaX > 0) handleNext();
        if (deltaX < 0) handleBack();
    };

    if (maxSteps === 0) {
        return (
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    No products available to display.
                </Typography>
            </Box>
        );
    }

    const title = currentProduct?.title || currentProduct?.data?.name || 'Untitled product';
    const description = shorten(currentProduct?.data?.description || '');
    const category = currentProduct?.data?.category || 'Uncategorized';
    const imageUrl =
        currentProduct?.data?.awinRow?.data?.merchant_image_url ||
        currentProduct?.data?.image ||
        'https://via.placeholder.com/1200x630?text=No+Image';
    const merchantLink = currentProduct?.data?.awinRow?.data?.merchant_deep_link;

    return (
        <Box
            sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
            }}
        >

            <Card
                variant="outlined"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                sx={{
                    height: CARD_HEIGHT,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <CardActionArea
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'stretch',
                        flexDirection: 'column',
                    }}
                    onClick={() => {
                        if (!merchantLink) return;
                        window.open(merchantLink, '_blank', 'noopener,noreferrer');
                    }}
                    disabled={!merchantLink}
                >
                    <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={title}
                        sx={{
                            height: 190,
                            objectFit: 'cover',
                            bgcolor: 'grey.100',
                        }}
                    />

                    <CardContent
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Chip label={category} size="small" sx={{ alignSelf: 'flex-start' }} />

                        <Typography variant="subtitle1">
                            {title}
                        </Typography>

                        <Typography variant="body2">
                            {description || 'No description available.'}
                        </Typography>

                        <Typography variant="caption" sx={{ mt: 'auto' }}>
                            {merchantLink
                                ? 'Tap card to open product link'
                                : 'No product link available'}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>

            <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{
                    mt: 1,
                    px: 0,
                    bgcolor: 'transparent',
                }}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                        Next
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Back
                    </Button>
                }
            />

            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                {enableSwipe
                    ? 'Swipe left or right on the card to browse products.'
                    : 'Use Back/Next buttons to browse products.'}
            </Typography>
        </Box>
    );
};

export default RenderProducts;
