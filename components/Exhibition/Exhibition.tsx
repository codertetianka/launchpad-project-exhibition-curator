"use client";

import { useState, useEffect } from 'react';

interface ExhibitionType {
  id: number;
  name: string;
  artworks: Array<{
    id: number;
    title: string;
    artist_title: string;
  }>;
}

interface ExhibitionProps {
  exhibition: ExhibitionType;
}

const Exhibition = ({ exhibition }: ExhibitionProps) => {
  const [artworks, setArtworks] = useState<ExhibitionType['artworks']>([]);

  useEffect(() => {
    if (exhibition) {
      setArtworks(exhibition.artworks || []);
    }
  }, [exhibition]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{exhibition.name}</h1>

      <p className="text-gray-600">
      This exhibition is currently empty. Try searching for artworks to add them to your exhibition.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium">{artwork.title}</h2>
            <p className="text-gray-600">{artwork.artist_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exhibition;
