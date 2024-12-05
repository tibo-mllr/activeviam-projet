import { Button } from "@mui/material";
import Link from "next/link";
import { ReactElement } from "react";

export function Header(): ReactElement {
  return (
    <header>
      <div className="w-full bg-white dark:bg-gray-800 shadow-lg p-2 flex flex-row justify-start items-start">
        <Link href="/submit-query">
          <Button variant="outlined">Query</Button>
        </Link>
        <Link href="/visualize" className="px-4">
          <Button variant="outlined">Visualization</Button>
        </Link>
      </div>
    </header>
  );
}
