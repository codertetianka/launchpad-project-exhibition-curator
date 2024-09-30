import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import Link from 'next/link';

interface AddToExhibitionButtonProps {
  artwork: any; 
  exhibitions: any[]; 
  onAdd?: (artwork: any, exhibitionId: number) => void; 
  setExhibitions: React.Dispatch<React.SetStateAction<any[]>>; 
}

const AddToExhibitionButton: React.FC<AddToExhibitionButtonProps> = ({
  artwork,
  exhibitions,
  onAdd,
  setExhibitions,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState<any | null>(null);
  const [addedExhibitions, setAddedExhibitions] = useState<number[]>([]);

  const handleAdd = (artwork: any, exhibitionId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    const updatedExhibitions = exhibitions.map((exhibition) => {
      if (exhibition.id === exhibitionId) {
        const artworkExists = exhibition.artworks.find((art: any) => art.id === artwork.id);
        if (!artworkExists) {
          return {
            ...exhibition,
            artworks: [...exhibition.artworks, artwork],
          };
        }
      }
      return exhibition;
    });

    setExhibitions(updatedExhibitions);
    if (typeof window !== "undefined") {
      localStorage.setItem('exhibitions', JSON.stringify(updatedExhibitions));
    }
    setSelectedExhibition(exhibitions.find((ex) => ex.id === exhibitionId) || null);
    setAddedExhibitions((prev) => [...prev, exhibitionId]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(event) => {
          event.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
        className="bg-black text-white py-2 px-4 my-2 rounded-lg border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition duration-300"
      >
        {isDropdownOpen ? 'Close' : 'Add to exhibition'}
      </button>

      {isDropdownOpen && (
        <div className="absolute bg-white shadow-lg rounded-lg mt-2 z-10">
          {exhibitions.length === 0 ? (
            <p className="p-4 text-gray-600">No exhibitions available.</p>
          ) : (
            exhibitions.map((exhibition) => (
              <button
                key={exhibition.id}
                onClick={(event) => handleAdd(artwork, exhibition.id, event)}
                className="w-full text-left px-4 py-2 hover:bg-gray-200 flex justify-between items-center"
              >
                <span>{exhibition.name || "Untitled Exhibition"}</span>
                {addedExhibitions.includes(exhibition.id) && (
                  <FaCheck className="text-green-600 pl-2" />
                )}
              </button>
            ))
          )}
        </div>
      )}

      {selectedExhibition && (
        <p className="mt-6 mb-2 mr-4 text-black-600">
          Added to{' '}
          <Link
            href={`/exhibition/${selectedExhibition.id}`}
            className="text-green-500 hover:underline"
            onClick={(event) => event.stopPropagation()} // Prevent navigation to artwork
          >
            {selectedExhibition.name || "Untitled Exhibition"}
          </Link>
        </p>
      )}
    </div>
  );
};

export default AddToExhibitionButton;
