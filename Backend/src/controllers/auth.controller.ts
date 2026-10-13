import { OAuth2Client } from "google-auth-library";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { validationResult } from "express-validator";
import User from "../models/User.model";
import { cookieOptions } from "../constants";
import dotenv from "dotenv";

dotenv.config();

// Google OAuth2 Client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth environment variables are not configured");
}

const client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "postmessage" // Required for useGoogleLogin hook
);

// === Google Auth ===
const googleOAuth = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        throw new ApiError(400, JSON.stringify(result.mapped()));
    }

    const { code } = req.body;

    if (!code) {
        throw new ApiError(400, "Authorization code is missing");
    }

    try {
        // 2. Exchange code for tokens
        const { tokens } = await client.getToken(code);

        // 3. Verify the ID Token from the tokens object
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new ApiError(400, "Invalid Google token payload");
        }

        const { sub, email, name, picture, email_verified } = payload;

        // 4. Database logic (Find or Create)
        let user = await User.findOne({ email });
        if (user) {
            user.googleId = sub;
            user.photo = picture || user.photo || "";
            user.name = name || user.name || "";
            user.verifiedEmail = email_verified || false;
            await user.save();
        } else {
            user = await User.create({
                googleId: sub,
                email,
                name,
                photo: picture,
                verifiedEmail: email_verified,
            });
        }

        const token = (user as any).generateJWT();

        // 5. Response - Send JSON to allow React to handle the redirect
        res.cookie("authToken", token, cookieOptions)
            .status(200)
            .json({
                success: true,
                message: "Authentication successful",
                user: {
                    name: user.name,
                    email: user.email,
                    photo: user.photo,
                },
            });
    } catch (error) {
        console.error("Google Auth Error:", error);
        throw new ApiError(400, "Google authentication failed");
    }
});

// === GitHub Auth ===
// Damn this shit was fun, too much manual effort but fun.
const githubOAuth = asyncHandler(async (req: Request, res: Response) => {
    // Validate request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        throw new ApiError(400, JSON.stringify(result.mapped()));
    }

    const requestToken = req.query.code;

    // Exchange code for access token from GitHub
    const response = await fetch(
        `https://github.com/login/oauth/access_token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: requestToken,
            }),
        }
    );
    const data: any = await response.json();
    if (!response.ok || data.error || !data.access_token) {
        throw new ApiError(
            400,
            data.error_description || "Invalid GitHub token"
        );
    }
    const access_token = data.access_token;

    // Fetch user info from GitHub API using the access token
    const userResponse = await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
            "User-Agent": "Node",
        },
    });
    const user: any = await userResponse.json();
    if (!userResponse.ok || !user?.id || !user?.login) {
        throw new ApiError(400, "Failed to fetch GitHub user");
    }

    // Check if email is available
    if (!user?.email) {
        // Fetch user emails
        const emailResponse = await fetch(
            "https://api.github.com/user/emails",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: "application/json",
                    "User-Agent": "Node",
                },
            }
        );

        // Parse emails response, find primary verified email or fallback to any matching email
        const emailsJson = await emailResponse.json();
        if (!Array.isArray(emailsJson))
            throw new ApiError(400, "Invalid email response");

        const emails = Array.isArray(emailsJson) ? (emailsJson as any[]) : [];

        const fallbackEmail =
            emails.find((e) => e.primary && e.verified)?.email ||
            emails.find((e) => e.verified)?.email ||
            emails[0]?.email ||
            null;
        user.email = fallbackEmail;
    }

    if (!user?.email) {
        throw new ApiError(400, "GitHub email not available");
    }

    // Check if user exists in the database, create if not
    let dbUser = await User.findOne({ email: user.email });
    if (dbUser) {
        dbUser.githubId = user.id;
        dbUser.githubUsername = user.login;
        dbUser.githubProfileUrl = user.html_url;
        dbUser.photo = user.avatar_url;
        dbUser.name = user.name || user.login;
        await dbUser.save();
    } else {
        dbUser = await User.create({
            githubId: user.id,
            githubUsername: user.login,
            githubProfileUrl: user.html_url,
            email: user.email,
            name: user.name || user.login,
            photo: user.avatar_url,
        });
    }

    const token = (dbUser as any).generateJWT();

    //  Redirect to frontend and set cookie.
    res.cookie("authToken", token, cookieOptions).redirect(
        // "https://google.com" // TODO: Change this to actual frontend URL
        `${process.env.MAIN_FRONTEND_URL}/`
    );
});

const logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("authToken", cookieOptions).status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

export { googleOAuth, githubOAuth, logout };
