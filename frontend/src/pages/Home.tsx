import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { AnimeCard } from '../components/AnimeCard';
import { Link } from 'react-router-dom';

interface AnimeResult {
  id: string;
  title: string;
  image: string;
  banner?: string;
  description?: string;
  type?: string;
}

export const Home = () => {
  const [trending, setTrending] = useState<AnimeResult[]>([]);
  const [popular, setPopular] = useState<AnimeResult[]>([]);
  const [heroAnime, setHeroAnime] = useState<AnimeResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, popularRes] = await Promise.all([
          axios.get('http://localhost:3000/anime/trending'),
          axios.get('http://localhost:3000/anime/popular')
        ]);
        
        setTrending(trendingRes.data.results || []);
        setPopular(popularRes.data.results || []);

        if (trendingRes.data.results?.length > 0) {
          setHeroAnime(trendingRes.data.results[0]);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchData();
  }, []);

  const addToMyList = () => {
    if (!heroAnime) return;
    const saved = localStorage.getItem('my-list');
    const list = saved ? JSON.parse(saved) : [];
    
    if (!list.some((a: any) => a.id === heroAnime.id)) {
      const newItem = {
        id: heroAnime.id,
        title: heroAnime.title,
        image: heroAnime.image 
      };
      const newList = [newItem, ...list];
      localStorage.setItem('my-list', JSON.stringify(newList));
      alert(`${heroAnime.title} added to My List!`);
    } else {
      alert('Already in your list!');
    }
  };

  return (
    <div className="min-h-screen bg-[#000] text-white overflow-x-hidden pb-24 md:pb-0">
      <Navbar />

      {/* 1. HERO BANNER */}
      {heroAnime && (
        <div className="relative w-full h-[65vh] md:h-[80vh]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={heroAnime.banner || heroAnime.image} 
              alt={heroAnime.title} 
              className="w-full h-full object-cover object-top opacity-80"
            />
            {/* GRADIENT OVERLAYS */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 p-6 md:p-16 max-w-2xl w-full z-10">
            <span className="bg-[#f47521] text-black text-[10px] md:text-xs font-bold px-2 py-1 rounded mb-3 inline-block uppercase tracking-wider">
              #{heroAnime.type || 'Spotlight'}
            </span>
            <h1 className="text-3xl md:text-xl font-black mb-2 md:mb-4 leading-tight drop-shadow-xl">
              {heroAnime.title}
            </h1>
            
            <div className="flex gap-3 md:gap-4">
              <Link 
                to={`/watch/${heroAnime.id}`}
                className="bg-[#f47521] text-black px-6 md:px-8 py-3 rounded font-bold text-sm md:text-lg hover:bg-[#ff8f4d] transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
                PLAY
              </Link>
              <button 
                onClick={addToMyList}
                className="bg-gray-800/60 backdrop-blur-md border border-gray-600 text-white px-6 md:px-8 py-3 rounded font-bold text-sm md:text-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                MY LIST
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCROLLABLE ROWS */}
      <div className="px-4 md:px-8 py-6 space-y-10">
        
        {/* Trending Row - NOW USES LANDSCAPE VARIANT */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-2xl font-bold border-l-4 border-[#f47521] pl-3">Trending Now</h2>
          </div>
          <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 custom-scrollbar snap-x scroll-pl-4">
            {trending.map((anime) => (
              <div key={anime.id} className="min-w-[200px] md:min-w-[280px] snap-start">
                 {/* 💡 WE FORCE LANDSCAPE MODE HERE */}
                 <Link to={`/watch/${anime.id}`}>
                  <AnimeCard anime={anime} variant="landscape" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Row - DEFAULTS TO PORTRAIT */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold mb-4 border-l-4 border-[#f47521] pl-3">Most Popular</h2>
          <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 custom-scrollbar snap-x scroll-pl-4">
            {popular.map((anime) => (
              <div key={anime.id} className="min-w-[130px] md:min-w-[200px] snap-start">
                {/* 💡 NO VARIANT = DEFAULTS TO TALL POSTERS */}
                <Link to={`/watch/${anime.id}`}>
                  <AnimeCard anime={anime} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};