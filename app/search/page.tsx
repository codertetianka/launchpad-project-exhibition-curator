"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import AddToExhibitionButton from '@/components/Utility/AddToExhibitionButton';

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchTerm = searchParams.get('query') || '';
  const filter = searchParams.get('filter') || 'All';

  const [exhibitions, setExhibitions] = useState<any[]>([]);

  const handleAddToExhibition = (artwork, exhibitionId) => {
    const updatedExhibitions = exhibitions.map((exhibition) => {
      if (exhibition.id === exhibitionId) {
        return {
          ...exhibition,
          artworks: [...exhibition.artworks, artwork],
        };
      }
      return exhibition;
    });
  
    setExhibitions(updatedExhibitions); 
    localStorage.setItem("exhibitions", JSON.stringify(updatedExhibitions)); 
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);

        let queryUrl = `https://api.artic.edu/api/v1/artworks/search`
        
        const filterIsNotAll = filter && filter !== 'All';

        const response = await fetch(queryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            q: searchTerm ? searchTerm : undefined,
            fields: "image_id,title,artist_title,timestamp,id,artwork_type_title,classification_titles",

            query: filterIsNotAll ? {
              "match": {
                "artwork_type_title": filter, 
              }
            } : undefined
          })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();

        const artworksWithImageUrls = data.data.map((artwork: any) => ({
          ...artwork,
          image_url: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
        }));

        setResults(artworksWithImageUrls);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm, filter]); 

  useEffect(() => {
    const storedExhibitions = localStorage.getItem('exhibitions');
    if (storedExhibitions) {
      setExhibitions(JSON.parse(storedExhibitions));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (results.length === 0 && searchTerm) {
    return <div>No results found for "{searchTerm}".</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Results for "{searchTerm}"</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {results.map((artwork) => (
          <div
            key={artwork.id}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer flex flex-col justify-between"
            onClick={() => router.push(`/artwork/${artwork.id}`)}
          >
            <div className="w-full aspect-w-1 aspect-h-1">
              <Image
                src={artwork.image_url || '/placeholder.jpg'}
                alt={artwork.title}
                width={300}
                height={300}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="mt-2">
              <h2 className="text-lg font-medium">{artwork.title}</h2>
              {artwork.artist_title && (
                <p className="text-gray-600">By {artwork.artist_title}</p>
              )}
              <AddToExhibitionButton 
                artwork={artwork} 
                exhibitions={exhibitions} 
                onAdd={handleAddToExhibition} 
                setExhibitions={setExhibitions} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
