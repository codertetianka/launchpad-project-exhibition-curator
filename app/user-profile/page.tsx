"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPen, FaTrash, FaImage, FaCheck, FaUndo } from "react-icons/fa"; 
import BackToTopButton from "@/components/Utility/BackToTopButton";
import Image from "next/image"; 
import SavedExhibitions from "@/components/Utility/SavedExhibitions";

const UserPage = () => {
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [editingExhibitionId, setEditingExhibitionId] = useState<number | null>(null);
  const [newExhibitionName, setNewExhibitionName] = useState("");
  const router = useRouter();

  useEffect(() => {
    
    const savedExhibitions = JSON.parse(localStorage.getItem("exhibitions") || "[]");
    setExhibitions(savedExhibitions);

   
    const handleStorageChange = () => {
      const updatedExhibitions = JSON.parse(localStorage.getItem("exhibitions") || "[]");
      setExhibitions(updatedExhibitions);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const createExhibition = () => {
    const newExhibition = { id: Date.now(), name: "New Exhibition", artworks: [], pendingDelete: false };
    const updatedExhibitions = [...exhibitions, newExhibition];

    setExhibitions(updatedExhibitions);
    localStorage.setItem("exhibitions", JSON.stringify(updatedExhibitions));
    setEditingExhibitionId(newExhibition.id); 
  };

  const markForDeletion = (id: number) => {
    const updatedExhibitions = exhibitions.map((exhibition) =>
      exhibition.id === id ? { ...exhibition, pendingDelete: true } : exhibition
    );
    setExhibitions(updatedExhibitions);
  };

  const undoDeletion = (id: number) => {
    const updatedExhibitions = exhibitions.map((exhibition) =>
      exhibition.id === id ? { ...exhibition, pendingDelete: false } : exhibition
    );
    setExhibitions(updatedExhibitions);
  };

  const confirmDeletion = (id: number) => {
    const updatedExhibitions = exhibitions.filter((exhibition) => exhibition.id !== id);
    setExhibitions(updatedExhibitions);
    localStorage.setItem("exhibitions", JSON.stringify(updatedExhibitions));
  };

  const handleExhibitionNameChange = (id: number, name: string) => {
    setEditingExhibitionId(id);
    setNewExhibitionName(name);
  };

  const saveExhibitionName = (id: number) => {
    const updatedExhibitions = exhibitions.map((exhibition) =>
      exhibition.id === id ? { ...exhibition, name: newExhibitionName } : exhibition
    );
    setExhibitions(updatedExhibitions);
    localStorage.setItem("exhibitions", JSON.stringify(updatedExhibitions));
    setEditingExhibitionId(null);
    setNewExhibitionName("");
  };

  const handleBlur = () => {
    if (editingExhibitionId !== null) {
      saveExhibitionName(editingExhibitionId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Your Exhibitions</h1>
    
      <button
  onClick={createExhibition}
  className="bg-black text-white border border-black py-2 px-6 rounded-lg mt-10 mb-10 
             hover:bg-white hover:text-black hover:border-black transition-colors duration-300"
>
  Create
</button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {exhibitions.map((exhibition) => (
          <div 
            key={exhibition.id} 
            className={`bg-white p-8 rounded-lg shadow-md flex items-center justify-between cursor-pointer ${
              exhibition.pendingDelete ? "opacity-50" : ""
            }`} 
            onClick={() => !editingExhibitionId && router.push(`/exhibition/${exhibition.id}`)} 
          >
            <div className="flex items-center space-x-2">
              {exhibition.artworks.length > 0 ? (
                <div className="relative w-20 h-20">
                  <Image
                    src={exhibition.artworks[0].image_url || ""}
                    alt={exhibition.artworks[0].title || "Artwork Preview"}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ) : (
                <FaImage className="text-gray-400 text-4xl" />
              )}

              {editingExhibitionId === exhibition.id ? (
                <input
                  type="text"
                  value={newExhibitionName}
                  onChange={(e) => setNewExhibitionName(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (editingExhibitionId && e.key === "Enter") saveExhibitionName(exhibition.id);
                  }}
                  className="text-lg font-medium border-b-2 border-gray-300 focus:outline-none"
                  autoFocus
                />
              ) : (
                <h2 className="text-2xl font-medium">
                  {exhibition.pendingDelete ? "Remove?" : exhibition.name || "Untitled Exhibition"}
                </h2>
              )}
            </div>

            <div className="flex items-center">
              {exhibition.pendingDelete ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      confirmDeletion(exhibition.id);
                    }}
                    className="text-black mr-4 text-2xl"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      undoDeletion(exhibition.id);
                    }}
                    className="text-black text-2xl"
                  >
                    <FaUndo />
                  </button>
                </>
              ) : (
                <>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleExhibitionNameChange(exhibition.id, exhibition.name);
                      setNewExhibitionName(exhibition.name); 
                }}
                    className="text-black mr-4 text-2xl"
              >
                <FaPen />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                      markForDeletion(exhibition.id);
                }}
                    className="text-black text-2xl"
              >
                <FaTrash />
              </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <h1 className="text-4xl font-bold mt-11 mb-9">Saved Exhibitions</h1>
      
      <SavedExhibitions />
      <BackToTopButton />
    </div>
  );
};

export default UserPage;
