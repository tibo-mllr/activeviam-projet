import Link from "next/link";
import { ReactElement } from "react";

export function Header(): ReactElement {
  return (
    <header>
      <div className="w-full bg-white dark:bg-gray-800 shadow-lg p-2 flex flex-row justify-start items-start">
        <Link href="/submit-query">
          <div className="py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600">
            Query
          </div>
        </Link>
        <Link href="/visualize" className="px-4">
          <div className="py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600">
            Visualization
          </div>
        </Link>
      </div>
    </header>
  );
}
