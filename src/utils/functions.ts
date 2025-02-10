// Save the sidebar state to localStorage
export function saveSidebarState(isOpen: boolean) {
    localStorage.setItem("sidebarState", JSON.stringify(isOpen));
  }
  
  // Retrieve the sidebar state from localStorage
  export function getSidebarState(): boolean {
    const savedState = localStorage.getItem("sidebarState");
    return savedState ? JSON.parse(savedState) : true; // Default to open
  }
  