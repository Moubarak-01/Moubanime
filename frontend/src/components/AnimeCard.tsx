// frontend/src/components/AnimeCard.tsx

interface AnimeProp {
  anime: {
    id: string;
    title: string;
    image?: string;
    poster?: string;
    cover?: string;
    banner?: string;
    episodeNumber?: number;
  };
  variant?: 'portrait' | 'landscape';
}

export const AnimeCard = ({ anime, variant = 'portrait' }: AnimeProp) => {
  
  // 1. Image Selection
  let imageUrl = '';
  if (variant === 'landscape') {
    imageUrl = anime.banner || anime.cover || anime.image || anime.poster || 'https://via.placeholder.com/300x169?text=No+Image';
  } else {
    imageUrl = anime.image || anime.poster || anime.cover || anime.banner || 'https://via.placeholder.com/300x450?text=No+Image';
  }

  // 2. Aspect Ratio & Fit Logic
  const aspectRatioClass = variant === 'landscape' ? 'aspect-video' : 'aspect-[2/3]';
  
  // CRITICAL CHANGE: 
  // - Landscape = 'object-contain' (Show FULL image, no cropping)
  // - Portrait = 'object-cover' (Fill the box completely)
  const objectFitClass = variant === 'landscape' ? 'object-contain' : 'object-cover';

  return (
    <div className="relative group cursor-pointer transition-transform hover:scale-105">
      {/* Anime Image Container */}
      <div className={`relative w-full ${aspectRatioClass} overflow-hidden rounded-lg shadow-lg bg-[#1a1c21]`}>
        <img 
          src={imageUrl} 
          alt={anime.title} 
          className={`w-full h-full ${objectFitClass} object-center`} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = variant === 'landscape' 
              ? 'https://via.placeholder.com/300x169?text=No+Image' 
              : 'https://via.placeholder.com/300x450?text=No+Image';
          }}
        />
        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        
        {/* Optional: Episode Badge */}
        {anime.episodeNumber && (
           <div className="absolute top-2 right-2 bg-[#f47521] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
             EP {anime.episodeNumber}
           </div>
        )}
      </div>

      {/* Title */}
      <div className="mt-2">
        <h3 className="text-white font-medium truncate text-sm md:text-base" title={anime.title}>
          {anime.title}
        </h3>
        <div className="w-0 group-hover:w-full h-0.5 bg-[#f47521] transition-all duration-300 mt-1" />
      </div>
    </div>
  );
};