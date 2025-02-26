import { useFavoritesQuery, useRemoveFavoriteMutation } from "@/api/queries/apiQueries";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FavoriteBook } from "@/api/schemas/apiSchemas";
import { Trash2 } from "lucide-react";

function Favorites() {
  const [selectedBook, setSelectedBook] = useState<FavoriteBook | null>(null);
  // const { data: bookDetails, isLoading: bookDetailsLoading } = useBookDetailsQuery(selectedBook?.title || "");
  const { data: favoritesData, isLoading: favoritesLoading, error: favoritesError } = useFavoritesQuery();
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  const handleRemoveFavorite = (bookTitle: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the book details dialog
    removeFavoriteMutation.mutate(bookTitle);
  };

  if (favoritesLoading) {
    return <div className="flex justify-center items-center h-full">Loading your favorites...</div>;
  }

  if (favoritesError) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load favorites</p>
          <p className="text-sm text-gray-600">Please try again later or check your connection</p>
        </div>
      </div>
    );
  }

  if (!favoritesData || favoritesData.favourites.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <p className="text-xl font-medium mb-2">No favorites yet</p>
          <p className="text-sm text-gray-600">Books you add to favorites will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
        
        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoritesData.favourites.map((book, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative group"
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative aspect-[2/3] mb-3">
                  <img
                    src={book.image || "/default-book-cover.png"}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button 
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleRemoveFavorite(book.title, e)}
                    aria-label="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <h3 className="font-medium text-sm text-center line-clamp-2">{book.title}</h3>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Book Details Dialog */}
      <Dialog
        open={!!selectedBook}
        onOpenChange={(open) => {
          if (!open) setSelectedBook(null);
        }}
      >
        <DialogContent className="bg-white p-6 max-w-md md:max-w-xl">
          {selectedBook && (
            <div className="flex flex-col md:flex-row">
              {/* Left Side: Book Image */}
              <div className="md:w-1/2">
                <div className="w-full h-96">
                  <img
                    src={selectedBook.image || "/default-book-cover.png"}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </div>
              
              {/* Right Side: Book Details */}
              <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col">
                <DialogHeader>
                  <DialogTitle>{selectedBook.title}</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">{selectedBook.description}</p>
                    <p className="mt-2 text-sm">
                      <strong>Authors:</strong> {selectedBook.authors.join(", ")}
                    </p>
                    <p className="mt-1 text-sm">
                      <strong>Categories:</strong> {selectedBook.categories.join(", ")}
                    </p>
                    <p className="mt-1 text-sm">
                      <strong>Published:</strong> {selectedBook.published_date}
                    </p>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-auto pt-4 flex space-x-2">
                  <DialogClose asChild>
                    <Button variant="default">Close</Button>
                  </DialogClose>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      removeFavoriteMutation.mutate(selectedBook.title);
                      setSelectedBook(null);
                    }}
                  >
                    Remove from Favorites
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Favorites;