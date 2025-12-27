// frontend/src/components/AnimeCard.tsx
interface AnimeProp {
  anime: {
    id: string;
    title: string;
    image: string;
    episodeNumber?: number;
  };
}

export const AnimeCard = ({ anime }: AnimeProp) => {
  return (
    <div className="relative group cursor-pointer transition-transform hover:scale-105">
      {/* Anime Poster */}
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
        <img 
          src={anime.image} 
          alt={anime.title} 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
      </div>

      {/* Title */}
      <div className="mt-2">
        <h3 className="text-white font-medium truncate" title={anime.title}>
          {anime.title}
        </h3>
        {/* Orange Line for style */}
        <div className="w-0 group-hover:w-full h-0.5 bg-[#f47521] transition-all duration-300 mt-1" />
      </div>
    </div>
  );
};