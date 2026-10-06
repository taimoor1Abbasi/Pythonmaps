export type Place = {
  id: number;
  name: string;
  category: string;
  neighborhood: string;
  address: string;
  description: string;
  rating: number;
  hours: string;
  image: string;
  latitude: number;
  longitude: number;
};

export const categories = [
  { name: "All", icon: "✳" },
  { name: "Coffee", icon: "☕" },
  { name: "Food & drink", icon: "♨" },
  { name: "Parks", icon: "♧" },
  { name: "Culture", icon: "◈" },
  { name: "Shopping", icon: "◇" },
];

export async function getPlaces(
  query: string,
  category: string,
): Promise<Place[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const params = new URLSearchParams({ q: query, category });
  const response = await fetch(`${apiUrl}/api/places?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Places API returned ${response.status}`);
  }

  return (await response.json()) as Place[];
}
