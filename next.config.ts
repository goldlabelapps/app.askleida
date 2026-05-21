import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";


const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
      }
    ],
  },
  // Suppress critical dependency warning for protobufjs dynamic require
  webpack: (config) => {
    config.ignoreWarnings = [
      {
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];
    return config;
  },
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  // Exclude large folders from precaching
  publicExcludes: [
    "/shared/svg/flags/**",
    "/shared/scriv/**",
    "/shared/pdf/**",
    "/shared/**/*.pdf",
    "**/sketch/**",
  ],
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "images",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 1 day
          },
        },
      },
      {
        // Cache the specific video file
        urlPattern: /\/askleida\/mp4\/video\.mp4$/,
        handler: "CacheFirst",
        options: {
          cacheName: "videos",
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        urlPattern: /^https?.*\.(?:woff2?|ttf|otf|eot)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "fonts",
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
      {
        urlPattern: /\/_next\/static\/.*/,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
    ],
  },
})(nextConfig);
