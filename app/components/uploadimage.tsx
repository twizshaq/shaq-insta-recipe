"use client";

import { useRef, CSSProperties } from "react";
import { LuCopyPlus } from "react-icons/lu";
import { CiFileOn } from "react-icons/ci";
import { TbCamera } from "react-icons/tb";
import { LuCakeSlice } from "react-icons/lu";
import { LuSalad } from "react-icons/lu";
import { FaWineGlassEmpty } from "react-icons/fa6";

type AccentColor = "blue" | "green" | "orange" | "pink";

const ACCENT_BG_COLORS: Record<AccentColor, string> = {
  blue: "bg-[#0a90ff] hover:bg-[#057fe4]",
  green: "bg-[#1eab5d] hover:bg-[#17994f]",
  orange: "bg-[#db5415] hover:bg-[#c04a13]",
  pink: "bg-[#ff0988] hover:bg-[#e5087b]",
};

interface UploadImageProps {
  maxImages?: number;
  onImagesSelected?: (images: File[]) => void;
  accent: AccentColor;
  onRemoveImage: (index: number) => void;
  selectedImages: SelectedImage[];
}

interface SelectedImage {
  file: File;
  url: string;
}

export default function UploadImage({
  maxImages = 3,
  onImagesSelected,
  accent,
  onRemoveImage,
  selectedImages,
}: UploadImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = maxImages - selectedImages.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      
      if (onImagesSelected) {
        onImagesSelected([
          ...selectedImages.map(img => img.file),
          ...filesToAdd
        ]);
      }
    }
  };

  const getImageStyle = (index: number, total: number): CSSProperties => {
    let style: CSSProperties = {
      position: "absolute",
      width: "120px",
      height: "120px",
      borderRadius: "20px",
      objectFit: "cover",
      border: "2px solid white",
      left: "50%",
      top: "70%",
      transform: "translate(-50%, -50%)",
      zIndex: index + 1,
    };

    if (total === 2) {
      style.marginLeft = index === 0 ? "50px" : "-50px";
      style.transform += index === 0 ? " rotate(10deg)" : " rotate(-10deg)";
    } else if (total === 3) {
      if (index === 0) {
        // style.marginTop = "100%";
        style.marginLeft = "70px";
        style.transform += " rotate(10deg)";
      } else if (index === 1) {
        style.marginLeft = "-70px";
        style.transform += " rotate(-10deg)";
      } else {
        style.zIndex = 3;
        style.filter = "drop-shadow(0px 0px 7px rgba(0, 0, 0, .8))";
      }
    }

    return style;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#000000] bg-opacity-[.4] rounded-[46px] py-[80px] w-[450px] max-w-[100%] h-[275px] max-h-[100%] gap-[0px]">
      {selectedImages.length === 0 && (
        <div className="flex flex-col items-center text-white text-center gap-[15px]">
          <span className="text-[5rem] z-[2]"><CiFileOn /></span>
          <div className="absolute flex justify-center items-center mt-[7px] h-[65px] w-[47px] bg-[#06070B] z-[1] rounded-[10px] rounded-tr-[25px]">
            <span className="text-[1.7rem] mt-[10px]"><LuSalad /></span>
          </div>
          <span className="absolute text-[1.7rem] ml-[83px] mt-[24px] rotate-[20deg]"><LuCakeSlice /></span>
          <span className="absolute text-[1.6rem] mr-[85px] mt-[27px] rotate-[-20deg]"><FaWineGlassEmpty /></span>
          <span className="absolute mb-[50px] mr-[85px] rotate-[-20deg] text-[4.5rem]"><CiFileOn /></span>
          <span className="absolute mb-[50px] ml-[85px] rotate-[20deg] text-[4.5rem]"><CiFileOn /></span>
          <p className="font-bold text-[1.5rem]">Analyze Your Images</p>
        </div>
      )}

      <div className="flex flex-row-reverse gap-[20px] mt-[25px]">
        {selectedImages.length === 0 && (
          <>
            <button 
              className={`flex items-center text-white font-bold py-[10px] pl-[20px] pr-[25px] rounded-full gap-[10px] z-[0] ${ACCENT_BG_COLORS[accent]}`} 
              onClick={handleUploadClick}
            >
              <span className="text-[1.4rem]"><LuCopyPlus /></span>
              Upload
            </button>
            <button 
              className={`flex items-center text-white font-bold py-[10px] pl-[15px] pr-[25px] rounded-full gap-[10px] z-[0] ${ACCENT_BG_COLORS[accent]}`} 
              onClick={handleCameraClick}
            >
              <span className="text-[1.7rem]"><TbCamera /></span>
              Camera
            </button>
          </>
        )}
      </div>

      {selectedImages.length > 0 && (
        <div className="relative my-[0px] flex w-80 h-[275px] z-[0]">
          {selectedImages.map((image, index) => (
            <div
              key={image.url}
              className="relative"
              style={getImageStyle(index, selectedImages.length)}
            >
              <img
                src={image.url}
                alt="Preview"
                className="w-full h-full rounded-[18px] object-cover"
              />
              <button
                onClick={() => onRemoveImage(index)}
                className={`absolute top-[7px] ${
                  index === 2 ? 'left-1/2 -translate-x-1/2' :
                  index === 1 ? 'left-[7px]' : 'right-[7px]'
                } bg-red-500 bg-opacity-[.9] text-white rounded-[7px] p-[2px] text-xs hover:bg-red-700 focus:outline-none z-[2]`}
                aria-label={`Remove image ${index + 1}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="#FFFFFF">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            className={`absolute right-[33px] top-[120px] flex items-center text-white font-bold rounded-full gap-[10px] z-[3] border[1.5px] transition-all ${
              selectedImages.length < maxImages 
                ? ``
                : "text-[#6f6f6f]"
            }`}
            onClick={handleUploadClick}
            disabled={selectedImages.length >= maxImages}
          >
            <LuCopyPlus className="text-[1.4rem]" />
            Add
          </button>
          
          {/* {selectedImages.length >= maxImages && (
            <p className="absolute text-gray-300 text-sm mt-[45px]">
              Maximum of {maxImages} images reached
            </p>
          )} */}
        </div>
      )}

      <input
        type="file"
        ref={cameraInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
}