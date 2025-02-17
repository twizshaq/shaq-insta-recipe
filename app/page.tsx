"use client"

import { useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { SparklesPreview } from "./components/SparklesPreview";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/app/components/accordion"
import dynamic from "next/dynamic";
import StoryCarousel from "./components/StoryCarousel";

export default function Home() {
   const router = useRouter();
   async function handleGoogleLogin() {
   try {
      const { data, error } = await supabase.auth.signInWithOAuth({
         provider: "google",
         options: {
         // Local dev or final URL
         redirectTo: "http://localhost:3000/",
         },
      });
      if (error) {
         console.error("Error during Google login:", error.message);
      }
      // data.session contains the user's session
   } catch (err) {
      console.error("Unexpected error during Google login:", err);
   }
   }
   const [activeTab, setActiveTab] = useState("Ingredients");

   const ingredients = [
      "200g (7 oz) spaghetti or any pasta of choice",
      "2 tablespoons unsalted butter",
      "2 cloves garlic, minced",
      "1/4 teaspoon red chili flakes (optional)",
      "Salt and pepper, to taste",
      "Fresh parsley or grated Parmesan (optional garnish)",
   ];

   const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
   new Array(ingredients.length).fill(false)
   );

   const toggleIngredient = (index: number) => {
   const newChecked = [...checkedIngredients];
   newChecked[index] = !newChecked[index];
   setCheckedIngredients(newChecked);
   };

   const instructions = [
      "1. Cook the pasta in salted boiling water according to the package instructions. Reserve 1/4 cup of pasta water before draining.",
      "2. In a pan, melt the butter over medium heat. Add the minced garlic and sauté for 1-2 minutes until fragrant (but not browned).",
      "3. Add the red chili flakes (if using) and stir briefly.",
      "4. Toss the cooked pasta in the pan with the garlic butter. Add a splash of the reserved pasta water to coat the pasta evenly.",
      "5. Season with salt and pepper to taste.",
      "6. Serve hot, garnished with parsley or Parmesan if desired.",
   ];

   return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh]">
         <div className="flex flex-col items-center max-w-[90%] gap-[30px] mt-[0px]">
         <p className="fontchange text-center text-[4.7rem] font-extrabold leading-[80px] mt-[100px]">Insta Recipe</p>
         <p className="text-center">Take the guesswork out of cooking simply upload a picture and uncover the recipe behind the meal.</p>
         </div>
         <div className="flex max-md:flex-col max-w-[90%] w-fit items-center justify-center mt-[70px] mb-[40px] gap-[40px] ml-[150px] max-md:ml-[0px]">
            <Image
               src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/food-plate.png"
               alt="food"
               height={350}
               width={350}
               className="max-md:block hidden"
            />
            <Image
               src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/food-plate.png"
               alt=""
               height={350}
               width={350}
               className="absolute max-md:h-[0px] mr-[450px]"
            />
         <div className="flex max-md:mt-[-150px] flex-col h-[390px] w-[350px] max-w-[95%] rounded-[50px] backdrop-blur-[20px] bg-[black] bg-opacity-[.6] overflow-hidden ">
            <div className="flex h-fit gap-[30px] self-center font-extrabold absolute pt-[25px] px-[25px] text-[1.2rem]">
               <button
               onClick={() => setActiveTab("Ingredients")}
               className={`${
                  activeTab === "Ingredients" ? "text-white" : "text-gray-500"
               }`}
               >
               Ingredients
               </button>
               <button
               onClick={() => setActiveTab("Instructions")}
               className={`${
                  activeTab === "Instructions" ? "text-white" : "text-gray-500"
               }`}
               >
               Instructions
               </button>
            </div>
            <div className="flex w-[85%] self-center mt-[75px] mb-[3px] overflow-y-scroll scrollbar-hidden">
               {activeTab === "Ingredients" && (
               <ul className="flex flex-col gap-[15px] text-[.88rem]">
               {ingredients.map((item, index) => (
                  <li key={index} className="flex items-center gap-[20px]">
                     <button
                     onClick={() => toggleIngredient(index)}
                     className={`flex justify-center items-center h-[30px] min-w-[30px] bg-transparent rounded-[12px] border-2 ${
                        checkedIngredients[index] 
                           ? "bg-[#0a90ff]" 
                           : "border-white"
                     }`}
                     >
                     {checkedIngredients[index] && (
                        <div className="min-h-[13px] min-w-[13px] rounded-[5px] bg-white"></div>
                     )}
                     </button>
                     <p className={`${
                     checkedIngredients[index] 
                        ? "line-through decoration-[3px]" 
                        : ""
                     }`}>
                     {item}
                     </p>
                  </li>
               ))}
               </ul>
               )}
               {activeTab === "Instructions" && (
               <ul className="flex flex-col gap-[20px] text-[.88rem] pb-[25px] h-fit">
                  {instructions.map((step, index) => {
                     // Split step into number and text
                     const parts = step.split(/\. (.+)/);
                     return (
                     <li key={index} className="flex gap-2">
                        {parts[0] && (
                           <span className="text-[1.07rem] font-bold">
                           {parts[0]}.
                           </span>
                        )}
                        {parts[1]}
                     </li>
                     );
                  })}
               </ul>
               )}
            </div>
         </div>
         </div>
         <div className="flex flex-col items-center justify-center gap-[15px] max-w-fit mb-[40px] mt-[50px]">
         <div className="flex flex-col items-center justify-center bottom-[60px] gap-[15px]">
            <div className="flex justify-center bottom-[200px] gap-[20px] w-[90%] max-w-[450px]">
               <Link href="/sign-up?active=signup"><button className="w-[150px] py-[10px] px-[20px] font-extrabold rounded-[30px] border-[1.5px] hover:bg-white hover:bg-opacity-[.2]">Sign Up</button></Link>
               <Link href="/sign-up"><button className="bg-white text-black w-fit py-[11px] px-[50px] font-extrabold rounded-[30px]" >Login</button></Link>
            </div>
            <div className="flex bottom-[160px] items-center gap-[10px]">
               <div className="w-[80px] h-[1px] bg-white"></div>
               <p className="font-semibold text-[.85rem] ">Or Register with</p>
               <div className="w-[80px] h-[1px] bg-white"></div>
            </div>
            <div className="flex bottom-[95px] gap-[20px]">
               <button className="flex gap-[10px] items-center py-[10px] px-[30px] rounded-[30px] border-[1.5px] hover:bg-white hover:bg-opacity-[.2] font-bold" onClick={handleGoogleLogin}>
               {/* <Image src={googleicon} alt="Google Logo" width={20} height={20} /> */}
               <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/google-logo.svg" alt="Google Logo svg" width={20} height={20} />
               <p>Sign in with google</p>
               </button>
               {/* <button className="p-[9px] rounded-[15px] border-[2px] hover:bg-white hover:bg-opacity-[.2]">
               <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/pinterest-logo.svg" alt="Pinterst Logo" width={22} height={22} />
               </button>
               <button className="p-[10px] rounded-[15px] border-[2px] hover:bg-white hover:bg-opacity-[.2]">
               <Image src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/x-logo.svg" alt="X Logo" width={20} height={20} className="filter invert" />
               </button> */}
            </div>
         </div>
         </div>
         <div className="flex flex-col w-fit max-w-[90%] h-fit mb-[50px] p-[10px] gap-[30px]">
         <div className="flex gap-[30px] flex-wrap-reverse justify-center">
            <div className="h-[300px] w-[230px] max-w-[90%] backdrop-blur-[20px] bg-[black] bg-opacity-[.6] rounded-[40px]"></div>
            <div className="w-[600px] h-[300px] max-w-[90%] backdrop-blur-[20px] bg-[black] bg-opacity-[.6] rounded-[40px]"></div>
         </div>
         <div className="flex gap-[30px] flex-wrap justify-center">
            <div className="h-[230px] w-[500px] max-w-[90%] backdrop-blur-[20px] bg-[black] bg-opacity-[.6] rounded-[40px]"></div>
            <div className="h-[230px] w-[330px] max-w-[90%] backdrop-blur-[20px] bg-[black] bg-opacity-[.6] rounded-[40px]"></div>
         </div>
         </div>
         <Accordion type="single" collapsible className="w-[500px] max-w-[85%] mb-[100px]">
         <AccordionItem value="item-1">
            <AccordionTrigger className="font-extrabold">How does Insta Recipe work?</AccordionTrigger>
            <AccordionContent>
               Insta Recipe uses advanced image recognition to analyze your uploaded food photos. It identifying ingredients and cooking techniques to create an accurate and easy-to-follow recipe.
            </AccordionContent>
         </AccordionItem>
         <AccordionItem value="item-2">
            <AccordionTrigger className="font-extrabold">Who is Insta Recipe for?</AccordionTrigger>
            <AccordionContent>
               Insta Recipe is for anyone who loves food! Whether you’re a beginner cook, a culinary enthusiast, Insta Recipe makes cooking simple and fun.
            </AccordionContent>
         </AccordionItem>
         <AccordionItem value="item-3">
            <AccordionTrigger className="font-extrabold">What makes Insta Recipe unique?</AccordionTrigger>
            <AccordionContent>
               Insta Recipe combines AI-powered image analysis with customizable recipes, making it easy to recreate dishes from just a photo.
            </AccordionContent>
         </AccordionItem>
         </Accordion>
         <Link href="/sign-up?active=signup"><button className="w-fit px-[30px] py-[10px] font-extrabold rounded-[30px] border-[2px] mb-[100px] hover:bg-white hover:bg-opacity-[.2] mt-[0px]">Sign up Now for Free!</button></Link>
         {/* <StoryCarousel
            imageSrc={["/meal1.jpg", "/meal2.jpg", "/meal3.jpg"]}
            seconds={3}
         /> */}
         <p className="text-white text-[.7rem] self-center font-extrabold mb-[7px]">© Insta Recipe 2025</p>
      </div>
   );
}