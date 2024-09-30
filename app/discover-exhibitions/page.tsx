"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaImage, FaHeart, FaRegHeart } from 'react-icons/fa';

const UpcomingAndCurrentExhibitions: React.FC = () => {
    const [upcomingExhibitions, setUpcomingExhibitions] = useState<any[]>([]);
    const [currentExhibitions, setCurrentExhibitions] = useState<any[]>([]);
    const [pastExhibitions, setPastExhibitions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<number[]>([]);

    const API_KEY = '1755f78a-d3f0-4cbf-8c85-68be947e649a';

    useEffect(() => {
        const fetchExhibitions = async () => {
            try {
                const responses = await Promise.all([
                    fetch(`https://api.harvardartmuseums.org/exhibition?apikey=${API_KEY}&status=upcoming`),
                    fetch(`https://api.harvardartmuseums.org/exhibition?apikey=${API_KEY}&status=current`),
                    fetch(`https://api.harvardartmuseums.org/exhibition?apikey=${API_KEY}&status=past`)
                ]);

                const [upcomingData, currentData, pastData] = await Promise.all(responses.map(res => {
                    if (!res.ok) throw new Error('Failed to fetch exhibitions');
                    return res.json();
                }));

                setUpcomingExhibitions(upcomingData.records);
                setCurrentExhibitions(currentData.records);
                setPastExhibitions(pastData.records);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);

        fetchExhibitions();
    }, [API_KEY]);

    const toggleFavorite = (exhibitionId: number) => {
        const updatedFavorites = favorites.includes(exhibitionId)
            ? favorites.filter((id) => id !== exhibitionId)
            : [...favorites, exhibitionId];

        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        const exhibition = [...upcomingExhibitions, ...currentExhibitions, ...pastExhibitions].find(ex => ex.id === exhibitionId);
        if (exhibition) {
            const savedExhibitions = JSON.parse(localStorage.getItem("savedExhibitions") || "[]");
            if (!updatedFavorites.includes(exhibitionId)) {
                const updatedSavedExhibitions = savedExhibitions.filter((savedExhibition: any) => savedExhibition.id !== exhibitionId);
                localStorage.setItem("savedExhibitions", JSON.stringify(updatedSavedExhibitions));
            } else {
                localStorage.setItem("savedExhibitions", JSON.stringify([...savedExhibitions, exhibition]));
            }
        }
    };

    const truncateDescription = (description: string) => {
        if (!description) return 'No description available';
        const firstPeriodIndex = description.indexOf('.');
        return firstPeriodIndex === -1 || firstPeriodIndex > 300
            ? description.length > 300 ? description.slice(0, 300) + '...' : description
            : description.slice(0, firstPeriodIndex + 1);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const renderExhibitionCard = (exhibition: any) => (
        <div key={exhibition.id} className="border rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 relative">
            <Link href={`/discovered-exhibition/${exhibition.id}`}>
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
        <p className="text-gray-600">{truncateDescription(exhibition.description)}</p>
    </div>
</Link>
            <button
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                onClick={(e) => {
                    e.stopPropagation(); 
                    toggleFavorite(exhibition.id);
                }}
            >
                {favorites.includes(exhibition.id) ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
            </button>
        </div>
    );

    return (
        <div className="container mx-auto p-2">
            <h2 className="text-4xl font-bold mb-8">Upcoming Exhibitions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {upcomingExhibitions.length === 0 ? (
                    <p>No upcoming exhibitions found</p>
                ) : (
                    upcomingExhibitions.map(renderExhibitionCard)
                )}
            </div>

            <h2 className="text-4xl font-bold mt-8 mb-8">Current Exhibitions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {currentExhibitions.length === 0 ? (
                    <p>No current exhibitions found</p>
                ) : (
                    currentExhibitions.map(renderExhibitionCard)
                )}
            </div>

            <h2 className="text-4xl font-bold mt-8 mb-8">Past Exhibitions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {pastExhibitions.length === 0 ? (
                    <p>No past exhibitions found</p>
                ) : (
                    pastExhibitions.map(renderExhibitionCard)
                )}
            </div>
        </div>
    );
};

export default UpcomingAndCurrentExhibitions;
