import getCollection, { URL_COLLECTION } from "@/lib/db";

export default async function DebugPage() {
    try {
        const collection = await getCollection(URL_COLLECTION);
        const urls = await collection.find({}).toArray();

        return (
            <div style={{ padding: '20px' }}>
                <h1>URL Database Debug Page</h1>
                <p>Found {urls.length} URLs in database</p>
                <ul>
                    {urls.map(url => (
                        <li key={url._id.toString()} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
                            <strong>Alias:</strong> {url.alias}<br/>
                            <strong>URL:</strong> {url.originalUrl}<br/>
                            <strong>Created:</strong> {new Date(url.createdAt).toLocaleString()}<br/>
                            <strong>Visits:</strong> {url.visits || 0}
                        </li>
                    ))}
                </ul>
            </div>
        );
    } catch (error) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Error connecting to database</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
        );
    }
}