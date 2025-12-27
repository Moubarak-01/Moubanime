import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AnimeCard } from '../components/AnimeCard';
import { Link } from 'react-router-dom';

interface HistoryItem {
  episodeId: string;
  animeId: string;
  animeTitle: string;
  episodeNumber: number;
  image: string;
  date: string;
}

export const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('watch-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing history:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 border-l-4 border-[#f47521] pl-4">
          Watch History
        </h2>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="text-xl">No history yet. Start watching!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {history.map((item, index) => (
              // We use the index in key just in case of duplicates, though logic prevents them
              <Link key={`${item.episodeId}-${index}`} to={`/watch/${item.animeId}`}>
                <AnimeCard
                  anime={{
                    id: item.animeId,
                    title: item.animeTitle,
                    image: item.image,
                    episodeNumber: item.episodeNumber
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Watched: {item.date}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};