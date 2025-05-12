/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Recommended setting for Shadcn UI
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}", // Include all relevant paths
    "./index.html", // Also watch index.html
  ],
  prefix: "", // Recommended for Shadcn UI
  theme: {
    container: { // Recommended for Shadcn UI
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Shadcn UI default variables (adjust if needed during init)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", // Typically a blue
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // Typically the red
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Often the primary blue or another highlight
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Project Specific Colors (can be used alongside or instead of Shadcn variables)
        'rdrr-blue': '#3FA9F5',
        'rdrr-red': '#E30613',
        // Add black/dark gray variations if needed, e.g., 'rdrr-dark': '#333333'
      },
      borderRadius: { // Recommended for Shadcn UI
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: { // Recommended for Shadcn UI
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: { // Recommended for Shadcn UI
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'], // Add Roboto as the primary sans-serif font
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Add the animate plugin
} 