'use server'
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

  const obj = await db.shortenURL.findFirst({
    where: { id: realId }
  });

  if(!obj) {
    return "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  } else {
    return obj.redirectURL;
  }
}

export const checkRouteAvailability = async (id: string | string[]) => {
  let realId: string;

  if (Array.isArray(id)) {
    realId = id[0] ?? "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  } else {
    realId = id;
  }

  if (!realId) {
    throw new Error("Invalid ID");
  }

  const url = await db.shortenURL.findFirst({
    where: { id: realId }
  });

  if (url) {
    return false;
  } else {
    return true;
  }
}

export const getIDByURL = async (url: string | string[]) => {
  let realURL: string;

  if (Array.isArray(url)) {
    realURL = url[0] ?? "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  } else {
    realURL = url;
  }

  if (!realURL) {
    throw new Error("Invalid URL");
  }

  const obj = await db.shortenURL.findFirst({
    where: { redirectURL: realURL }
  })

  if (obj) {
    return obj.id;
  } else {
    return "youtube";
  }
}

export const createShortenedURL = async (urlObj: { realUrl: string, shortenURL: string }) => {
  try {
    await db.shortenURL.create({
      data: {
        id: urlObj.shortenURL,
        redirectURL: urlObj.realUrl
      }
    }) 
  } catch (e: unknown) {
    throw new Error(`Something went Wrong ${typeof e === 'string' ? e : ''}`)
  }
}