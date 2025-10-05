import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Custom color palette for NASA Bioscience Explorer
const mint: MantineColorsTuple = [
  '#dbf0e9', // 0 - lightest
  '#b8e0d3', // 1
  '#94d1bd', // 2
  '#70c2a7', // 3
  '#4db391', // 4 - main
  '#3d8f74', // 5
  '#2e6b57', // 6
  '#1f473a', // 7
  '#0f241d', // 8
  '#0a1813', // 9 - darkest
];

const zomp: MantineColorsTuple = [
  '#d4eee5', // 0 - lightest
  '#a9ddcb', // 1
  '#7eccb2', // 2
  '#53ba98', // 3
  '#3c9779', // 4 - main
  '#307860', // 5
  '#245a48', // 6
  '#183c30', // 7
  '#0c1e18', // 8
  '#081410', // 9 - darkest
];

const light: MantineColorsTuple = [
  '#fbfbfb', // 0 - lightest
  '#f7f7f7', // 1
  '#f3f3f3', // 2
  '#efefef', // 3
  '#ebebeb', // 4 - main (anti-flash white)
  '#bcbcbc', // 5
  '#8d8d8d', // 6
  '#5e5e5e', // 7
  '#2f2f2f', // 8
  '#1f1f1f', // 9 - darkest
];

const dark: MantineColorsTuple = [
  '#d6d6d6', // 0 - lightest
  '#adadad', // 1
  '#858585', // 2
  '#5c5c5c', // 3
  '#323232', // 4 - main (jet)
  '#292929', // 5
  '#1f1f1f', // 6
  '#141414', // 7
  '#0a0a0a', // 8
  '#050505', // 9 - darkest
];

const darker: MantineColorsTuple = [
  '#d3d3d3', // 0 - lightest
  '#a6a6a6', // 1
  '#7a7a7a', // 2
  '#4e4e4e', // 3
  '#222222', // 4 - main (eerie black)
  '#1b1b1b', // 5
  '#141414', // 6
  '#0d0d0d', // 7
  '#070707', // 8
  '#030303', // 9 - darkest
];

const theme = createTheme({
  primaryColor: 'mint',
  colors: {
    mint,
    zomp,
    light,
    dark,
    darker,
  },
  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  defaultRadius: 'md',
  
  // Optional: Configure light/dark color schemes
  white: '#ebebeb',
  black: '#222222',
  
  // Optional: Set default colors for components
  primaryShade: { light: 4, dark: 3 },
});

export default theme;
