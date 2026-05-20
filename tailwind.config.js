/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
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
        // Custom colors from index.css that might be used as utilities
        darkRed: {
          DEFAULT: "var(--color-darkRed)",
          light: "var(--color-darkRed-light)",
          dark: "var(--color-darkRed-dark)",
        },
        orange: {
          DEFAULT: "var(--color-orange)",
          light: "var(--color-orange-light)",
          dark: "var(--color-orange-dark)",
        },
        status: { // New status colors
          online: "hsl(var(--status-online))",
          offline: "hsl(var(--status-offline))",
          away: "hsl(var(--status-away))",
        },
        pink: { // New pink color
          DEFAULT: "hsl(var(--color-pink))",
        },
        jws: {
          black: "#000000",
          "dark-gray": "#121212",
          "sidebar-bg": "#0A0A0A",
          red: "#EC1313",
          "red-hover": "#B91C1C",
          "red-glow": "rgba(236, 19, 19, 0.3)",
          text: {
            primary: "#FFFFFF",
            secondary: "#E5E7EB",
          },
        },
        employee: { // New employee specific colors
          main: {
            text: "hsl(var(--employee-main-text-color))",
          },
        },

        // Sidebar specific colors
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          primary: {
            DEFAULT: "hsl(var(--sidebar-primary))",
            foreground: "hsl(var(--sidebar-primary-foreground))",
            border: "hsl(var(--sidebar-primary-border))",
          },
          accent: {
            DEFAULT: "hsl(var(--sidebar-accent))",
            foreground: "hsl(var(--sidebar-accent-foreground))",
            border: "hsl(var(--sidebar-accent-border))",
          },
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
        input: "hsl(var(--input))",
        card: "hsl(var(--card-border))",
        primary: "hsl(var(--primary-border))",
        secondary: "hsl(var(--secondary-border))",
        destructive: "hsl(var(--destructive-border))",
        muted: "hsl(var(--muted-border))",
        accent: "hsl(var(--accent-border))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-border))",
          primary: "hsl(var(--sidebar-primary-border))",
          accent: "hsl(var(--sidebar-accent-border))",
        },
      },
    },
  },
  plugins: [],
}
