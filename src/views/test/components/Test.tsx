import BookImg from "../../../assets/book.jpeg";

function Test() {
  return (
    <div className="space-y-6 bg-gradient-to-r from-[#FFE5E5] via-[#F5FFFE] to-[#FFFFFF] w-full p-4">
      <div className="container mx-auto flex flex-wrap gap-6 sm:flex-col items-center">
        {/* Text Content */}
        <div className="px-6 py-8 text-[#393280] sm:w-full lg:w-1/2">
          <h1 className="font-semibold text-4xl sm:text-3xl md:text-5xl">
            Hello, I am Sadig
          </h1>
          <p className="text-lg sm:text-base md:text-xl opacity-80 leading-8 tracking-wide mt-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
            et dolore deserunt sit amet consectetur adipisicing elit. Repellat
            et dolore deserunt totam nam. Unde!
          </p>
        </div>
        {/* Image */}
        <div className="sm:w-full md:w-1/2">
          <img
            className="w-full h-auto rounded-lg shadow-md"
            src={BookImg}
            alt="Book"
          />
        </div>
      </div>
    </div>
  );
}

export default Test;
