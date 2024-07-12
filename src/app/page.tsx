"use client";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { z } from "zod";
import {
  checkRouteAvailability,
  createShortenedURL,
} from "../../actions/shortener";

const URLSchema = z.object({
  shortURL: z.string().min(1).max(1000),
  realURL: z.string().min(1),
});

export default function Home() {
  const [realURL, setRealURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleShortURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShortURL(event.target.value);
  };

  const handleRealURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRealURL(event.target.value);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      // First, perform synchronous schema validation
      URLSchema.parse({ realURL, shortURL });

      // Then, check the route availability asynchronously
      const isAvailable = await checkRouteAvailability(shortURL);
      if (!isAvailable) {
        setError("Shortener route not available");
        return;
      }

      await createShortenedURL({ realUrl: realURL, shortenURL: shortURL });
    } catch (e: unknown) {
      setError("An unexpected error occurred");
      console.error(e);
    }
  };

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex h-[60vh] w-[80vw] rounded-xl bg-white/40 shadow-2xl backdrop-blur-sm md:w-[40vw]">
        <form onSubmit={submit} className="flex flex-col p-4">
          <input
            type="text"
            value={realURL}
            onChange={handleRealURLChange}
            placeholder="Enter the real URL"
            className="mb-2 rounded border p-2"
          />
          <input
            type="text"
            value={shortURL}
            onChange={handleShortURLChange}
            placeholder="Enter the short URL path"
            className="mb-2 rounded border p-2"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="rounded bg-blue-500 p-2 text-white">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
