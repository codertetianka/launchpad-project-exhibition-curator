"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const ExhibitionDetailsPage: React.FC = () => {
    const [exhibition, setExhibition] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { id } = useParams();
    const API_KEY = '1755f78a-d3f0-4cbf-8c85-68be947e649a';

    useEffect(() => {
        if (id) {
            const fetchExhibition = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`https://api.harvardartmuseums.org/exhibition/${id}?apikey=${API_KEY}`);
                    if (!res.ok) throw new Error('Failed to fetch exhibition details');
                    const data = await res.json();
                    setExhibition(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchExhibition();
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!exhibition) return <div>No exhibition found</div>;

    return (
        <div className="container mx-auto p-4 md:py-16 lg:px-32">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                {exhibition.title}
            </h1>

            {exhibition.primaryimageurl ? (
                <div className="relative w-full h-96 mb-6">
                    <Image
                        src={exhibition.primaryimageurl}
                        alt={exhibition.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg shadow-lg mb-6"
                    />
                </div>
            ) : (
                <div className="w-full h-96 flex justify-center items-center bg-gray-200 rounded-lg">
                    <p>No image available</p>
                </div>
            )}

            <div className="text-lg md:text-xl mb-4 text-black-700">
                {exhibition.description 
                    ? exhibition.description.split('\n').map((paragraph: string, index: number) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                    )) 
                    : 'No description available.'
                }
            </div>

            <p className="text-md md:text-lg lg:text-xl mb-4 text-black-600 font-semibold">
                Start Date: {exhibition.begindate}
            </p>
            <p className="text-md md:text-lg lg:text-xl mb-4 text-black-600 font-semibold">
                End Date: {exhibition.enddate}
            </p>
        </div>
    );
};

export default ExhibitionDetailsPage;
