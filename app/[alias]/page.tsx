import { redirect } from "next/navigation";
import { getUrlByAlias, incrementVisits } from "@/lib/urlOperations";

export const dynamic = "force-dynamic";

export default async function AliasRedirectPage({ params }: { params: { alias: string } }) {
    const { alias } = params;
    const url = await getUrlByAlias(alias);

    if (!url) {
        console.log("Alias not found:", alias);
        return redirect("/");
    }

    console.log("Redirecting to:", url.originalUrl);
    await incrementVisits(alias);

    return redirect(url.originalUrl); // ✅ make this the last thing
}
