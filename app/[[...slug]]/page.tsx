"use client"; 

import {Leida} from '../Leida';
const assets = '/askleida/landingpage/assets';

export default function Page() {
    return (
        <>
            {/* Persistent background */}
            <div className="site-bg" aria-hidden="true" />
            <Leida />
            
        </>
    );
}
