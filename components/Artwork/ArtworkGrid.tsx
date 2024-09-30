"use client";

import React, { useEffect, useState } from 'react';
import { useApi } from '../../utils/ApiProvider'; 
import Image from 'next/image';
import Link from 'next/link';

const ArtworkGrid: React.FC = () => {
  const { artworks } = useApi();
  const [validArtworks, setValidArtworks] = useState<any[]>([]);

  useEffect(() => {
    sessionStorage.setItem('artworks', JSON.stringify(artworks));

    const filteredArtworks = artworks.filter(
      (artwork) => artwork.image_url && !artwork.image_url.includes('null')
    );
  
    setValidArtworks(filteredArtworks);
  }, [artworks]);

  console.log('Total Artworks:', {artworks, validArtworks});

  const displayedArtworks = validArtworks.slice(0, 25);

  const handleImageError = (artworkId: number) => {
    setValidArtworks((prevArtworks) =>
      prevArtworks.filter((artwork) => artwork.id !== artworkId)
    );
  };

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"> 
        {displayedArtworks.map((artwork) => (
          <div key={artwork.id} className="border rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105">
            <Link href={`/artwork/${artwork.id}`}>
              <div className="relative w-full h-96 group">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                  onError={() => handleImageError(artwork.id)} 
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{artwork.title}</h3>
             
                  <p className="text-gray-600 hover:underline">by {artwork.artist_title}</p>
            
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtworkGrid;
