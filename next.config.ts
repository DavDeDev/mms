import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async redirects() {
		return [
			{
				source: "/dashboard",
				destination: "/dashboard/cohorts",
				permanent: true,
			},
			{
				source: "/cohorts",
				destination: "/dashboard/cohorts",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
