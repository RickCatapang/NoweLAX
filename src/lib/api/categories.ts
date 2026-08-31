export interface Category {
  id: string;
  name: string;
  description: string | null;
  type: "EXAMINATION" | "EDUCATIONAL" | "ORGANIZATIONAL" | "GENERAL";
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");

  if (!response.ok) {
    throw new Error("Failed to fetch categories.");
  }

  return response.json();
}
