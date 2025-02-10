export function isAuthenticated() {
    return localStorage.getItem("isAuthenticated") === "true";
  }
  
  export async function signIn() {
    console.log('signed in');
    localStorage.setItem("isAuthenticated", "true");
  }
  
  export async function signOut() {
    console.log('signed out');
    localStorage.removeItem("isAuthenticated");
  }