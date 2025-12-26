// frontend/src/components/Navbar.tsx
export const Navbar = () => {
  return (
    <nav className="bg-[#23252b] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
      {/* Logo Area */}
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-[#f47521] tracking-tighter">
          ANILAB
        </h1>
        <div className="hidden md:flex gap-6 text-gray-300 text-sm font-semibold">
          <a href="#" className="hover:text-white transition">BROWSE</a>
          <a href="#" className="hover:text-white transition">MANGA</a>
          <a href="#" className="hover:text-white transition">GAMES</a>
        </div>
      </div>

      {/* Right Side (Search placeholder) */}
      <div className="flex items-center gap-4">
        <button className="text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
      </div>
    </nav>
  );
};