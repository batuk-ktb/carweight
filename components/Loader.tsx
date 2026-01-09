export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      {/* Road container */}
      <div className="relative w-64 h-16">
        {/* Road */}
        <div className="absolute bottom-4 w-full h-2 bg-gray-300 rounded-full"></div>

        {/* Truck */}
        <div className="absolute bottom-7 left-0 flex items-end animate-truck-move">
          {/* Truck body */}
          <div className="relative w-24 h-10 bg-yellow-500 rounded-lg">
            {/* Cabin */}
            <div className="w-6 h-6 bg-gray-400 absolute top-0 right-0 rounded-sm"></div>
            {/* Dump bed */}
            <div className="w-12 h-6 bg-orange-600 absolute top-0 left-0 rounded-sm"></div>
          </div>

          {/* Wheels */}
          <div className="w-4 h-4 bg-black rounded-full absolute bottom-[-6px] left-2 animate-wheel-spin"></div>
          <div className="w-4 h-4 bg-black rounded-full absolute bottom-[-6px] right-2 animate-wheel-spin"></div>
        </div>
      </div>
    </div>
  );
}
