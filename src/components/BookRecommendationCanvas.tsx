import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAddFavoriteMutation, useBookDetailsQuery } from "@/api/queries/apiQueries";

export interface Book {
  title: string;
  image?: string | null;
  description?: string;
}

interface RecommendationsProps {
  recommendations: {
    emotional: Book[];
    thematic: Book[];
  };
}

const BookRecommendationCanvas: React.FC<RecommendationsProps> = ({ recommendations }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { data: bookDetails, isLoading, error } = useBookDetailsQuery(selectedBook?.title || "");
  const addFavoriteMutation = useAddFavoriteMutation();

  const handleAddFavorite = async () => {
    if (!selectedBook) return;
    addFavoriteMutation.mutate(selectedBook.title, {
      onSuccess: () => {
        toast.success(`${selectedBook.title} has been added to your favorites.`);
      },
      onError: () => {
        toast.error("Failed to add favorite. Please try again.");
      },
    });
  };
  return (
    <>
      <ScrollArea className="flex-1 p-4 mt-1">
        {/* Emotional Books Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <span className="px-3 py-1 bg-[#f5e0e9] text-gray-800 rounded-full text-sm">
              Emotional
            </span>
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {recommendations.emotional.map((book, index) => (
              <div
                key={index}
                className="bg-card p-4 shadow rounded-md cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedBook(book)}
              >
                <img
                  src={book.image || "/default-book-cover.png"}
                  alt={book.title}
                  className="w-full h-64 object-cover rounded"
                />
                <p className="text-center mt-2 text-sm font-medium">{book.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Thematic Books Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            <span className="px-3 py-1 bg-[#feecc8] text-gray-800 rounded-full text-sm">
              Thematic
            </span>
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {recommendations.thematic.map((book, index) => (
              <div
                key={index}
                className="bg-card p-4 shadow rounded-md cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedBook(book)}
              >
                <img
                  src={book.image || "/default-book-cover.png"}
                  alt={book.title}
                  className="w-full h-64 object-cover rounded"
                />
                <p className="text-center mt-2 text-sm font-medium">{book.title}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Modal for detailed book view */}
      <Dialog
        open={!!selectedBook}
        onOpenChange={(open) => {
          if (!open) setSelectedBook(null);
        }}
      >
        <DialogContent className="bg-white p-6 max-w-md md:max-w-xl">
          <div className="flex flex-col md:flex-row">
            {/* Left Side: Book Image */}
            <div className="md:w-1/2">
              {selectedBook && (
                <div className="w-full h-96">
                  <img
                    src={selectedBook.image || "/default-book-cover.png"}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            {/* Right Side: Detailed Book Info */}
            <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  {isLoading
                    ? "Loading..."
                    : error
                    ? "Error loading book details"
                    : bookDetails?.title || selectedBook?.title}
                </DialogTitle>
                <DialogDescription>
                  {isLoading && "Please wait while we load the book details."}
                  {error && "Unable to fetch book details at this time."}
                  {bookDetails && !isLoading && !error && (
                    <>
                      <p className="mt-2">{bookDetails.description?.slice(0, 800)}{bookDetails.description && bookDetails.description.length > 800 && "..."}</p>
                      <p className="mt-2 text-sm">
                        <strong>Authors:</strong> {bookDetails?.authors?.join(", ") || "N/A"}
                      </p>
                      <p className="mt-1 text-sm">
                        <strong>Categories:</strong> {bookDetails?.categories?.join(", ") || "N/A"}
                      </p>
                      <p className="mt-1 text-sm">
                        <strong>Published:</strong> {bookDetails.published_date}
                      </p>
                    </>
                  )}
                  {!bookDetails && !isLoading && !error && (
                    <p>Detailed information about the book will appear here.</p>
                  )}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={handleAddFavorite}>Add Favorites</Button>
            <DialogClose asChild>
              <Button variant="default">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookRecommendationCanvas;
