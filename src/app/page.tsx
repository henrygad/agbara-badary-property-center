import Link from "next/link";

export default function Home() {


  return (
    <>
      <header className="flex flex-col font-mon">
        <ul className="inline-flex gap-10 p-4 border">
          <li>Home</li>
          <li>projects</li>
          <li>
            <Link href="/admin" >Admin</Link>

          </li>
        </ul>
      </header>
      <main className="flex flex-col items-center p-8">
        <h1>How are you</h1>
      </main>
      <footer className="flex">
        <div className="flex justify-center">
          <p>&copy; copy right Agbara Badagry Property Center</p>
        </div>
      </footer>
    </>
  );
}
