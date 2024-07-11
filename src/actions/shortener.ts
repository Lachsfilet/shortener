import { db } from "~/server/db";

export const getUrlById = async (id: string | string[]) => {
  let realId: string;

  if (Array.isArray(id)) {
    realId = id[0] ?? ""; // Provide a fallback in case id[0] is undefined
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
