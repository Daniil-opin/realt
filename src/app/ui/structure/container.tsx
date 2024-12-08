import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return <main className="container flex-grow bg-lightblue">{children}</main>;
}
