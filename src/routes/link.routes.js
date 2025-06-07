import express from "express";
import { createShortLink, redirectToOriginalUrl, getQRCode } from "../controllers/link.controller.js";
import { checkLinkExpiry } from "../middlewares/linkExpiry.js";
import { zodValidate } from "../middlewares/zodValidator.js";
import { shortSlugParamSchema, createLinkSchema } from "../schemas/link.schema.js";

const linkRouter = express.Router();
linkRouter.get(
  '/:shortSlug/qrcode',
  zodValidate(shortSlugParamSchema, "params"),
  checkLinkExpiry,
  getQRCode
);

// For redirect route
linkRouter.get(
  '/:shortSlug',
  zodValidate(shortSlugParamSchema, "params"),
  checkLinkExpiry,
  redirectToOriginalUrl
);
linkRouter.post('/', zodValidate(createLinkSchema), createShortLink);

export default linkRouter;