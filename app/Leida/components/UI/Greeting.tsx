import React from 'react';
import { gsap } from 'gsap';
import { 
    Box, 
    Collapse,
    Container, 
    
    Stack,
} from '@mui/material';
import { getTimeGreeting } from '../../../Leida';
import { CleverText } from '../../../NX/DesignSystem';
import { usePractitioner } from '../Practitioner';
import GameMenu from './GameMenu';

const Greeting: React.FC = () => {
    const practitioner = usePractitioner();
    const [showGameMenu, setShowGameMenu] = React.useState(false);
    const gameMenuDelayTimeoutRef = React.useRef<number | null>(null);
    const gameMenuAnimationFrameRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        return () => {
            if (gameMenuDelayTimeoutRef.current !== null) {
                window.clearTimeout(gameMenuDelayTimeoutRef.current);
            }

            if (gameMenuAnimationFrameRef.current !== null) {
                window.cancelAnimationFrame(gameMenuAnimationFrameRef.current);
            }

            gsap.killTweensOf('#game_menu_box');
        };
    }, []);

    React.useEffect(() => {
        if (!showGameMenu) {
            return;
        }

        gameMenuAnimationFrameRef.current = window.requestAnimationFrame(() => {
            gsap.fromTo(
                '#game_menu_box',
                {
                    opacity: 0,
                    scaleX: 0.72,
                    scaleY: 0.86,
                    transformOrigin: 'center center',
                },
                {
                    opacity: 1,
                    scaleX: 1.06,
                    scaleY: 1.02,
                    duration: 0.22,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.to('#game_menu_box', {
                            scaleX: 1,
                            scaleY: 1,
                            duration: 0.12,
                            ease: 'power1.out',
                        });
                    },
                },
            );
        });

        return () => {
            if (gameMenuAnimationFrameRef.current !== null) {
                window.cancelAnimationFrame(gameMenuAnimationFrameRef.current);
            }
            gsap.killTweensOf('#game_menu_box');
        };
    }, [showGameMenu]);

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
                                if (gameMenuDelayTimeoutRef.current !== null) {
                                    window.clearTimeout(gameMenuDelayTimeoutRef.current);
                                }
                                gameMenuDelayTimeoutRef.current = window.setTimeout(() => {
                                    setShowGameMenu(true);
                                }, 1000);
                                // console.log('Greeting message finished typing');
                            }
                        }}
                    />
                    <Box sx={{ width: '100%', position: 'relative' }}>
                        <Collapse in={showGameMenu} timeout={380} sx={{ width: '100%', position: 'relative', zIndex: 2 }}>
                            <Box id="game_menu_box">
                                <GameMenu />
                            </Box>
                        </Collapse>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default Greeting;