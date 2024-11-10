// app/page.tsx

import Link from "next/link";
import React from "react";


const HomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-sm text-center">
        <h1 className="text-2xl font-semibold mb-3">Homepage</h1>
        <p className="text-base mb-6 text-gray-600">Query plans tool</p>

        <Link href="/submitQuery">
          <button className="px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition duration-200">
            Go to MDX queries submission page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;