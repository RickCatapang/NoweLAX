export interface Subject {
  categorySubjectId: string;
  id: string;
  name: string;
  description: string | null;
}

export async function getSubjects(categoryId: string): Promise<Subject[]> {
  const response = await fetch(`/api/categories/${categoryId}/subjects`);

  if (!response.ok) {
    throw new Error("Failed to fetch subjects.");
  }

  return response.json();
}
