"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AddToExhibitionButton from '@/components/Utility/AddToExhibitionButton';

const ArtworkPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [artwork, setArtwork] = useState<any>(null);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [addedExhibitions, setAddedExhibitions] = useState<number[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false); 
  const [showFullHistory, setShowFullHistory] = useState(false); 

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks/${params?.id}`);
        if (!response.ok) throw new Error('Failed to fetch artwork details');
        const data = await response.json();
        const artworkDetails = {
          ...data.data,
          image_url: `https://www.artic.edu/iiif/2/${data.data.image_id}/full/843,/0/default.jpg`,
          description: data.data.description?.replace(/<\/?[^>]+(>|$)/g, "") || "No description available.",
          exhibition_history: data.data.exhibition_history?.replace(/<\/?[^>]+(>|$)/g, "") || "No exhibition history available.",
        };
        setArtwork(artworkDetails);
      } catch (error) {
        console.error('Error fetching artwork details:', error);
      }
    };

    const loadExhibitions = () => {
      const storedExhibitions = localStorage.getItem('exhibitions');
      const exhibitionsData = storedExhibitions ? JSON.parse(storedExhibitions) : [];
      setExhibitions(exhibitionsData);

      const addedExhibitionsList = exhibitionsData
        .filter((exhibition) => exhibition.artworks.some((art) => art.id === artwork?.id))
        .map((exhibition) => exhibition.id);
      setAddedExhibitions(addedExhibitionsList);
    };

    if (params?.id) {
      fetchArtworkDetails();
      loadExhibitions();
    }
  }, [artwork?.id, params?.id]);

  if (!artwork) {
    return <div>Loading...</div>;
  }


  const exhibitionHistoryItems = artwork.exhibition_history
    .split('. ')
    .filter((sentence: string) => sentence.length >= 21)
    .map((sentence: string, index: number) => (
      <li key={index} className="mb-2">{sentence.trim()}.</li>
    ));

  const displayedExhibitionHistory = showFullHistory 
    ? exhibitionHistoryItems 
    : exhibitionHistoryItems.slice(0, 5); 
  const limitedDescription = artwork.description.length > 500 
    ? artwork.description.slice(0, 500) + '...' 
    : artwork.description;

  return (
    <div className="container mx-auto p-4 md:py-16 lg:px-32">
      <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-12">
        <div className="md:w-3/4 lg:w-3/5 xl:w-2/3 space-y-4 mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
            {artwork.title}
          </h1>
          <div className="block md:hidden">
            <Image
              src={artwork.image_url || '/placeholder.jpg'}
              alt={artwork.title}
              layout="responsive" 
              width={500}        
              height={500}        
              className="rounded-lg shadow-lg mb-4" 
            />
            <AddToExhibitionButton 
              artwork={artwork} 
              exhibitions={exhibitions} 
              setExhibitions={setExhibitions} 
              onAdd={(artwork, id) => {
                setAddedExhibitions((prev) => [...prev, id]);
              }}
            />
          </div>
          <p
          
            className="text-lg md:text-xl lg:text-2xl font-medium mb-4"
          >
            {artwork.artist_title}
          </p>
          <p className="text-md md:text-lg lg:text-xl mb-4 text-gray-700">
            {artwork.date_display}
          </p>
          <p className="text-md md:text-lg lg:text-xl mb-4 mt-6 text-black-700">
            {showFullDescription ? artwork.description : limitedDescription}
            {artwork.description.length > 500 && !showFullDescription && (
              <button 
                onClick={() => setShowFullDescription(true)} 
                className="text-black-500 underline mt-2"
              >
                Read more
              </button>
            )}
            {showFullDescription && (
              <button 
                onClick={() => setShowFullDescription(false)} 
                className="text-black-500 underline mt-2"
              >
                Show less
              </button>
            )}
          </p>
          <p className="text-md md:text-lg lg:text-xl mb-4 text-black-700">
            {artwork.gallery_title ? (
              <>You can find this artwork at {artwork.gallery_title}</>
            ) : (
              <>Unfortunately, the current location of this artwork is unknown.</>
            )}
          </p>
          <p className="text-md md:text-lg lg:text-xl mb-4 mt-6 text-black-800 font-bold">
            Exhibition history
          </p>
          <ul className="list-disc list-inside">
            {displayedExhibitionHistory.length > 0 ? displayedExhibitionHistory : <li>No exhibition history available.</li>}
          </ul>
          {exhibitionHistoryItems.length > 5 && !showFullHistory && ( 
            <button 
              onClick={() => setShowFullHistory(true)} 
              className="text-black-500 underline mt-2"
            >
              Show more
            </button>
          )}
          {showFullHistory && ( 
            <button 
              onClick={() => setShowFullHistory(false)} 
              className="text-black-500 underline mt-2"
            >
              Show less
            </button>
          )}
        </div>
        <div className="hidden md:block md:w-1/2 lg:w-3/5 max-w-lg mx-auto lg:mx-0">
          <div className="w-full">
            <Image
              src={artwork.image_url || '/placeholder.jpg'}
              alt={artwork.title}
              layout="responsive" 
              width={500}         
              height={500}        
              className="rounded-lg shadow-lg mb-6" 
            />
          </div>
          <AddToExhibitionButton 
            artwork={artwork} 
            exhibitions={exhibitions} 
            setExhibitions={setExhibitions} 
            onAdd={(artwork, id) => {
              setAddedExhibitions((prev) => [...prev, id]);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtworkPage;
