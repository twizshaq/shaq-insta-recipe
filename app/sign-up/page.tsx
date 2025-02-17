"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import food1 from "@/app/assets/food1.jpeg";
import food2 from "@/app/assets/food2.jpeg";
import food3 from "@/app/assets/food3.jpeg";
import { supabase } from "@/lib/supabaseClient";
import StoryCarousel from "../components/StoryCarousel";

export default function Signup() {
    const [showSignUp, setShowSignUp] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [confirmationPending, setConfirmationPending] = useState(false);
    const [signupError, setSignupError] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [googleError, setGoogleError] = useState<string | null>(null);

    useEffect(() => {
        if (searchParams.get("active") === "signup") {
            setShowSignUp(true);
        }
    }, [searchParams]);

    // Focus states (simplified)
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [emailLoginFocused, setEmailLoginFocused] = useState(false);
    const [passwordLoginFocused, setPasswordLoginFocused] = useState(false);



    // 1. Email/Password Sign Up
    async function handleEmailSignUp(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSignupError(null);
        setConfirmationPending(false);

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password || !username) {
            setSignupError("Please fill in all fields.");
            return;
        }

        try {

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username },
                    emailRedirectTo: window.location.origin + "/account", // Correct placement
                },
            });

            if (error) {
                setSignupError(error.message);
                return;
            }

            if (data?.user && !data.user.email_confirmed_at) {
                setConfirmationPending(true);
            } else {
                router.push("/account");
            }
        } catch (err) {
            console.error("Unexpected error during sign-up:", err);
            setSignupError("An unexpected error occurred.");
        }
    }

    // 2. Email/Password Login
async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("loginEmail") as string;
    const password = formData.get("loginPassword") as string;

    if (!email || !password) {
        setLoginError("Please fill in all fields.");
        return;
    }

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoginError(error.message);
            return;
        }

        // REMOVE THIS: router.push("/account"); // Redirect on success  <-- UNCOMMENT THIS LINE!
        router.push("/account"); // Redirect on success

    } catch (err) {
        console.error("Unexpected error during login:", err);
        setLoginError("An unexpected error occurred.");
    }
}

    // 3. Google OAuth Login (CORRECTED)
    async function handleGoogleLogin() {
        setGoogleError(null); // Clear previous errors
        try {
            // ADD await HERE:
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + "/account", //Dyanmic redirect!
                },
            });

            if (error) {
                console.error("Error during Google login:", error.message);
                setGoogleError(error.message); // Set a specific error message
                return;
            }
            //Supabase handles the redirect, we don't need to do anything else

        } catch (err: any) {
            console.error("Unexpected error during Google login:", err);
            setGoogleError("An unexpected error occurred during Google Sign-In."); // Set a generic error
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] overflow-x-hidden">
            <div className="flex flex-wrap p-[30px] h-fit w-fit items-center justify-center rounded-[40px] mt-[30px] mb-[50px]">
                <StoryCarousel imageSrc={["https://insta-recipe-assets.s3.us-east-1.amazonaws.com/food1.jpeg", "https://insta-recipe-assets.s3.us-east-1.amazonaws.com/food2.jpeg", "https://insta-recipe-assets.s3.us-east-1.amazonaws.com/food3.jpeg"]} seconds={5} />

                <div className="flex flex-col items-center">
                    <div className="flex gap-[60px] mb-[40px] text-[1.3rem]">
                        <button
                            className={`font-bold ${showSignUp ? "text-white" : "text-[#757575]"}`}
                            onClick={() => setShowSignUp(true)}
                        >
                            Sign up
                        </button>
                        <button
                            className={`font-bold ${!showSignUp ? "text-white" : "text-[#757575]"}`}
                            onClick={() => setShowSignUp(false)}
                        >
                            Login
                        </button>
                    </div>

                    {/* Display Signup Error */}
                    {signupError && (
                        <div className="text-red-500 text-center mb-[20px]">
                            {signupError}
                        </div>
                    )}

                    {/* Display Login Error */}
                    {loginError && (
                        <div className="text-red-500 text-center mb-[20px]">
                            {loginError}
                        </div>
                    )}

                    {/*Display Google Login Error*/}
                    {googleError && (
                        <div className="text-red-500 text-center mb-[20px]">
                            {googleError}
                        </div>
                    )}

                    {confirmationPending && (
                        <div className="text-white text-center mb-[20px]">
                            <p>Signup successful! Please check your email.</p>
                        </div>
                    )}

                    {showSignUp ? (
                        <>
                            <form
                                onSubmit={handleEmailSignUp}
                                className="flex flex-col gap-[30px] items-center z-[30] w-[400px] max-w-[80%] relative"
                                autoComplete="off"
                            >
                                <p className="absolute font-bold self-end mr-[30px] mt-[-10px] text-[.9rem] px-[5px] bg-[--background] rounded-[4px] transition-colors">
                                    <span className={emailFocused ? "imageshine-blue" : "text-white"}>
                                        Email
                                    </span>
                                </p>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    required
                                />

                                <p className="absolute font-bold self-end mr-[30px] mt-[70px] text-[.9rem] px-[5px] bg-[--background] rounded-[4px] transition-colors">
                                    <span className={passwordFocused ? "imageshine-blue" : "text-white"}>
                                        Password
                                    </span>
                                </p>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    required
                                />

                                <p className="absolute font-bold self-end mr-[30px] mt-[150px] text-[.9rem] px-[5px] bg-[--background] rounded-[4px] transition-colors">
                                    <span className={usernameFocused ? "imageshine-blue" : "text-white"}>
                                        Username
                                    </span>
                                </p>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="eg. twizshaq"
                                    className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                                    onFocus={() => setUsernameFocused(true)}
                                    onBlur={() => setUsernameFocused(false)}
                                    required
                                />

                                <button
                                    type="submit"
                                    className="font-bold border-[1.5px] px-[30px] py-[10px] rounded-[30px] hover:bg-white hover:bg-opacity-[.2]"
                                >
                                    Create Account
                                </button>
                            </form>

                            <div className="flex bottom-[160px] items-center gap-[10px] mt-[30px]">
                                <div className="w-[80px] h-[1px] bg-white"></div>
                                <p className="font-semibold text-[.85rem]">Or Register with</p>
                                <div className="w-[80px] h-[1px] bg-white"></div>
                            </div>

                            <div className="flex bottom-[95px] gap-[20px] mt-[30px]">
                                <button
                                    className="flex gap-[10px] items-center py-[10px] px-[30px] rounded-[30px] border-[2px] hover:bg-white hover:bg-opacity-[.2] font-bold"
                                    onClick={handleGoogleLogin} // Attach the handler
                                    type="button" // Use type="button" to prevent form submission
                                >
                                    <Image
                                        src="https://insta-recipe-assets.s3.us-east-1.amazonaws.com/google-logo.svg"
                                        alt="Google Logo svg"
                                        width={20}
                                        height={20}
                                    />
                                    <p>Sign in with Google</p>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <form
                                onSubmit={handleEmailLogin}
                                className="flex flex-col gap-[30px] items-center z-[30] w-[400px] max-w-[80%] relative"
                                autoComplete="off"
                            >
                                <p className="absolute font-bold self-end mr-[30px] mt-[-10px] text-[.9rem] px-[5px] bg-[--background] rounded-[4px] transition-colors">
                                    <span className={emailLoginFocused ? "imageshine-blue" : "text-white"}>
                                        Email
                                    </span>
                                </p>
                                <input
                                    type="email"
                                    name="loginEmail"
                                    placeholder="Email"
                                    className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                                    onFocus={() => setEmailLoginFocused(true)}
                                    onBlur={() => setEmailLoginFocused(false)}
                                    required
                                />

                                <p className="absolute font-bold self-end mr-[30px] mt-[70px] text-[.9rem] px-[5px] bg-[--background] rounded-[4px] transition-colors">
                                    <span className={passwordLoginFocused ? "imageshine-blue" : "text-white"}>
                                        Password
                                    </span>
                                </p>
                                <input
                                    type="password"
                                    name="loginPassword"
                                    placeholder="Password"
                                    className="rounded-[20px] w-[100%] px-[20px] py-[12px] font-bold border-[1.5px] bg-transparent outline-none"
                                    onFocus={() => setPasswordLoginFocused(true)}
                                    onBlur={() => setPasswordLoginFocused(false)}
                                    required
                                />

                                <button
                                    type="submit"
                                    className="font-bold border-[1.5px] px-[30px] py-[10px] rounded-[30px] hover:bg-white hover:bg-opacity-[.2]"
                                >
                                    Login
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}