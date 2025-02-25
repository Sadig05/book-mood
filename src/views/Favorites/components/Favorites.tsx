import {  useBookDetailsQuery } from "@/api/queries/apiQueries";
import { Book } from "@/components/BookRecommendationCanvas";
import { Button } from "@/components/ui/button";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";


// Fake data for recommendations prop
const fakeRecommendations = {
  emotional: [
    {
      title: "The Emotional Odyssey",
      image:
        "https://images.unsplash.com/photo-1467646208740-18124b37eb58?q=80&w=2961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "A journey through the depths of human emotion.",
    },
    {
      title: "Waves of Emotion",
      image:
        "https://images.unsplash.com/photo-1467646208740-18124b37eb58?q=80&w=2961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Exploring the dynamic nature of feelings.",
    },
    {
      title: "The Emotional Odyssey",
      image:
        "https://images.unsplash.com/photo-1467646208740-18124b37eb58?q=80&w=2961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "A journey through the depths of human emotion.",
    },
    {
      title: "Waves of Emotion",
      image:
        "https://images.unsplash.com/photo-1467646208740-18124b37eb58?q=80&w=2961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Exploring the dynamic nature of feelings.",
    },
  ],
  thematic: [
    {
      title: "Mystery of the Old Library",
      image: "https://images.unsplash.com/photo-1571936804022-90d128047136?q=80&w=2753&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "A tale of secrets and hidden histories.",
    },
    {
      title: "Thematic Tales: A Collection",
      image: "https://images.unsplash.com/photo-1571936804022-90d128047136?q=80&w=2753&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Stories that revolve around overarching themes.",
    },
    {
      title: "Mystery of the Old Library",
      image: "https://images.unsplash.com/photo-1571936804022-90d128047136?q=80&w=2753&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "A tale of secrets and hidden histories.",
    },
    {
      title: "Thematic Tales: A Collection",
      image: "https://images.unsplash.com/photo-1571936804022-90d128047136?q=80&w=2753&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Stories that revolve around overarching themes.",
    },
  ],
};

function Favorites() {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const { data: bookDetails, isLoading, error } = useBookDetailsQuery(selectedBook?.title || "");
  
  return (
<>
  <ScrollArea className="w-full">
    {/* Emotional Books Section */}
    <div>
      <h2 className="text-xl font-semibold mb-4">
        <span className="px-3 py-1 bg-[#f5e0e9] text-gray-800 rounded-full text-sm">
          Emotional
        </span>
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {fakeRecommendations.emotional.map((book, index) => (
          <div
            key={index}
            className="bg-card p-4 shadow rounded-md cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedBook(book)}
          >
            <img
              src={book.image || "/default-book-cover.png"}
              alt={book.title}
              className="w-full h-96 object-cover rounded"
            />
            <p className="text-center mt-2 text-sm font-medium">{book.title}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Thematic Books Section */}
    <div className="mt-8 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        <span className="px-3 py-1 bg-[#feecc8] text-gray-800 rounded-full text-sm">
          Thematic
        </span>
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {fakeRecommendations.thematic.map((book, index) => (
          <div
            key={index}
            className="bg-card p-4 shadow rounded-md cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedBook(book)}
          >
            <img
              src={book.image || "/default-book-cover.png"}
              alt={book.title}
              className="w-full h-96 object-cover rounded"
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
        <Button variant="default">Close</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
</>
  );
}

export default Favorites;
