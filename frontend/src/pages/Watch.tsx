import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

// Backend Proxy URL (The Middleman)
const PROXY_URL = "http://localhost:3000/anime/proxy?url=";

export const Watch = () => {
  const { id } = useParams();
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [animeInfo, setAnimeInfo] = useState<any>(null); // For Title & Poster
  
  // NEW: State for Watch History & Download
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);

  // 1. Load Watch History from Local Storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('watched-episodes');
    if (savedHistory) {
      setWatchedEpisodes(JSON.parse(savedHistory));
    }
  }, []);

  // Helper to save episode to history
  const markAsWatched = (episodeId: string) => {
    if (!watchedEpisodes.includes(episodeId)) {
      const newHistory = [...watchedEpisodes, episodeId];
      setWatchedEpisodes(newHistory);
      localStorage.setItem('watched-episodes', JSON.stringify(newHistory));
    }
  };

  // 2. Fetch Anime Info (Episodes, Title, Image)
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/anime/info/${id}`);
        setEpisodes(data.episodes);
        setAnimeInfo(data);
        if (data.episodes.length > 0) {
          setCurrentEpisode(data.episodes[0].id);
        }
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };
    fetchInfo();
  }, [id]);

  // 3. Fetch Stream & Download Link
  useEffect(() => {
    if (!currentEpisode) return;
    
    // Auto-mark as watched when we start fetching the stream
    markAsWatched(currentEpisode);

    const fetchStream = async () => {
      try {
        setVideoUrl(''); 
        setDownloadUrl(null); // Reset download link
        
        const { data } = await axios.get(`http://localhost:3000/anime/watch/${currentEpisode}`);
        
        console.log("Stream Data Received:", data);

        // --- IMPROVED DOWNLOAD LOGIC ---
        // 1. Try the official download field
        if (data.download) {
          setDownloadUrl(data.download);
        } 
        // 2. Fallback: Search inside 'sources' for an MP4 file
        else if (data.sources) {
          const backupSource = data.sources.find((s: any) => s.url.endsWith('.mp4') || s.type === 'mp4');
          if (backupSource) {
            setDownloadUrl(backupSource.url);
          }
        }
        // -------------------------------

        // B. Setup Streaming via Proxy
        const source = data.sources.find((s: any) => s.quality === 'default' || s.quality === 'auto') || data.sources[0];
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
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-[#333] relative">
          {videoUrl ? (
             <MediaPlayer title={animeInfo?.title} src={videoUrl} aspectRatio="16/9" load="eager">
               <MediaProvider>
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

        {/* Download Button Area */}
        {downloadUrl ? (
          <div className="mt-4 flex justify-end">
            <a 
              href={downloadUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#23252b] hover:bg-[#333] text-white px-4 py-2 rounded-lg font-semibold transition border border-gray-700 hover:border-[#f47521]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0 4.5-4.5M12 16.5v-9" />
              </svg>
              Download Episode
            </a>
          </div>
        ) : (
           <div className="mt-4 flex justify-end text-gray-500 text-sm italic">
             (Download not available for this episode)
           </div>
        )}

        {/* Episode List */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-[#f47521]">Episodes</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {episodes.map((ep) => {
              // Check if this episode is in our history
              const isWatched = watchedEpisodes.includes(ep.id);
              const isCurrent = currentEpisode === ep.id;

              return (
                <button
                  key={ep.id}
                  onClick={() => setCurrentEpisode(ep.id)}
                  className={`py-2 px-1 rounded text-sm font-semibold transition border ${
                    isCurrent 
                      ? 'bg-[#f47521] text-white border-[#f47521]' 
                      : isWatched
                        ? 'bg-[#1a1c21] text-green-400 border-green-900/50 hover:border-green-500' // WATCHED STYLE
                        : 'bg-[#23252b] text-gray-400 border-transparent hover:bg-[#333] hover:text-white'
                  }`}
                  title={isWatched ? "Watched" : ""}
                >
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