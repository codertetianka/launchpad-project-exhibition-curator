"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';
import Link from 'next/link'; 

const SavedExhibitions: React.FC = () => {
    const [savedExhibitions, setSavedExhibitions] = useState<any[]>([]);

    useEffect(() => {
        const savedExhibitionsData = JSON.parse(localStorage.getItem("savedExhibitions") || "[]");
        setSavedExhibitions(savedExhibitionsData);
    }, []);

    const renderExhibitionCard = (exhibition: any) => (
        <Link key={exhibition.id} href={`/discovered-exhibition/${exhibition.id}`}>
            <div className="border rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 relative">
                <div className="relative w-full h-96">
                    {exhibition.primaryimageurl ? (
                        <Image
                            src={exhibition.primaryimageurl}
                            alt={exhibition.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="flex justify-center items-center w-full h-full bg-gray-200">
                            <FaImage className="text-gray-400 w-12 h-12" />
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-xl font-semibold">{exhibition.title}</h3>
                    <p className="text-gray-600">Start Date: {exhibition.begindate}</p>
                    <p className="text-gray-600">End Date: {exhibition.enddate}</p>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {savedExhibitions.length === 0 ? (
                    <p>No saved exhibitions found</p>
                ) : (
                    savedExhibitions.map(renderExhibitionCard)
                )}
            </div>
        </div>
    );
};

export default SavedExhibitions;
