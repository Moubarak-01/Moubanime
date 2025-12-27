import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/header-logo.png';

export const Navbar = () => {
  // State to track if user has scrolled down
  const [isScrolled, setIsScrolled] = useState(false);

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // NAVBAR CONTAINER: Fixed position + Conditional Background
    <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0f0f0f]/95 backdrop-blur-md shadow-lg border-b border-gray-800' // Dark when scrolled
        : 'bg-transparent border-transparent' // Invisible when at top
    }`}>
      
      {/* Left: Logo & Desktop Links */}
      <div className="flex items-center gap-8">
        <Link to="/">
          <img src={logo} alt="MoubAnime" className="h-8 md:h-10 w-auto object-contain drop-shadow-md" />
        </Link>
        
        <div className="hidden md:flex gap-6 text-gray-200 text-sm font-bold tracking-wide">
          <Link to="/" className="hover:text-[#f47521] transition drop-shadow-sm">HOME</Link>
          <Link to="/browse" className="hover:text-[#f47521] transition drop-shadow-sm">BROWSE</Link>
          <Link to="/mylist" className="hover:text-[#f47521] transition drop-shadow-sm">MY LIST</Link>
          <Link to="/history" className="hover:text-[#f47521] transition drop-shadow-sm">HISTORY</Link>
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-5 text-gray-200">
        <Link to="/browse" className="hover:text-white transition drop-shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </Link>
        
        <Link to="/account" className="hover:text-white transition">
          <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden border border-gray-400 hover:border-[#f47521]">
             <img src="https://wallpapers.com/images/hd/cool-profile-picture-87h46gcobjl5e4xu.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>
    </nav>
  );
};