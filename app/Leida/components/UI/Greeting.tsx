import React from 'react';
import { 
    Box, 
    Container, 
    
    Stack,
} from '@mui/material';
import { getTimeGreeting } from '../../../Leida';
import { CleverText } from '../../../NX/DesignSystem';
import { usePractitioner } from '../Practitioner';

const Greeting: React.FC = () => {
    const practitioner = usePractitioner();

    if (practitioner?.loading) return null;

    const displayName =
        (practitioner?.data?.data?.display_name as string | undefined) ||
        (practitioner?.data?.display_name as string | undefined) ||
        null;
    const greetingText = displayName ? `${getTimeGreeting()}, ${displayName}` : getTimeGreeting();

    return (
        <Box sx={{ minHeight: 'calc(100vh - 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="xs">
                <Stack alignItems="center" textAlign="center">
                    <CleverText 
                        options={{
                            id: 'greeting_welcome_message',
                            markdown: `# ${greetingText}`,
                            animateOncePerSession: true,
                            onFinish: () => {
                                console.log('Greeting message finished typing');
                            }
                        }}
                    />
                </Stack>
            </Container>
        </Box>
    );
};

export default Greeting;