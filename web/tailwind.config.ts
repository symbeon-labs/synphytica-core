import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                cyan: {
                    400: '#00ffc8', // SynPhytica Brand Color
                    900: '#0a0e27', // Dark Bio Background
                },
                gold: {
                    400: '#ffd700', // Pareto Optimal
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                mono: ['var(--font-jetbrains)', 'monospace'],
            },
        },
    },
    plugins: [],
};
export default config;
