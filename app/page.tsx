"use client";

import { useState } from "react";
import { createNewUrl } from "@/lib/urlOperations";

export default function Home() {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validateInput = (): boolean => {
        if (!url.trim()) {
            setError("Please enter a URL");
            return false;
        }

        if (!alias.trim()) {
            setError("Please enter an alias");
            return false;
        }

        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
                setError("Invalid URL protocol. Please include http:// or https://");
                return false;
            }
        } catch (_) {
            setError("Please enter a valid URL (including http:// or https://)");
            return false;
        }

        if (!/^[a-zA-Z0-9-]+$/.test(alias)) {
            setError("Alias can only contain letters, numbers, and hyphens");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateInput()) {
            return;
        }

        setIsLoading(true);

        try {
            const normalizedAlias = alias.trim().toLowerCase(); // ensure normalization
            await createNewUrl(url, normalizedAlias);

            const host = window.location.host;
            const protocol = window.location.protocol;
            const shortenedUrl = `${protocol}//${host}/${normalizedAlias}`;

            setShortUrl(shortenedUrl); // ✅ Only set the string
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const pageStyle = {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: '1.5',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    };

    return (
        <div style={pageStyle}>
            <h1 style={{ fontSize: '48px', margin: '10px 0', fontWeight: 'bold' }}>URL Shortener</h1>
            <p style={{ fontSize: '18px', margin: '0 0 20px 0' }}>Create custom short links with your own aliases</p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="url" style={{ display: 'block', fontSize: '18px', marginBottom: '5px' }}>
                        URL to Shorten
                    </label>
                    <input
                        type="text"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        style={{
                            width: '350px',
                            padding: '5px',
                            border: '1px solid #ccc',
                            fontSize: '16px'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="alias" style={{ display: 'block', fontSize: '18px', marginBottom: '5px' }}>
                        Custom Alias
                    </label>
                    <input
                        type="text"
                        id="alias"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="my-custom-link"
                        style={{
                            width: '350px',
                            padding: '5px',
                            border: '1px solid #ccc',
                            fontSize: '16px'
                        }}
                    />
                    <p style={{ margin: '5px 0', fontSize: '16px' }}>
                        Only letters, numbers, and hyphens are allowed
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        padding: '5px 15px',
                        border: '1px solid #000',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Shorten URL
                </button>
            </form>

            {error && (
                <div style={{ marginTop: '15px', color: 'red' }}>
                    {error}
                </div>
            )}

            {shortUrl && (
                <div style={{ marginTop: '20px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Your Shortened URL:</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            readOnly
                            value={shortUrl}
                            style={{
                                width: '350px',
                                padding: '5px',
                                border: '1px solid #ccc',
                                marginRight: '10px'
                            }}
                        />
                        <button
                            onClick={() => {
                                if (typeof navigator !== "undefined" && navigator.clipboard) {
                                    navigator.clipboard.writeText(shortUrl);
                                } else {
                                    alert("Clipboard not supported");
                                }
                            }}
                            style={{
                                padding: '5px 15px',
                                border: '1px solid #000',
                                background: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            Copy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
