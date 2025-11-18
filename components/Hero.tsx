export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 h-96">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center animate-fade-in">
          Welcome to Amazon Clone
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-center">
          Shop millions of products at great prices
        </p>
        <div className="flex space-x-4">
          <button className="bg-amazon-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
            Shop Now
          </button>
          <button className="bg-white hover:bg-gray-100 text-amazon-blue font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
      
      {/* Decorative wave */}
      <div className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 120" className="w-full h-16">
          <path
            fill="#F3F4F6"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
