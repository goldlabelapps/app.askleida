import React from 'react';
import { 
    Box, 
    Collapse,
    Container, 
    
    Stack,
} from '@mui/material';
import { getTimeGreeting } from '../../../Leida';
import { CleverText } from '../../../NX/DesignSystem';
import { usePractitioner } from '../Practitioner';
import TipsCTA from './TipsCTA';

const Greeting: React.FC = () => {
    const practitioner = usePractitioner();
    const [showTipsCTA, setShowTipsCTA] = React.useState(false);
    const tipsCtaDelayTimeoutRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        return () => {
            if (tipsCtaDelayTimeoutRef.current !== null) {
                window.clearTimeout(tipsCtaDelayTimeoutRef.current);
            }
        };
    }, []);

    if (practitioner?.loading) return null;

    const displayName =
        (practitioner?.data?.data?.display_name as string | undefined) ||
        (practitioner?.data?.display_name as string | undefined) ||
        null;
    const greetingText = displayName ? `${getTimeGreeting()}, ${displayName}` : getTimeGreeting();

    return (
        <Box sx={{ minHeight: 'calc(100vh - 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="xs">
                <Stack alignItems="center" textAlign="center" spacing={2}>
                    <CleverText 
                        options={{
                            id: 'greeting_welcome_message',
                            markdown: `# ${greetingText}`,
                            // animateOncePerSession: true,
                            onFinish: () => {
                                if (tipsCtaDelayTimeoutRef.current !== null) {
                                    window.clearTimeout(tipsCtaDelayTimeoutRef.current);
                                }
                                tipsCtaDelayTimeoutRef.current = window.setTimeout(() => {
                                    setShowTipsCTA(true);
                                }, 1000);
                                // console.log('Greeting message finished typing');
                            }
                        }}
                    />
                    <Collapse in={showTipsCTA} timeout={380} sx={{ width: '100%' }}>
                        <TipsCTA />
                    </Collapse>
                </Stack>
            </Container>
        </Box>
    );
};

export default Greeting;