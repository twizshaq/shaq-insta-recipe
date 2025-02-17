"use client";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";


type StoryCarouselProps = {
    imageSrc: string[];
    seconds: number;
};

const StoryCarousel = ({ imageSrc, seconds }: StoryCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState<number[]>([]); // Initialize as empty array.

     // Initialize progress array when imageSrc changes.
    useEffect(() => {
        setProgress(Array(imageSrc.length).fill(0));
    }, [imageSrc]);


    useEffect(() => {
        const changeImageInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % imageSrc.length;
                if (nextIndex === 0) {
                    setProgress(new Array(imageSrc.length).fill(0));
                }
                return nextIndex;
            });
        }, seconds * 1000);

        return () => {
            clearInterval(changeImageInterval);
        };
    }, [seconds, imageSrc]); // Add imageSrc as a dependency

    useEffect(() => {
        if (imageSrc.length === 0) return; // Prevent errors if imageSrc is empty

        const progressInterval = setInterval(() => {
            setProgress((prevProgress) => {
                // Create a new array to avoid modifying the state directly.
                const newProgress = [...prevProgress];
                if (newProgress[currentIndex] !== undefined) {
                    newProgress[currentIndex] = Math.min(newProgress[currentIndex] + 1, 100);
                }
                return newProgress;
            });
        }, (seconds * 1000) / 100); // Correct interval for 1% progress

        return () => clearInterval(progressInterval);
    }, [currentIndex, seconds, imageSrc]);

    useEffect(() => {
        if (imageSrc.length === 0) return;

        setProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[currentIndex] = 0;
            return newProgress;
        });
    }, [currentIndex, imageSrc]);

    if (imageSrc.length === 0) {
        return <div>No images to display.</div>; // Handle empty image array
    }

    return (
        <div className="relative rounded-[16px] w-[400px] max-w-[85%] h-[660px] max-mobile3:h-[300px] overflow-hidden">
            {/* Image */}
            <img
                src={imageSrc[currentIndex]}
                alt=""
                className="w-full h-full object-cover" // Ensure image fills the container
            />

            {/* Progress Bars */}
            <div className="absolute top-2 left-0 w-full flex px-2 py-1 space-x-1">
                {imageSrc.map((_, index) => (
                    <div key={index} className="flex-1 bg-gray-600 rounded-full h-1">
                        <div
                            className="bg-white h-full rounded-full transition-all duration-100 ease-linear"
                            style={{ width: `${progress[index] || 0}%` }} // Use 0 as default if progress[index] is undefined
                        ></div>
                    </div>
                ))}
            </div>

            <p className="absolute top-[30px] left-4 fontchange text-center text-[1.7rem] font-extrabold leading-[30px] text-white">
                Insta <br /> Recipe
            </p>
        </div>
    );
};

export default StoryCarousel;