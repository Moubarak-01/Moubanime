import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

const PROXY_URL = "http://localhost:3000/anime/proxy?url=";

export const Watch = () => {
  const { id } = useParams();
  const playerRef = useRef<HTMLDivElement>(null);
  
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [animeInfo, setAnimeInfo] = useState<any>(null);
  
  // States
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isMyList, setIsMyList] = useState(false);

  // 1. Load History & Watchlist
  useEffect(() => {
    const savedHistory = localStorage.getItem('watched-episodes');
    if (savedHistory) setWatchedEpisodes(JSON.parse(savedHistory));

    const watchlist = JSON.parse(localStorage.getItem('my-watchlist') || '[]');
    setIsMyList(watchlist.some((item: any) => item.id === id));
  }, [id]);

  // 2. Fetch Anime Data
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/anime/info/${id}`);
        setEpisodes(data.episodes);
        setAnimeInfo(data);
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };
    fetchInfo();
  }, [id]);

  // 3. Fetch Stream Logic
  useEffect(() => {
    if (!currentEpisode) return;

    if (!watchedEpisodes.includes(currentEpisode)) {
      const newHistory = [...watchedEpisodes, currentEpisode];
      setWatchedEpisodes(newHistory);
      localStorage.setItem('watched-episodes', JSON.stringify(newHistory));
    }

    const fetchStream = async () => {
      try {
        setVideoUrl(''); 
        setDownloadUrl(null);
        const { data } = await axios.get(`http://localhost:3000/anime/watch/${currentEpisode}`);
        if (data.download) setDownloadUrl(data.download);
        
        const source = data.sources.find((s: any) => s.quality === 'default' || s.quality === 'auto') || data.sources[0];
        if (source?.url) setVideoUrl(`${PROXY_URL}${encodeURIComponent(source.url)}`);
      } catch (error) {
        console.error("Error fetching stream:", error);
      }
    };
    fetchStream();
  }, [currentEpisode]);

  const toggleWatchlist = () => {
    const list = JSON.parse(localStorage.getItem('my-watchlist') || '[]');
    if (isMyList) {
      const newList = list.filter((item: any) => item.id !== id);
      localStorage.setItem('my-watchlist', JSON.stringify(newList));
      setIsMyList(false);
    } else {
      if (animeInfo) {
        list.push({ id, title: animeInfo.title, image: animeInfo.image });
        localStorage.setItem('my-watchlist', JSON.stringify(list));
        setIsMyList(true);
      }
    }
  };

  const handleStartWatching = () => {
    if (episodes.length > 0) {
      setCurrentEpisode(episodes[0].id);
      setTimeout(() => playerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      {animeInfo && (
        <div className="relative min-h-[85vh] w-full flex items-start">
           {/* Background Image */}
           <div 
             className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: `url(${animeInfo.image})` }}
           >
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
           </div>

           {/* Hero Content with Forced Padding */}
           <div 
             className="relative w-full p-6 md:p-12 lg:p-16 flex flex-col gap-6 z-10"
             style={{ paddingTop: '400px' }} 
           >
             
             {/* Metadata Badges */}
             <div className="flex flex-wrap items-center gap-3 animate-fade-in">
                <span className="bg-[#f47521] text-black px-3 py-1 rounded text-xs font-black uppercase tracking-wider">
                  {animeInfo.status}
                </span>
                <span className="text-gray-300 text-sm font-semibold">
                  {animeInfo.releaseDate || "Unknown Year"}
                </span>
                <span className="text-gray-500 text-xs">|</span>
                <span className="text-gray-300 text-sm font-semibold">
                  {animeInfo.type || "TV Series"}
                </span>
             </div>

             {/* Title */}
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none drop-shadow-2xl max-w-4xl">
               {animeInfo.title}
             </h1>

             {/* Description with Read More */}
             <div className="max-w-2xl text-gray-300 text-sm md:text-base leading-relaxed drop-shadow-md">
                {animeInfo.description ? (
                  <>
                    {isDescriptionExpanded || animeInfo.description.length < 250
                      ? animeInfo.description
                      : `${animeInfo.description.slice(0, 250)}...`
                    }
                    {animeInfo.description.length > 250 && (
                      <button 
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="ml-2 text-white font-bold underline hover:text-[#f47521] transition"
                      >
                        {isDescriptionExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </>
                ) : "No description available."}
             </div>

             {/* Action Buttons */}
             <div className="flex flex-wrap items-center gap-4 mt-2">
               <button 
                 onClick={handleStartWatching}
                 className="bg-[#f47521] hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 transition transform hover:scale-105 shadow-lg shadow-orange-900/20"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                   <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                 </svg>
                 Start Watching E1
               </button>

               <button 
                 onClick={toggleWatchlist}
                 className={`px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 border transition ${
                    isMyList 
                      ? 'bg-white text-black border-white hover:bg-gray-200'
                      : 'bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/20'
                 }`}
               >
                 {isMyList ? (
                   <>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                       <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                     </svg>
                     In List
                   </>
                 ) : (
                   <>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                       <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                     </svg>
                     Add to List
                   </>
                 )}
               </button>
             </div>
             
             {/* Genres */}
             <div className="flex gap-2 flex-wrap">
                {animeInfo.genres?.map((genre: string) => (
                  <span key={genre} className="text-gray-400 text-sm hover:text-white cursor-pointer transition">
                    {genre}
                  </span>
                ))}
             </div>

           </div>
        </div>
      )}

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        
        {/* Conditional Video Player */}
        {currentEpisode && (
           <div ref={playerRef} className="scroll-mt-24 mb-16 animate-fade-in">
             <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-[#333] relative">
               {videoUrl ? (
                  <MediaPlayer title={animeInfo?.title} src={videoUrl} aspectRatio="16/9" load="eager">
                    {/* FIXED: MediaProvider is now self-closing */}
                    <MediaProvider />
                    
                    {/* FIXED: Poster is now a sibling, not a child, so it won't trap the video */}
                    <Poster 
                    className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover" 
                    src={animeInfo?.image} 
                    alt={animeInfo?.title} 
                    />
                    
                    <DefaultVideoLayout icons={defaultLayoutIcons} />
                  </MediaPlayer>
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                   <div className="w-12 h-12 border-4 border-[#f47521] border-t-transparent rounded-full animate-spin"></div>
                   <p>Loading Stream...</p>
                 </div>
               )}
             </div>

             {downloadUrl && (
                <div className="mt-4 flex justify-end">
                  <a href={downloadUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0 4.5-4.5M12 16.5v-9" />
                     </svg>
                     Download Episode
                  </a>
                </div>
             )}
           </div>
        )}

        {/* Episodes Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-[#f47521] pl-4">Episodes</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {episodes.map((ep) => {
              const isWatched = watchedEpisodes.includes(ep.id);
              const isCurrent = currentEpisode === ep.id;

              return (
                <button
                  key={ep.id}
                  onClick={() => {
                     setCurrentEpisode(ep.id);
                     setTimeout(() => playerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className={`py-3 px-2 rounded-lg text-sm font-bold transition relative overflow-hidden group ${
                    isCurrent 
                      ? 'bg-[#f47521] text-white shadow-lg shadow-orange-500/20' 
                      : isWatched
                        ? 'bg-[#151619] text-gray-500 border border-green-900/30' 
                        : 'bg-[#151619] text-gray-300 hover:bg-[#25262b] hover:text-white'
                  }`}
                >
                  {isWatched && !isCurrent && (
                     <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full m-1" />
                  )}
                  {ep.number}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};