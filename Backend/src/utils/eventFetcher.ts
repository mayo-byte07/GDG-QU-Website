import { ApiError } from "./ApiError";

// Helper to fetch cover image URL, gdgEventId and photos from a GDG event URL
export const fetchGdgMedia = async (gdgUrl: string) => {
    if (!gdgUrl) {
        throw new ApiError(400, "GDG URL not provided");
    }

    // Fetch HTML to extract cover image and event id
    const [coverImageUrl, gdgEventId] = await fetch(gdgUrl)
        .then((res) => {
            if (!res.ok) {
                throw new ApiError(400, "Cover image URL is not reachable");
            }
            return res.text();
        })
        .then((data) => {
            const html = data as string;
            return [
                html
                    .split(`"event_banner":`)[1]
                    ?.split(`",`)[0]
                    ?.replace('"', "") || "",
                html.split(`"eventid":`)[1]?.split(`,`)[0]?.trim() || "",
            ];
        })
        .catch(() => {
            throw new ApiError(400, "Failed to fetch cover image from GDG URL");
        });

    if (!coverImageUrl || !gdgEventId) {
        throw new ApiError(400, "Invalid GDG event URL provided");
    }

    // Fetch wrapup photos from GDG API (best-effort; empty array on failure)
    const eventPhotos: string[] = await fetch(
        `https://gdg.community.dev/api/event_wrapup_photos/${gdgEventId}/`
    )
        .then((res) => {
            if (!res.ok) return [];
            return res.json();
        })
        .then((data: any) => {
            return (
                data?.results?.map((photo: any) => photo?.picture?.url) || []
            );
        })
        .catch(() => {
            return [];
        });

    return {
        coverImageUrl,
        gdgEventId: Number(gdgEventId),
        eventPhotos,
    };
};
