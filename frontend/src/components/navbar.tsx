import React from 'react';
import vite from '../assets/vite.svg';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={vite} alt="Logo" />
            </div>
            <ul className="navbar-links">
                <li><a href="/">Home</a></li>
                <li><a href="/clubs">Clubs</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Regions</a></li>
            </ul>
        </nav>
    );
}
export default Navbar;