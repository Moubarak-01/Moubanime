import { Link } from 'react-router-dom';
import logo from '../assets/header-logo.png';

export const Navbar = () => {
  return (
    <nav className="bg-[#23252b]/95 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md border-b border-gray-800">
      {/* Left: Logo & Desktop Links */}
      <div className="flex items-center gap-8">
        <Link to="/">
          <img src={logo} alt="MoubAnime" className="h-8 md:h-10 w-auto object-contain" />
        </Link>
        
        <div className="hidden md:flex gap-6 text-gray-300 text-sm font-bold tracking-wide">
          <Link to="/" className="hover:text-[#f47521] transition">HOME</Link>
          <Link to="/browse" className="hover:text-[#f47521] transition">BROWSE</Link>
          <Link to="/mylist" className="hover:text-[#f47521] transition">MY LIST</Link>
          <Link to="/history" className="hover:text-[#f47521] transition">HISTORY</Link>
        </div>
      </div>

      {/* Right: Icons (Mobile & Desktop) */}
      <div className="flex items-center gap-5 text-gray-300">
        <Link to="/browse" className="hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </Link>
        
        <Link to="/account" className="hover:text-white">
          <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden border border-gray-500 hover:border-[#f47521] transition">
             <img src="https://wallpapers.com/images/hd/cool-profile-picture-87h46gcobjl5e4xu.jpg" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>
    </nav>
  );
};