export function encodeShame(message: string, weapon: string): string {
  const data = JSON.stringify({ message, weapon });
  return btoa(unescape(encodeURIComponent(data)));
}

export function decodeShame(encoded: string): { message: string; weapon: string } | null {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    return data;
  } catch {
    return null;
  }
}
