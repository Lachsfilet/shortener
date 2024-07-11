import { db } from "~/server/db";

export const getUrlById = async (id: string | string[]) => {
  let realId: string;

  if (Array.isArray(id)) {
    realId = id[0] ?? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Just rickroll the unsuspecting person before the whole application breaks.
  } else {
    realId = id;
  }

  if (!realId) {
    throw new Error("Invalid ID");
  }

  const url = await db.shortenURL.findUnique({
    where: { id: realId }
  });

  return url;
}
