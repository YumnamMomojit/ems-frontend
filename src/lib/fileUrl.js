/**
 * Resolves a file URL to a displayable/downloadable URL.
 *
 * - If the URL is already absolute (starts with http/https), return it as-is.
 *   This handles AWS S3 public URLs like:
 *     https://my-bucket.s3.ap-south-1.amazonaws.com/avatars/uuid.png
 *
 * - If the URL is a relative path (legacy local uploads like /uploads/foo.jpg),
 *   prepend the backend base URL so the browser can still load it.
 *
 * - If falsy, return empty string (renders nothing / AvatarFallback shows).
 *
 * @param {string|null|undefined} url
 * @returns {string}
 */
export const resolveFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url; // Already an absolute URL (S3, CDN, etc.)
    }
    // Legacy local path — prepend the backend origin
    const backendOrigin = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001";
    return `${backendOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
};
