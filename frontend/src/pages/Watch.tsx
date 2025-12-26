import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import Hls from 'hls.js';

export const Watch = () => {
  const { id } = useParams(); // Get anime ID from URL
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  // 1. Fetch Anime Info (Episode List)
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/anime/info/${id}`);
        setEpisodes(data.episodes);
        if (data.episodes.length > 0) {
          // Automatically select first episode
          setCurrentEpisode(data.episodes[0].id);
        }
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };
    fetchInfo();
  }, [id]);

  // 2. Fetch Streaming Link when Episode changes
  useEffect(() => {
    if (!currentEpisode) return;
    const fetchStream = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/anime/watch/${currentEpisode}`);
        // Find the "default" or "auto" quality link
        const source = data.sources.find((s: any) => s.quality === 'default' || s.quality === 'auto') || data.sources[0];
        setVideoUrl(source.url);
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
        {/* Video Player Container */}
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-[#333]">
          {videoUrl ? (
             <MediaPlayer src={videoUrl} aspectRatio="16/9" load="eager">
               <MediaProvider />
               <DefaultVideoLayout icons={defaultLayoutIcons} />
             </MediaPlayer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Loading Stream...
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