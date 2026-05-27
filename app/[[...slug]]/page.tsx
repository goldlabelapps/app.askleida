"use client"; 
import type { I_NestedNav, T_Tenant, T_Frontmatter } from '../NX/types';
import { notFound } from "next/navigation";
import { Metadata } from "next";
// Removed duplicate Box import
import { NX } from '../NX';
import {
    Icon,
} from '../NX/DesignSystem';
import {
    Dashboard,
} from '../NX/Dashboard';
import { RenderMarkdown } from '../NX/Shortcodes';

import Image from 'next/image';
import Link from 'next/link';
import {
    Box,
    Typography,
    Button,
    Grid,
    TextField,
    useTheme,
    Container,
    Stack,
} from '@mui/material';

const assets = '/askleida/landingpage/assets';

export default function Page() {
    const theme = useTheme();
    return (
        <Box sx={{ bgcolor: 'var(--cream)', color: 'var(--ink)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
            {/* Persistent background */}
            <Box className="site-bg" sx={{ position: 'fixed', inset: 0, zIndex: -2, backgroundImage: `url(${assets}/bg.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} aria-hidden="true" />

            {/* NAV */}
            <Box component="nav" className="site-nav" sx={{ position: 'sticky', top: 16, zIndex: 50, maxWidth: 'var(--max-w)', mx: 'auto', mt: 2, px: 3 }}>
                <Box className="nav-inner" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '14px 22px', bgcolor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 999, boxShadow: 'var(--glass-shadow)', backdropFilter: 'blur(20px) saturate(140%)' }}>
                    <Image src={`${assets}/logo-dark.svg`} alt="Leida" width={110} height={22} style={{ height: 22, width: 'auto' }} />
                    <Button component="a" href="#founding" className="nav-cta" sx={{ fontSize: 13, fontWeight: 500, bgcolor: 'var(--ink)', color: 'var(--cream)', borderRadius: 999, px: 2.5, py: 1, '&:hover': { bgcolor: '#1f1f1d' } }}>Become a founding member</Button>
                </Box>
            </Box>

            {/* HERO */}
            <Box component="header" className="hero" sx={{ pt: 10, pb: 12, textAlign: 'center', position: 'relative' }}>
                <Container maxWidth="md">
                    <Typography className="eyebrow" sx={{ display: 'inline-block', fontSize: 12, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-70)', bgcolor: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: 999, mb: 4, px: 3, py: 1 }}>For solo skin therapists</Typography>
                    <Typography variant="h1" sx={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: { xs: 36, md: 54, lg: 64 }, lineHeight: 1.08, letterSpacing: '-0.01em', maxWidth: 900, mx: 'auto', mb: 3, color: 'var(--ink)' }}>
                        Clinic hours are over but you're sat on your sofa writing homecare.<br />
                        <strong style={{ fontWeight: 600 }}>Sound familiar?</strong>
                    </Typography>
                    <Typography className="lede" sx={{ display: 'inline-block', fontSize: { xs: 16, md: 19 }, lineHeight: 1.55, color: 'var(--ink-90)', maxWidth: 640, mx: 'auto', my: 3, fontWeight: 400, px: 4, py: 2.5, bgcolor: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-md)', boxShadow: 'var(--glass-shadow)' }}>
                        Leida is the assistant designed for solo skin therapists. She turns your post-appointment WhatsApp into a beautiful, personalised PDF, in your voice… in under two minutes.
                    </Typography>
                    <Stack className="cta-stack" spacing={1.5} alignItems="center" mt={3}>
                        <Button component="a" href="https://buy.stripe.com/cNicN56eh4DHdhs0A6ew801" className="btn btn-primary" sx={{ bgcolor: 'var(--ink)', color: 'var(--cream)', borderRadius: 999, px: 4, py: 2, fontWeight: 500, fontSize: 15, boxShadow: '0 4px 16px rgba(44,44,42,0.18)', '&:hover': { bgcolor: '#1f1f1d', boxShadow: '0 8px 24px rgba(44,44,42,0.22)' } }}>
                            Become a founding member <span style={{ marginLeft: 6 }}>→</span>
                        </Button>
                        <Typography className="micro" sx={{ fontSize: 13, color: 'var(--ink-50)' }}>50 founding spots. £29/month, yours forever.</Typography>
                        <Typography className="micro" sx={{ fontSize: 13, color: 'var(--ink-50)' }}>Or <Link href="#waitlist" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>join the waitlist</Link> →</Typography>
                    </Stack>
                </Container>
            </Box>

            {/* SECTION 2 — PRODUCT PROOF */}
            <Box component="section" id="proof" sx={{ py: 12 }}>
                <Container>
                    <Grid container spacing={7} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box className="pdf-carousel" sx={{ width: '100%', maxWidth: 380, mx: 'auto' }}>
                                <Box className="pdf-stack" sx={{ position: 'relative', p: 2 }}>
                                    <Box className="pdf-paper-back pdf-paper-back-2" sx={{ position: 'absolute', inset: '22px 6px 4px 32px', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 0, borderRadius: 2 }} />
                                    <Box className="pdf-paper-back pdf-paper-back-1" sx={{ position: 'absolute', inset: '14px 16px 12px 22px', bgcolor: 'rgba(255,255,255,0.92)', zIndex: 1, borderRadius: 2 }} />
                                    <Box className="pdf-viewer" sx={{ position: 'relative', zIndex: 2, aspectRatio: '1 / 1.414', bgcolor: 'var(--white)', overflow: 'hidden', boxShadow: '0 30px 60px -20px rgba(44,44,42,0.28), 0 18px 36px -18px rgba(44,44,42,0.18)', borderRadius: 2 }}>
                                        <Image src={`${assets}/pdf-page-1.png`} alt="Page 1 of sample homecare recommendation" width={320} height={452} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                                    </Box>
                                </Box>
                                <Typography className="pdf-hint" sx={{ textAlign: 'center', mt: 2, fontSize: 13, color: 'var(--ink-50)', fontStyle: 'italic' }}>Click or swipe through to see each page of the sample recommendation.</Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box className="proof-copy">
                                <Typography variant="h2" className="section-title" sx={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: { xs: 30, md: 40 }, mb: 2 }}>Here's what your client receives.</Typography>
                                <Typography sx={{ fontSize: 17, color: 'var(--ink-70)', mb: 2 }}><strong style={{ color: 'var(--ink)' }}>Every paragraph is written from scratch for your client.</strong> Her skin, her concerns, the context you give Leida.</Typography>
                                <Typography sx={{ fontSize: 17, color: 'var(--ink-70)', mb: 2 }}>Whatever's going on in her life, whether that's a wedding, a flare-up, a holiday, or a new baby, Leida weaves it through.</Typography>
                                <Typography sx={{ fontSize: 17, color: 'var(--ink-70)' }}><strong style={{ color: 'var(--ink)' }}>It feels like you spent an hour on it. It took two minutes.</strong></Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* RECOGNITION */}
            <Box className="recognition" sx={{ py: 10, textAlign: 'center' }}>
                <Container>
                    <Typography className="recognition-lede" sx={{ maxWidth: 720, mx: 'auto', mb: 4, fontSize: { xs: 16, md: 19 }, color: 'var(--ink-70)' }}>
                        Whether you're firing off WhatsApps and hoping your clients actually read them, or spending an hour on Canva making something you're actually proud of, you already know this part of the job takes too long.
                    </Typography>
                    <Typography className="recognition-headline" variant="h2" sx={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: { xs: 44, md: 60, lg: 88 }, lineHeight: 1, color: 'var(--ink)', mb: 4 }}>
                        Leida does it in <em style={{ fontStyle: 'italic', fontWeight: 400 }}>two&nbsp;minutes.</em>
                    </Typography>
                    <Stack className="recognition-stamps" direction="row" spacing={2} justifyContent="center" sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: 500, color: 'var(--ink)' }}>
                        <span>Beautiful enough to be proud of.</span>
                        <span>Fast enough to do between clients.</span>
                    </Stack>
                </Container>
            </Box>

            {/* DEMO */}
            <Box component="section" className="tight" sx={{ py: 7 }}>
                <Container>
                    <Grid container spacing={8} alignItems="center" justifyContent="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box className="glass demo-row" sx={{ display: 'flex', alignItems: 'center', gap: 8, p: { xs: 3, md: 8 }, borderRadius: 'var(--r-xl)', bgcolor: 'var(--glass-bg)', boxShadow: 'var(--glass-shadow)' }}>
                                <Box className="demo-text" sx={{ flex: '1 1 320px', minWidth: 280, maxWidth: 420 }}>
                                    <Typography variant="h3" sx={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: { xs: 28, md: 32, lg: 38 }, mb: 2 }}>Watch her work.</Typography>
                                    <Typography sx={{ fontSize: 16, color: 'var(--ink-70)' }}>She can turn your expertise into a finished PDF in less than the time it takes to make your coffee.</Typography>
                                </Box>
                                <Box className="phone-mock" sx={{ position: 'relative', width: 280, aspectRatio: '9 / 19.5', borderRadius: 44, p: 1.25, bgcolor: 'var(--ink)', boxShadow: '0 30px 70px -20px rgba(44,44,42,0.4), 0 0 0 1px rgba(255,255,255,0.06) inset', flexShrink: 0 }}>
                                    <Box sx={{ position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)', width: 80, height: 6, bgcolor: '#0a0a0a', borderRadius: 6, zIndex: 2 }} />
                                    <video src={`${assets}/demo.mp4`} poster={`${assets}/demo-poster.jpg`} preload="none" playsInline controls style={{ width: '100%', height: '100%', borderRadius: 36, background: 'var(--cream)' }} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* FOUNDER */}
            <Box component="section" id="founder" sx={{ py: 12 }}>
                <Container>
                    <Grid container spacing={8} alignItems="center">
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box className="founder-photo" sx={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', aspectRatio: '4/5', bgcolor: 'var(--ink)', boxShadow: '0 20px 50px -20px rgba(44,44,42,0.3)' }}>
                                <Image src={`${assets}/millie.png`} alt="Millie, founder of Leida" width={320} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) contrast(1.02)' }} />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Box className="founder-copy">
                                <Typography variant="h2" className="section-title" sx={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: { xs: 30, md: 40 }, mb: 2 }}>Built for skin therapists, <em style={{ fontStyle: 'italic', fontWeight: 300 }}>by a skin therapist.</em></Typography>
                                <Typography sx={{ fontSize: 17, color: 'var(--ink-70)', mb: 2 }}>Hi, I'm Millie. I trained as a skin therapist to do work I loved and create a career where I could spend time with my young family. I loved the work. What I didn't love was how much time I spent on my phone doing the admin that running a small business requires.</Typography>
                                <Typography sx={{ fontSize: 17, color: 'var(--ink-70)', mb: 2 }}>One of the biggest drains was homecare. Being a perfectionist, and knowing how vital aftercare was to my results, I'd sometimes spend 30 minutes putting recommendations together for one client. And even after all that time, it was still just random links and a WhatsApp message.</Typography>
                                <Typography sx={{ fontSize: 17, color: 'var(--ink-70)', mb: 2 }}>So I set to work while the toddler slept, armed with an iPad and a mission.</Typography>
                                <Typography className="sig" sx={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink)', mt: 1 }}>Leida was born.</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* FOUNDING MEMBER */}
            <Box component="section" id="founding" sx={{ py: 12 }}>
                <Container>
                    <Box className="founding-intro" sx={{ maxWidth: 720, mx: 'auto', mb: 8, textAlign: 'center' }}>
                        <Typography variant="h2" className="section-title center" sx={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: { xs: 26, md: 36 }, mb: 2 }}>A tool built from the inside.</Typography>
                        <Typography sx={{ fontSize: 17, color: 'var(--ink-70)', mb: 2 }}>Most tools built for practitioners weren't built by one. They were built by people who looked at the industry from the outside and guessed at what was needed.</Typography>
                        <Typography sx={{ fontSize: 17, color: 'var(--ink-70)', mb: 2 }}><strong style={{ color: 'var(--ink)' }}>Leida is different.</strong> I've sat where you sit. I know the paperwork, the anxiety, the late nights, the unpaid labour that nobody talks about. I built Leida to change that. We're starting with homecare, but it doesn't end there.</Typography>
                        <Typography sx={{ fontSize: 17, color: 'var(--ink-70)' }}>Founding members don't just get early access, they get a real say in what comes next. I would love for you to come on this journey with me to build a tool that finally gives us the work-life balance we chose this career for.</Typography>
                    </Box>
                    <Box className="glass-strong founding-card" sx={{ bgcolor: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--glass-shadow)', p: { xs: 5, md: 9 }, textAlign: 'center', maxWidth: 880, mx: 'auto' }}>
                        <Typography className="eyebrow" sx={{ display: 'inline-block', fontSize: 12, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-70)', bgcolor: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: 999, mb: 0, px: 3, py: 1 }}>Founding Member</Typography>
                        <Typography className="price" sx={{ fontFamily: 'var(--serif)', fontSize: { xs: 56, md: 88 }, fontWeight: 400, lineHeight: 1, color: 'var(--ink)', my: 2 }}>£29<span className="small" style={{ fontSize: '0.35em', color: 'var(--ink-50)', fontStyle: 'italic', marginLeft: 6 }}>/month</span></Typography>
                        <Typography className="price-sub" sx={{ fontSize: 14, color: 'var(--ink-50)', mb: 4, letterSpacing: '0.04em' }}>FOUNDING MEMBER RATE, FOREVER.</Typography>
                        <Typography variant="h2" className="section-title center" sx={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: { xs: 26, md: 36 }, mb: 4 }}>For the first 50 practitioners to join. <em style={{ fontStyle: 'italic', fontWeight: 300 }}>You get:</em></Typography>
                        <Grid container spacing={2} className="perks" sx={{ maxWidth: 620, mx: 'auto', mb: 5, textAlign: 'left' }}>
                            <Grid size={{ xs: 12, sm: 6 }}><Box className="perk" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--ink)' }}><Box className="perk-dot" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--ink)', mt: '7px' }} />£29/month, yours forever</Box></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><Box className="perk" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--ink)' }}><Box className="perk-dot" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--ink)', mt: '7px' }} />Cancel any time — no contracts, no catch</Box></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><Box className="perk" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--ink)' }}><Box className="perk-dot" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--ink)', mt: '7px' }} />First access to new features before anyone else</Box></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><Box className="perk" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--ink)' }}><Box className="perk-dot" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--ink)', mt: '7px' }} />A direct line to me as I build Leida</Box></Grid>
                            <Grid size={{ xs: 12 }}><Box className="perk perk-span" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 'var(--r-md)', fontSize: 15, color: 'var(--ink)', maxWidth: 360, mx: 'auto' }}><Box className="perk-dot" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--ink)', mt: '7px' }} />Founding member status, recognised forever</Box></Grid>
                        </Grid>
                        <Button component="a" href="https://buy.stripe.com/cNicN56eh4DHdhs0A6ew801" className="btn btn-primary" sx={{ bgcolor: 'var(--ink)', color: 'var(--cream)', borderRadius: 999, px: 4, py: 2, fontWeight: 500, fontSize: 15, boxShadow: '0 4px 16px rgba(44,44,42,0.18)', '&:hover': { bgcolor: '#1f1f1d', boxShadow: '0 8px 24px rgba(44,44,42,0.22)' } }}>
                            Claim your founding spot <span style={{ marginLeft: 6 }}>→</span>
                        </Button>
                        <Typography className="post-price" sx={{ fontSize: 13, color: 'var(--ink-50)', fontStyle: 'italic', mt: 2 }}>Once 50 spots are taken, standard pricing starts at £39/month.</Typography>
                    </Box>
                </Container>
            </Box>

            {/* FINAL CTA + WAITLIST */}
            <Box component="section" className="final-cta" sx={{ textAlign: 'center', py: 12 }}>
                <Container>
                    <Typography variant="h2" className="reveal" sx={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: { xs: 36, md: 48, lg: 60 }, mb: 4 }}>Ready to <em style={{ fontStyle: 'italic', fontWeight: 300 }}>wow</em> your clients?</Typography>
                    <Stack className="cta-stack reveal" spacing={1.5} alignItems="center" mt={3}>
                        <Button component="a" href="https://buy.stripe.com/cNicN56eh4DHdhs0A6ew801" className="btn btn-primary" sx={{ bgcolor: 'var(--ink)', color: 'var(--cream)', borderRadius: 999, px: 4, py: 2, fontWeight: 500, fontSize: 15, boxShadow: '0 4px 16px rgba(44,44,42,0.18)', '&:hover': { bgcolor: '#1f1f1d', boxShadow: '0 8px 24px rgba(44,44,42,0.22)' } }}>
                            Become a founding member <span style={{ marginLeft: 6 }}>→</span>
                        </Button>
                        <Typography className="micro" sx={{ fontSize: 13, color: 'var(--ink-50)' }}>£29/month forever. Cancel any time. 50 spots only.</Typography>
                    </Stack>

                    {/* Waitlist form (static, non-functional) */}
                    <Box id="waitlist" className="glass waitlist reveal" sx={{ maxWidth: 480, mx: 'auto', mt: 7, p: 4, bgcolor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--glass-shadow)' }}>
                        <Typography variant="h4" sx={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 26, mb: 1, color: 'var(--ink)' }}>Not ready? Join the waitlist.</Typography>
                        <Typography sx={{ fontSize: 14, color: 'var(--ink-70)', mb: 2 }}>Be the first to know when Leida launches. No spam. Ever.</Typography>
                        <Box component="form" action="https://assets.mailerlite.com/jsonp/2381051/forms/188535256482055233/subscribe" method="post" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            <TextField type="email" name="fields[email]" placeholder="your@email.com" required aria-label="Email" autoComplete="email" sx={{ flex: '1 1 200px', bgcolor: 'var(--white)', borderRadius: 999, fontSize: 15 }} />
                            <Button type="submit" id="waitlist-submit" sx={{ px: 3, py: 1.5, bgcolor: 'var(--ink)', color: 'var(--cream)', borderRadius: 999, fontSize: 14, fontWeight: 500, '&:hover': { bgcolor: '#1f1f1d' } }}>Join the waitlist</Button>
                            <input type="hidden" name="ml-submit" value="1" />
                            <input type="hidden" name="anticsrf" value="true" />
                        </Box>
                        <Typography className="waitlist-error" id="waitlist-error" role="alert" aria-live="polite" sx={{ display: 'none', color: '#b85959', fontSize: 13, textAlign: 'center', mt: 1 }}></Typography>
                        <Box className="success" id="waitlist-success" sx={{ display: 'none', textAlign: 'center', color: 'var(--ink)' }}>
                            <Typography variant="h4" sx={{ mb: 1 }}>You're on the list.</Typography>
                            <Typography>I'll be in touch as soon as Leida is ready for you. In the meantime, keep an eye on @ask.leida on Instagram for updates. Millie x</Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* FOOTER */}
            <Box component="footer" sx={{ py: 5, textAlign: 'center', fontSize: 13, color: 'var(--ink-50)' }}>
                <Container>
                    <Image src={`${assets}/logo-dark.svg`} alt="Leida" width={90} height={18} style={{ height: 18, opacity: 0.6, marginBottom: 14 }} className="logo-wm" />
                    <Typography>© 2026 Leida. Made with care for solo skin therapists.</Typography>
                </Container>
            </Box>
        </Box>
    );
}
