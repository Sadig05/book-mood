import React, { useState } from 'react';
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

interface Book {
  title: string;
  image: string;
  description?: string;
}

interface BookRecommendationCanvasProps {
  books: Book[];
}

const BookRecommendationCanvas: React.FC<BookRecommendationCanvasProps> = ({ books }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Assuming the first 3 books are emotional and the next 3 are thematic
  const emotionalBooks = books.slice(0, 3);
  const thematicBooks = books.slice(3, 6);

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
            {emotionalBooks.map((book, index) => (
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
        </div>

        {/* Thematic Books Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            <span className="px-3 py-1 bg-[#feecc8] text-gray-800 rounded-full text-sm">
              Thematic
            </span>
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {thematicBooks.map((book, index) => (
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
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            {/* Right Side: Book Name & Description */}
            <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col">
              <DialogHeader>
                <DialogTitle>{selectedBook?.title}</DialogTitle>
                <DialogDescription>
                  {selectedBook?.description || "Detailed information about the book."}
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
