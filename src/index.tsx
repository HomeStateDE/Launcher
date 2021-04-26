import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import store from './store';
import { Provider } from 'react-redux'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
  colors: {
    orange: {
      50: "#FFFAF0",
      100: "#FEEBC8",
      200: "#EE9A45",
      300: "#F1C86A",
      400: "#F1C86A",
      500: "#DD6B20",
      600: "#C05621",
      700: "#9C4221",
      800: "#7B341E",
      900: "#652B19",
    },
    gray: {
      700: "#1F1F1F",
    },
  }
});

render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </Provider>,
  document.getElementById('root')
);
