import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-red-500 justify-center items-center flex flex-col p-3 text-white">
      <h1>Checkpoint : frontend</h1>
      <Link href="/">Countries</Link>
    </header>
  );
}
