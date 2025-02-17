import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import PinterestProvider from "next-auth/providers/pinterest";

const authOptions = {
    providers: [
    // Google provider setup
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Twitter provider setup
    TwitterProvider({
        clientId: process.env.TWITTER_CLIENT_ID!,
        clientSecret: process.env.TWITTER_CLIENT_SECRET!,
        version: "2.0", // Use Twitter API v2
    }),
    // Pinterest provider setup
    PinterestProvider({
        clientId: process.env.PINTEREST_CLIENT_ID!,
        clientSecret: process.env.PINTEREST_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET!, // Used to encrypt session data
};

export default NextAuth(authOptions);