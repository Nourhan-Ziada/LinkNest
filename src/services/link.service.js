import { generateRandomSlug } from "../utils/slug.js";
import bcrypt from "bcrypt";
import { db } from "../database/db.js";
import { links } from "../models/link.model.js";
import { eq } from "drizzle-orm";
import { visits } from "../models/visit.model.js";
import geoip from "geoip-lite";
import { generateQRCode } from "../utils/qrcode.js";
/**
 * Service to create a short link.
 * @param {Object} params - Parameters for creating a short link.
 * @param {string} params.originalUrl - The original URL to be shortened.
 * @param {string} [params.customSlug] - Optional custom slug for the short link.
 * @param {Date} [params.expiresAt] - Optional expiration date for the short link.
 * @param {string} [params.password] - Optional password for accessing the short link.
 * @returns {Promise<Object>} The created short link object.
 * @throws {Error} If the slug is already taken or if there is an error during creation.
 */
const saltRounds = 10;

export const createShortLinkService = async ({
  originalUrl,
  customSlug,
  expiresAt,
  password,
}) => {
  //CREATE A Custome Slug
  const slug = customSlug || generateRandomSlug();
  //Validate if that Slug is already taken
  const existingLink = await getLinkByShortSlug(slug);
  //If taken, return an error response
  if (existingLink) {
    throw new Error("Slug is already taken");
  }
  // hash the password if provided

  if (password && password.length > 0) {
    password = await bcrypt.hash(password, saltRounds);
  }
  // Save the short link to the database
  await db.insert(links).values({
    original_url: originalUrl,
    short_slug: slug,
    created_at: new Date().toISOString(),
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    password_hash: password || null,
  });
  // Return the created short link object
  return {
    originalUrl,
    shortSlug: `${process.env.BASE_URL}/api/links/${slug}`,
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    password: password ? "Protected" : "Not Protected",
  };
};

export const redirectToOriginalUrlService = async (shortSlug, req) => {
  // Find the short link in the database
  const link = await getLinkByShortSlug(shortSlug);

  // If the link does not exist, return null
  if (!link) {
    return null;
  }

  // Check if the link has expired
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    throw new Error("Short link has expired");
  }

  // If a password is required, check if it matches
  if (link.password_hash) {
    const password = req.headers["x-password"];
    if (!password || !(await bcrypt.compare(password, link.password_hash))) {
      throw new Error("Invalid password");
    }
  }
  // Update the click count for the short link
  await updateClickCountService(shortSlug);
  // Track the visit for analytics
  await trackVisitService(shortSlug, req);
  // Return the original URL
  return link.original_url;
};

const updateClickCountService = async (shortSlug) => {
  // Get the current click count
  const link = await getLinkByShortSlug(shortSlug);
  if (!link) return;
  // Increment and update
  let updatedClickCount = (link.click_count || 0) + 1;
  await db
    .update(links)
    .set({ click_count: updatedClickCount })
    .where(eq(links.short_slug, shortSlug));
};

const trackVisitService = async (shortSlug, req) => {
  // Fetch the link from the database using the short slug
  const link = await getLinkByShortSlug(shortSlug);

  // If link is not found, exit early
  if (!link) return;

  // Determine the IP address
  let ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
         || req.socket?.remoteAddress
         || req.ip
         || "";

  if (!ip) {
    console.warn("IP address not found for tracking visit.");
  }

  const geo = ip ? geoip.lookup(ip) : null;
  const country = geo?.country || "Unknown";

  // Build the visit data object
  const visitData = {
    linkId: String(link.id),
    clicked_at: new Date().toISOString(),
    user_agent: req.headers["user-agent"] || "",
    referrer: req.headers["referer"] || "",
    ip_address: ip,
    country: country,
  };

  //console.log("Tracking visit:", visitData);

  // Insert the visit into the database
  try {
    await db.insert(visits).values(visitData);
  } catch (error) {
    console.error("Error inserting visit:", error);
    throw error;
  }
};

export const generateQRCodeService = async (shortSlug, req) => {
  try {
    // make sure to fetch the link first
    const link = await getLinkByShortSlug(shortSlug);
    if (!link) {
      throw new Error("Short link not found");
    }
    // check if linkk has password
    if (link.password_hash) {
      const password = req.headers["x-password"];
      if (!password || !(await bcrypt.compare(password, link.password_hash))) {
        throw new Error("Invalid password");
      }
    }

    const url = `${process.env.BASE_URL}/api/links/${link.short_slug}`;
   // console.log("Generating QR code for URL:", url);
    const qrCodeDataUrl = await generateQRCode(url);
   // console.log("Generated QR code data URL:", qrCodeDataUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

export const getLinkByShortSlug = async (shortSlug) => {
  return await db.query.links.findFirst({
    where: (links, { eq }) => eq(links.short_slug, shortSlug),
  });
};