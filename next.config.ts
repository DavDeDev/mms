import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async redirects() {
		return [
			{
				source: "/dashboard",
				destination: "/cohorts",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
