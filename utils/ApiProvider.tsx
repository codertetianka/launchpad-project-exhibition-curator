"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface Artwork {
  id: number;
  title: string;
  artist_title: string;
  artist_id?: number;
  image_id: string;
  image_url?: string;
}

interface Exhibition {
  exhibitionid: number;
  title: string;
  begindate: string;
  enddate: string;
  description?: string;
  primaryimageurl?: string;
}


interface ApiContextProps {
  artworks: Artwork[];
  exhibitions: Exhibition[];
  fetchArtistById?: (artistId: string) => void;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      const fetchedArtworks = await fetchArtworksFromArtic();
      setArtworks(fetchedArtworks);
    };

    fetchArtworks();
  }, []);

  useEffect(() => {
    const fetchExhibitions = async () => {
      const response = await fetch('https://api.harvardartmuseums.org/exhibition?apikey=YOUR_API_KEY'); 
      const data = await response.json();
      setExhibitions(data.records);
    };

    fetchExhibitions();
  }, []);

  return (
    <ApiContext.Provider value={{ artworks, exhibitions}}>
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

const fetchArtworksFromArtic = async () => {
  try {
    const response = await fetch('https://api.artic.edu/api/v1/artworks?limit=100');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const artworksWithImageUrls = data.data.map((artwork: any) => ({
      ...artwork,
      image_url: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
    }));

    return artworksWithImageUrls;
  } catch (error) {
    console.error('Error fetching artworks from Artic:', error);
    return [];
  }
};

export { ApiProvider, useApi, fetchArtworksFromArtic };
