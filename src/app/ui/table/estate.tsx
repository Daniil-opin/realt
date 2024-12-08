import { ReactNode } from "react";

export default function EstateTable({ children }: { children: ReactNode }) {
  return (
    <div className="mb-24 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
