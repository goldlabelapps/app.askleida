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
import { AnimateFlashLogo, LightningBolt, MovieClip } from '../../../NX/Flash';
import { usePractitioner } from '../Practitioner';
import GameMenu from './GameMenu';

const Greeting: React.FC = () => {
    const practitioner = usePractitioner();
    const [showGameMenu, setShowGameMenu] = React.useState(false);
    const [showLightning, setShowLightning] = React.useState(false);
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

            gsap.killTweensOf('#game_menu_lightning');
            gsap.killTweensOf('#game_menu_box');
        };
    }, []);

    React.useEffect(() => {
        if (!showGameMenu) {
            return;
        }

        setShowLightning(true);

        gameMenuAnimationFrameRef.current = window.requestAnimationFrame(() => {
            const flashAnim = new AnimateFlashLogo('game_menu_box', () => {
                gsap.to('#game_menu_lightning', {
                    opacity: 0,
                    duration: 0.25,
                    ease: 'power1.out',
                    onComplete: () => setShowLightning(false),
                });
            });

            flashAnim.init();

            gsap.fromTo(
                '#game_menu_lightning',
                {
                    opacity: 0,
                    scale: 0.5,
                    rotate: -20,
                    filter: 'brightness(2)',
                },
                {
                    opacity: 0.9,
                    scale: 1.15,
                    rotate: 15,
                    duration: 0.16,
                    yoyo: true,
                    repeat: 3,
                    ease: 'power2.inOut',
                },
            );
        });

        return () => {
            if (gameMenuAnimationFrameRef.current !== null) {
                window.cancelAnimationFrame(gameMenuAnimationFrameRef.current);
            }
            gsap.killTweensOf('#game_menu_lightning');
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
                        {showLightning ? (
                            <MovieClip
                                id="game_menu_lightning"
                                width={180}
                                height={240}
                                pos="top-middle"
                                zIndex={3}
                                style={{ pointerEvents: 'none', opacity: 0 }}
                            >
                                <LightningBolt />
                            </MovieClip>
                        ) : null}
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