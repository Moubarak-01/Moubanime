import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { AnimeCard } from '../components/AnimeCard';
import { Link } from 'react-router-dom';

interface SavedAnime {
  id: string;
  title: string;
  image: string;
}

export const MyList = () => {
  const [myList, setMyList] = useState<SavedAnime[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('my-list');
    if (saved) {
      setMyList(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 border-l-4 border-[#f47521] pl-4">
          My List
        </h2>

        {myList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
            <p className="text-xl">Your list is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {myList.map((anime) => (
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