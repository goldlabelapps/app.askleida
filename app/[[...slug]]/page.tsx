"use client"; 
import Image from 'next/image';

const assets = '/askleida/landingpage/assets';

export default function Page() {
    return (
        <>
            {/* Persistent background */}
            <div className="site-bg" aria-hidden="true" />

            {/* NAV */}
            <nav className="site-nav">
                <div className="nav-inner">
                    <a href="/" className="logo-link">
                        <Image 
                            src={`${assets}/logo-dark.svg`} 
                            alt="Leida" 
                            width={110} 
                            height={22} 
                            className="logo" />
                    </a>
                    
                    {/* <a href="#founding" className="nav-cta">Become a founding member</a> */}
                </div>
            </nav>
        </>
    );
}
