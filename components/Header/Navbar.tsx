"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 p-7 pl-6 transition-all duration-300 ease-in-out 
      ${scrolling ? 'bg-white shadow-md' : 'bg-transparent'} 
      md:bg-opacity-100`}>
      <div className="flex justify-between items-start">
        <Link href="/" className="text-black text-5xl md:text-3xl sm:text-2xl font-bold mb-2">
          Exhibition Curator
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-black block md:hidden focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      <ul className={`mt-4 md:flex md:space-x-8 ${isOpen ? 'block' : 'hidden'} md:block`}>
        <li className="relative group">
          <Link href="/" className="block text-black text-xl py-1 md:py-0" onClick={closeMenu}>
            Home
            <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </li>
        <li className="relative group">
          <Link href="/discover-exhibitions" className="block text-black text-xl py-1 md:py-0" onClick={closeMenu}>
            Discover
            <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </li>
        <li className="relative group">
          <Link href="/user-profile" className="block text-black text-xl py-1 md:py-0" onClick={closeMenu}>
            Manage
            <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
