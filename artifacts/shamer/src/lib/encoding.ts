export function encodeShame(message: string, weapon: string): string {
  const data = JSON.stringify({ message, weapon });
  return btoa(data);
}

export function decodeShame(encoded: string): { message: string; weapon: string } | null {
  try {
    const data = JSON.parse(atob(encoded));
    return data;
  } catch {
    return null;
  }
}
