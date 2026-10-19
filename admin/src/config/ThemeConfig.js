import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    // sakura pink scale (key 'brown' dipertahankan biar semua komponen tetap jalan)
    brown: {
      900: 'hsl(345, 55%, 24%)',
      800: 'hsl(345, 58%, 31%)',
      700: 'hsl(345, 62%, 39%)',
      600: 'hsl(345, 66%, 47%)',
      500: 'hsl(345, 72%, 57%)',
      400: 'hsl(345, 76%, 65%)',
      300: 'hsl(345, 80%, 72%)',
      200: 'hsl(345, 83%, 79%)',
      100: 'hsl(345, 86%, 86%)',
      50: 'hsl(345, 90%, 94%)',
    },
  },
});

export default theme;
