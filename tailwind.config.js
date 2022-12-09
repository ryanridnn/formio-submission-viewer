export default {
  corePlugins: {
    // preflight: false,
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "465px",
      sm: "600px",
      sm2: '768px',
      md: "1025px",
      lg: "1280px",
      xl: "1920px",
      print: { raw: "print" },
    },
    extend: {
      container: {
        center: true
      },
      colors: {
        black: "#22292F",
        white: "#fff",
        navy: "#0f172a",
        lightNavy: "#1e293b",
        darkNavy: "#1A2332",
        lightBlue: "#5046e6",
        lightGray: "#475160",
        orange: "#ff864d",
        lightPink: "#f4175c",
        lightGreen: "#6ce5e7",
        blendedBlue: '#373894',
        blendedRed: '#D81B6026',
        brightGreen: '#41FC82',
        brightRed: '#F27575',
        brightYellow: '#FCF541',
      }
    },
    fontFamily: {
      heading: ["Manrope", "sans-serif"],
      sans: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
};