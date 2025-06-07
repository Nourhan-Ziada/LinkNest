import { getLinkByShortSlug } from '../services/link.service.js';

export const checkLinkExpiry = async (req, res, next) => {
  const shortSlug = req.params.shortSlug;
  const link = await getLinkByShortSlug(shortSlug);
  if (!link) {
    return res.status(404).json({ error: "Link not found" });
  }
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return res.status(410).json({ error: "Link has expired" });
  }
  next();
};
