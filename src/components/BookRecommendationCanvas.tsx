import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBookDetailsQuery } from "@/api/queries/apiQueries";


interface BookRecommendationCanvasProps {
  books: {
    title: string;
    image?: string;
    // Additional fields like match_score or similarity may be present.
  }[];
}

const BookRecommendationCanvas: React.FC<BookRecommendationCanvasProps> = ({ books }) => {
  const [selectedBook, setSelectedBook] = useState<{
    title: string;
    image?: string;
  } | null>(null);

  // Call useBookDetailsQuery only if selectedBook is set.
  const {
    data: bookDetails,
    isLoading,
    error,
  } = useBookDetailsQuery(selectedBook?.title || "");

  return (
    <>
      <ScrollArea className="flex-1 p-4 mt-1">
        <div className="grid grid-cols-3 gap-4">
          {books.map((book, index) => (
            <div
              key={index}
              className="bg-card p-4 shadow rounded-md cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedBook(book)}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-64 object-cover rounded"
              />
              <p className="text-center mt-2 text-sm font-medium">{book.title}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

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
                    src={selectedBook.image}
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
                      <p>{bookDetails.description}</p>
                      <p className="mt-2 text-sm">
                        <strong>Authors:</strong> {bookDetails.authors.join(", ")}
                      </p>
                      <p className="mt-1 text-sm">
                        <strong>Categories:</strong> {bookDetails.categories.join(", ")}
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
          <DialogClose asChild>
            <Button variant="default" className="mt-4">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookRecommendationCanvas;
