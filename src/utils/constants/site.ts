export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "CliqLabs";
export const APP_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN || "thecliqlabs.com"}`;
export const APP_HOSTNAMES = new Set([
    process.env.NEXT_PUBLIC_APP_DOMAIN || "thecliqlabs.com",
    `www.${process.env.NEXT_PUBLIC_APP_DOMAIN || "thecliqlabs.com"}`,
]);
