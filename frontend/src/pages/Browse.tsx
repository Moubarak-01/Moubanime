import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { AnimeCard } from '../components/AnimeCard';
import { Link } from 'react-router-dom';

interface AnimeResult {
  id: string;
  title: string;
  image: string;
}

export const Browse = () => {
  const [animeList, setAnimeList] = useState<AnimeResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const searchAnime = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:3000/anime/search?q=${searchQuery}`);
      setAnimeList(data.results);
    } catch (error) {
      console.error("Error searching anime:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load some default content (e.g., Action anime) when opening Browse
  useEffect(() => {
    const fetchDefault = async () => {
      setLoading(true);
      try {
        // Default search to fill the page
        const { data } = await axios.get('http://localhost:3000/anime/search?q=adventure');
        setAnimeList(data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDefault();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-10 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-center">Browse Anime</h1>
          <form onSubmit={searchAnime} className="w-full max-w-2xl flex">
            <input 
              type="text" 
              placeholder="Search for anime..." 
              className="flex-1 bg-[#23252b] border border-gray-700 text-white px-6 py-4 rounded-l-lg focus:outline-none focus:border-[#f47521] text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-[#f47521] px-8 py-4 rounded-r-lg font-bold hover:bg-orange-600 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-[#f47521] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {animeList.map((anime) => (
              <Link key={anime.id} to={`/watch/${anime.id}`}>
                <AnimeCard anime={anime} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};