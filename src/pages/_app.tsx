import { AppProps } from 'next/app';
import theme from '../styles/theme';
import GlobalStyles from '../styles/global';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../contexts/AuthContext';

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <GlobalStyles />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;