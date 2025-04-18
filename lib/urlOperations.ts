// lib/urlOperations.ts
"use server";

import getCollection, { URL_COLLECTION } from "@/lib/db";


export type UrlRecord = {
    id: string;
    originalUrl: string;
    alias: string;
    createdAt: Date;
    visits: number;
};

export async function getUrlByAlias(alias: string): Promise<UrlRecord | null> {
    const urlsCollection = await getCollection(URL_COLLECTION);
    const urlData = await urlsCollection.findOne({ alias });

    if (!urlData) {
        console.log("Alias not found in DB:", alias);
        return null;
    }

    console.log("Found URL:", urlData.originalUrl);

    return {
        id: urlData._id.toString(),
        originalUrl: urlData.originalUrl,
        alias: urlData.alias,
        createdAt: new Date(urlData.createdAt),
        visits: urlData.visits || 0
    };
}


// Create new shortened URL
export async function createNewUrl(originalUrl: string, alias: string): Promise<UrlRecord> {
    alias = alias.trim().toLowerCase(); // Normalize alias
    console.log("Creating new shortened URL");

    const urlsCollection = await getCollection(URL_COLLECTION);

    // Check if alias already exists
    const existingUrl = await urlsCollection.findOne({ alias });
    if (existingUrl) {
        throw new Error("This alias is already taken. Please choose another one.");
    }

    // Validate URL format
    try {
        const url = new URL(originalUrl);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            throw new Error("Invalid URL protocol");
        }
    } catch {
        throw new Error("Invalid URL. Please include http:// or https://");
    }

    // Create new document
    const newUrl = {
        originalUrl,
        alias,
        createdAt: new Date(),
        visits: 0
    };

    const result = await urlsCollection.insertOne(newUrl);

    if (!result.acknowledged) {
        throw new Error("Failed to create shortened URL");
    }

    // ✅ Return only serializable values (no raw _id)
    return {
        id: result.insertedId.toString(),
        originalUrl: newUrl.originalUrl,
        alias: newUrl.alias,
        createdAt: newUrl.createdAt,
        visits: newUrl.visits
    };
}

// Increment visit count
export async function incrementVisits(alias: string): Promise<void> {
    const urlsCollection = await getCollection(URL_COLLECTION);
    await urlsCollection.updateOne(
        { alias },
        { $inc: { visits: 1 } }
    );
}
