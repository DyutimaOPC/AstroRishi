import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Without this Next walks up looking for a lockfile and picks up the one in
  // the home directory, which would pull the whole home dir into the workspace.
  turbopack: { root: here },
};

export default nextConfig;
