"use client";

import React, { useEffect, useState } from 'react';
import ArtworkGrid from '@/components/Artwork/ArtworkGrid';
import { useApi } from '@/utils/ApiProvider';

const HomePage: React.FC = () => {
  const { artworks } = useApi();
  const [artistBios, setArtistBios] = useState<{ name: string; bio: string }[]>([]);

  useEffect(() => {
    const fetchArtistBios = async () => {
      if (artworks.length > 0) {
        const artistNames = Array.from(new Set(artworks.map(artwork => artwork.artist_title)));
        
      
      }
    };

  }, [artworks
  ]);

  return (
    <>
  
      <ArtworkGrid />
      <div className="container mx-auto p-4 mt-8">
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {artistBios.map((artist, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow-lg p-4">
              <h3 className="text-xl font-semibold">{artist.name}</h3>
              <p className="text-gray-600">{artist.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
