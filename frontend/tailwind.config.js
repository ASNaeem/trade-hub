const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        comeup: {
          "0%": {
            opacity: "0.5",
            transform: "scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
    },
  },
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
