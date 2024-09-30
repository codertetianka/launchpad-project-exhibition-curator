"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaSlidersH, FaTh, FaArrowLeft, FaArrowRight } from "react-icons/fa"; 
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ExhibitionPage = ({ params }) => {
  const router = useRouter();
  const exhibitionId = Number(params.id);
  const [exhibition, setExhibition] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sliderRef, setSliderRef] = useState(null);

  useEffect(() => {
    try {
      const storedExhibitions = localStorage.getItem('exhibitions');
      const exhibitions = storedExhibitions ? JSON.parse(storedExhibitions) : [];
      const foundExhibition = exhibitions.find((ex) => ex.id === exhibitionId);
      setExhibition(foundExhibition);
      setNewName(foundExhibition?.name || '');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [exhibitionId]);

  const handleSaveName = () => {
    if (newName && exhibition) {
      const updatedExhibition = { ...exhibition, name: newName };
      const exhibitions = JSON.parse(localStorage.getItem('exhibitions')).map((ex) => {
        if (ex.id === exhibitionId) {
          return updatedExhibition;
        }
        return ex;
      });

      localStorage.setItem('exhibitions', JSON.stringify(exhibitions));
      setExhibition(updatedExhibition);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    }
  };

  const handleRemoveArtwork = (artworkId) => {
    if (exhibition) {
      const updatedArtworks = exhibition.artworks.filter((artwork) => artwork.id !== artworkId);
      const updatedExhibition = { ...exhibition, artworks: updatedArtworks };

      const exhibitions = JSON.parse(localStorage.getItem('exhibitions')).map((ex) => {
        if (ex.id !== exhibitionId) {
          return ex;
        }
        return updatedExhibition;
      });

      localStorage.setItem('exhibitions', JSON.stringify(exhibitions));
      setExhibition(updatedExhibition);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (sliderRef) {
      if (e.key === 'ArrowRight') {
        sliderRef.slickNext();
      } else if (e.key === 'ArrowLeft') {
        sliderRef.slickPrev();
      }
    }
  }, [sliderRef]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!exhibition) {
    return <div>Loading...</div>;
  }

  const CustomArrow = ({ className, style, onClick, icon }: { className?: string, style?: CSSProperties, onClick?: () => void; icon: any }) => (
    <div
      className={`${className} z-10 bg-gray-200 hover:bg-gray-300 transition transform translate-y-1/2`}
      style={{ ...style, display: 'block', width: '50px', height: '50px' }}
      onClick={onClick}
    >
      {icon}
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    centerMode: true,
    centerPadding: '0px',
    nextArrow: <CustomArrow icon={<FaArrowRight size={24} />} />,
    prevArrow: <CustomArrow icon={<FaArrowLeft size={24} />} />,
    afterChange: (current) => {
     
      console.log('Current slide index:', current);
    },
  };

  return (
    <div className="container mx-auto p-4">
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleSaveName}
          onKeyDown={handleKeyPress}
          autoFocus
          className="text-4xl font-bold mb-10 border-b border-gray-400 focus:outline-none"
        />
      ) : (
        <h1
          className="text-4xl font-bold mb-10 cursor-text hover:cursor-text"
          onDoubleClick={() => setIsEditing(true)}
          title="Double-click to edit"
        >
          {exhibition.name || "Untitled Exhibition"}
        </h1>
      )}

<h2 className="text-2xl mb-8">
  Use search to add artworks to{' '}
  <Link href="/user-profile" className="text-black font-bold hover:underline">
    your exhibitions
  </Link>.
</h2>


      <div className="flex mb-6">
        <button
          onClick={() => setViewMode('grid')}
          className={`mr-4 ${viewMode === 'grid' ? 'text-black' : 'text-gray-500'} hover:text-black`}
        >
          <FaTh size={24} />
        </button>
        <button
          onClick={() => setViewMode('slideshow')}
          className={`${viewMode === 'slideshow' ? 'text-black' : 'text-gray-500'} hover:text-black`}
        >
          <FaSlidersH size={24} />
        </button>
      </div>

      {viewMode === 'grid' ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {exhibition.artworks.map((artwork) => (
      <div key={artwork.id} className="border rounded-lg overflow-hidden shadow-lg relative">
        <Link href={`/artwork/${artwork.id}`}>
          <div className="relative w-full h-80"> 
            <Image
              src={artwork.image_url}
              alt={artwork.title}
              fill
              style={{ objectFit: 'cover' }}
              className="w-full h-full"
            />
          </div>
        </Link>
        <div className="p-4 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">{artwork.title}</h3>
            <Link href={`/artist/${artwork.artist_id}`}>
              <p className="text-gray-600 hover:underline">by {artwork.artist_title}</p>
            </Link>
          </div>
          <button
            onClick={() => handleRemoveArtwork(artwork.id)}
            className="text-black hover:text-red-600 transition"
          >
            <FaTrash size={24}/>
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <Slider ref={setSliderRef} {...settings}>
    {exhibition.artworks.map((artwork) => (
      <div key={artwork.id} className="flex flex-col justify-center items-center w-full h-[1000px]"> 
        <Link href={`/artwork/${artwork.id}`} className="relative w-full h-[80%] flex justify-center items-center mb-12 mt-11">
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            fill
            style={{ objectFit: 'contain' }} 
            className="w-full h-full"
          />
        </Link>
        <div className="text-center mt-4 w-full">
          <h3 className="text-xl font-semibold">{artwork.title}</h3>
          <Link href={`/artist/${artwork.artist_id}`}>
            <p className="text-gray-600 hover:underline">by {artwork.artist_title}</p>
          </Link>
        </div>
      </div>
    ))}
  </Slider>
)}


    </div>
  );
};

export default ExhibitionPage;
