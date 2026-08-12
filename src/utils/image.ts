export const ANPR_STORE_BASE_URL = "http://localhost:4000/anpr_store";

export function getAnprImageUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${ANPR_STORE_BASE_URL}${cleanPath}`;
}
