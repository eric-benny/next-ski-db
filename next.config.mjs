// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
 !process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

 /** @type {import("next").NextConfig} */
 const config = {
   reactStrictMode: true,
   images: {
     domains: ["images.clerk.dev"],
   },
 
   /**
    * If you have the "experimental: { appDir: true }" setting enabled, then you
    * must comment the below `i18n` config out.
    *
    * @see https://github.com/vercel/next.js/issues/41980
    */
 
  //  typescript: {
  //    ignoreBuildErrors: true,
  //  },
  //  eslint: {
  //    ignoreDuringBuilds: true,
  //  },
   async redirects() {
    return [
      {
        source: '/',
        destination: '/skis',
        permanent: false,
      }
    ]
  }
 };
 export default config;