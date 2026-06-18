"use client";
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
import { useAccount } from '../Account';
import { ClientDash } from '../../';
import { Fade } from '@mui/material';

const Greeting: React.FC = () => {
    const account = useAccount();
    const [showGameMenu, setShowGameMenu] = React.useState(false);
    const [showCleverText, setShowCleverText] = React.useState(true);
    const gameMenuDelayTimeoutRef = React.useRef<number | null>(null);
    const gameMenuAnimationFrameRef = React.useRef<number | null>(null);
    const hideOnceRef = React.useRef(false);

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
                            onComplete: () => {
                                if (!hideOnceRef.current) {
                                    hideOnceRef.current = true;
                                    setShowCleverText(false);
                                }
                            },
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

    if (account?.loading) return null;

    const accountRows = Array.isArray(account?.data) ? account.data : [];
    const firstRow = accountRows[0] as Record<string, unknown> | undefined;
    const profile =
        firstRow && typeof firstRow.data === 'object' && firstRow.data !== null
            ? (firstRow.data as Record<string, unknown>)
            : firstRow;
    const displayName =
        typeof profile?.display_name === 'string' && profile.display_name.trim()
            ? profile.display_name.trim()
            : typeof firstRow?.title === 'string' && firstRow.title.trim()
                ? firstRow.title.trim()
                : null;
    const greetingText = displayName ? `${getTimeGreeting()}, ${displayName}` : getTimeGreeting();

    return (
        <Box sx={{ minHeight: 'calc(100vh - 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="xs">
                <Stack alignItems="center" textAlign="center" spacing={2}>
                    <Fade in={showCleverText} timeout={320} unmountOnExit>
                        <div>
                            <CleverText
                                options={{
                                    id: 'greeting_welcome_message',
                                    markdown: `# ${greetingText}`,
                                    onFinish: () => {
                                        if (gameMenuDelayTimeoutRef.current !== null) {
                                            window.clearTimeout(gameMenuDelayTimeoutRef.current);
                                        }
                                        gameMenuDelayTimeoutRef.current = window.setTimeout(() => {
                                            setShowGameMenu(true);
                                        }, 1000);
                                    },
                                }}
                            />
                        </div>
                    </Fade>
                    <Box sx={{ width: '100%', position: 'relative' }}>
                        <Collapse 
                            in={showGameMenu} 
                            timeout={380} 
                            sx={{ 
                                width: '100%', 
                                position: 'relative', 
                                zIndex: 2,
                                border: '1px solid red',
                                textAlign: 'left',
                            }}>
                            <Box id="game_menu_box">
                                <ClientDash />
                            </Box>
                        </Collapse>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default Greeting;