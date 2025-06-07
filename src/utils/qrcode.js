import QRCode from "qrcode";
export const generateQRCode = async (url) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(url);
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
};
