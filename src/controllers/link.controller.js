import {
  createShortLinkService,
  redirectToOriginalUrlService,
  generateQRCodeService,
} from "../services/link.service.js";

export const createShortLink = async (req, res) => {
  const { originalUrl, customSlug, expiresAt, password } = req.body;
  if (!originalUrl) {
    return res.status(400).json({
      error: "Original URL is required",
    });
  }
  try {
    const shortLink = await createShortLinkService({
      originalUrl,
      customSlug,
      expiresAt,
      password,
    });
    return res.status(201).json(shortLink);
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while creating the short link: ${error.message}`,
    });
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  const { shortSlug } = req.params;
  if (!shortSlug) {
    return res.status(400).json({
      error: "Short slug is required",
    });
  }
  try {
    const originalUrl = await redirectToOriginalUrlService(shortSlug, req);
    if (!originalUrl) {
      return res.status(404).json({
        error: "Short link not found",
      });
    }
    console.log(`Redirecting to: ${originalUrl}`);
    // Redirect to the original URL
    return res.status(302).json({
      message: "Redirecting to the original URL",
      originalUrl: originalUrl,
    });
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while redirecting: ${error.message}`,
    });
  }
};

export const getQRCode = async (req, res) => {
  const { shortSlug } = req.params;
  if (!shortSlug) {
    return res.status(400).json({
      error: "Short slug is required",
    });
  }
  try {
    const qrCodeDataUrl = await generateQRCodeService(shortSlug, req);
    if (!qrCodeDataUrl) {
      return res.status(404).json({
        error: "Short link not found or QR code generation failed",
      });
    }
    return res.status(200).json({
      message: "QR code generated successfully",
      qrCodeDataUrl,
    });
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while generating QR code: ${error.message}`,
    });
  }
};