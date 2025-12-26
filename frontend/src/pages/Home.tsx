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

export const Home = () => {
  const [animeList, setAnimeList] = useState<AnimeResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const searchAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const { data } = await axios.get(`http://localhost:3000/anime/search?q=${searchQuery}`);
      setAnimeList(data.results);
    } catch (error) {
      console.error("Error fetching anime:", error);
    }
  };

  useEffect(() => {
    const fetchDefault = async () => {
      const { data } = await axios.get('http://localhost:3000/anime/search?q=naruto');
      setAnimeList(data.results);
    };
    fetchDefault();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={searchAnime} className="mb-8 flex justify-center">
          <input 
            type="text" 
            placeholder="Search anime..." 
            className="w-full max-w-md bg-[#23252b] border border-gray-700 text-white px-4 py-3 rounded-l-lg focus:outline-none focus:border-[#f47521]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-[#f47521] px-6 py-3 rounded-r-lg font-bold hover:bg-orange-600 transition">
            SEARCH
          </button>
        </form>

        {/* Results Grid */}
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-[#f47521] pl-4">Results</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {animeList.map((anime) => (
            <Link key={anime.id} to={`/watch/${anime.id}`}>
              <AnimeCard anime={anime} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};