"use client";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { z } from "zod";
import { checkRouteAvailability, createShortenedURL } from "../../actions/shortener";
import toast, { Toaster } from "react-hot-toast";

const URLSchema = z.object({
  shortURL: z.string().min(1).max(1000),
  realURL: z.string().min(1),
});

export default function Home() {
  const [realURL, setRealURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleShortURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShortURL(event.target.value);
  };

  const handleRealURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRealURL(event.target.value);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      URLSchema.parse({ realURL, shortURL });

      setDisabled(true);
      const isAvailable = await checkRouteAvailability(shortURL);
      if (!isAvailable) {
        toast.error("Shortener route not available");
        setDisabled(false);
        return;
      }

      await createShortenedURL({ realUrl: realURL, shortenURL: shortURL });

      toast.success("Success");
    } catch (e: unknown) {
      toast.error("An unexpected error occurred");
      console.error(e);
    } finally {
      setShortURL('');
      setRealURL('');
      setDisabled(false);
    }
  };

  return (
      <>
        <Toaster />
        <main className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
          <div className="flex h-auto w-full sm:w-[60vw] md:w-[40vw] lg:w-[30vw] xl:w-[20vw] rounded-xl bg-gray-900/50 shadow-2xl justify-center backdrop-blur-xxl p-4 sm:p-6">
            <form onSubmit={submit} className="flex flex-col w-full">
              <div className="text-center text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-4 sm:mb-6">
                <h1 className='text-2xl sm:text-3xl md:text-4xl text-white font-bold bg-gradient-to-r from-blue-950 to-indigo-800 bg-clip-text text-transparent'>Shorten your URL</h1>
              </div>
              <input
                  type="text"
                  value={realURL}
                  onChange={handleRealURLChange}
                  placeholder="Enter the real URL"
                  className="mb-2 sm:mb-3 rounded border  p-2 sm:p-3 w-full bg-gray-900/50 backdrop-blur-xxl"
              />
              <input
                  type="text"
                  value={shortURL}
                  onChange={handleShortURLChange}
                  placeholder="Enter the short URL path"
                  className="mb-4 sm:mb-5 rounded  p-2 sm:p-3 w-full bg-gray-900/50 backdrop-blur-xxl"
              />
              <button
                  type="submit"
                  disabled={disabled}
                  className={`rounded p-2 sm:p-3 text-white ${disabled ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'} w-full`}
              >
                {disabled ? 'Loading...' : 'Submit'}
              </button>
            </form>
          </div>
        </main>
      </>
  );
}