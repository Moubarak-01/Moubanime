import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

// Helper to bypass CORS (Browser blocking)
// In a real "pro" app, you would build your own proxy in NestJS, but this works for now.
const PROXY_URL = "https://m3u8-proxy-cors-worker.qwertyuiop.workers.dev/?url=";

export const Watch = () => {
  const { id } = useParams();
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [animeInfo, setAnimeInfo] = useState<any>(null); // To store title/image
  
  // 1. Fetch Anime Info & Episodes
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/anime/info/${id}`);
        setEpisodes(data.episodes);
        setAnimeInfo(data); // Save full info for the poster
        if (data.episodes.length > 0) {
          setCurrentEpisode(data.episodes[0].id);
        }
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };
    fetchInfo();
  }, [id]);

  // 2. Fetch Video Stream
  useEffect(() => {
    if (!currentEpisode) return;
    const fetchStream = async () => {
      try {
        setVideoUrl(''); // Reset video to show loading state
        const { data } = await axios.get(`http://localhost:3000/anime/watch/${currentEpisode}`);
        
        // Find the best quality source (m3u8)
        const source = data.sources.find((s: any) => s.quality === 'default' || s.quality === 'auto') || data.sources[0];
        
        // Combine Proxy + Video URL
        if (source?.url) {
          setVideoUrl(`${PROXY_URL}${encodeURIComponent(source.url)}`);
        }
      } catch (error) {
        console.error("Error fetching stream:", error);
      }
    };
    fetchStream();
  }, [currentEpisode]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Video Player */}
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-[#333]">
          {videoUrl ? (
             <MediaPlayer title={animeInfo?.title} src={videoUrl} aspectRatio="16/9" load="eager">
               <MediaProvider>
                 {/* This shows the anime image before playing */}
                 <Poster 
                   className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover" 
                   src={animeInfo?.image} 
                   alt={animeInfo?.title} 
                 />
               </MediaProvider>
               <DefaultVideoLayout icons={defaultLayoutIcons} />
             </MediaPlayer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              <div className="w-12 h-12 border-4 border-[#f47521] border-t-transparent rounded-full animate-spin"></div>
              <p>Loading Stream...</p>
            </div>
          )}
        </div>

        {/* Episode List */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-[#f47521]">Episodes</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setCurrentEpisode(ep.id)}
                className={`py-2 px-1 rounded text-sm font-semibold transition ${
                  currentEpisode === ep.id 
                    ? 'bg-[#f47521] text-white' 
                    : 'bg-[#23252b] text-gray-400 hover:bg-[#333]'
                }`}
              >
                {ep.number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};