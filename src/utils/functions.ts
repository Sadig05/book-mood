// Save the sidebar state to localStorage
export function saveSidebarState(isOpen: boolean) {
    localStorage.setItem("sidebarState", JSON.stringify(isOpen));
  }
  
  // Retrieve the sidebar state from localStorage
  export function getSidebarState(): boolean {
    const savedState = localStorage.getItem("sidebarState");
    return savedState ? JSON.parse(savedState) : true; // Default to open
  }
  

  export async function getGoogleBookThumbnail(googleBookUrl: string): Promise<string | null> {
    try {
      const url = new URL(googleBookUrl);
      // Extract the "id" query parameter (e.g., "DykPAAAACAAJ")
      const bookId = url.searchParams.get("id");
      if (!bookId) {
        return null;
      }
  
      // Build the API endpoint URL; you can add an API key if needed.
      const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
      const res = await fetch(apiUrl);
      if (!res.ok) {
        console.error("Failed to fetch book data:", res.statusText);
        return null;
      }
      const data = await res.json();
  
      // The thumbnail image is usually found here:
      return data.volumeInfo?.imageLinks?.thumbnail || '/src/assets/landscape-placeholder-svgrepo-com.svg';
    } catch (error) {
      console.error("Error fetching thumbnail:", error);
      return null;
    }
  }