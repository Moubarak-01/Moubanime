import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AnimeCard } from '../components/AnimeCard';
import { Link } from 'react-router-dom';

export const MyList = () => {
  const [myList, setMyList] = useState<any[]>([]);

  useEffect(() => {
    // Load list from local storage
    const saved = localStorage.getItem('my-list');
    if (saved) {
      setMyList(JSON.parse(saved));
    }
  }, []);

  const removeFromList = (id: string) => {
    const updatedList = myList.filter(anime => anime.id !== id);
    setMyList(updatedList);
    localStorage.setItem('my-list', JSON.stringify(updatedList));
  };

  return (
    <div className="min-h-screen bg-[#000] text-white overflow-x-hidden">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 border-l-4 border-[#f47521] pl-4">My List</h1>
        
        {myList.length > 0 ? (
          // Horizontal Scroll Container
          <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x scroll-pl-4">
            {myList.map((anime) => (
              // CHANGE: Set exact width to 300px to match your AnimeCard placeholder size
              <div key={anime.id} className="max-w-[320px] snap-start relative group">
                
                <Link to={`/watch/${anime.id}`}>
                  {/* Landscape Variant */}
                  <AnimeCard anime={anime} variant="landscape" />
                </Link>

                {/* Remove Button (X) */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromList(anime.id);
                  }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                  title="Remove from list"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-xl mb-4">Your list is empty</p>
            <Link to="/" className="text-[#f47521] hover:underline">
              Go add some anime!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};