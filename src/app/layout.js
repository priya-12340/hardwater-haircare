import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { siteUrl } from '../lib/seo';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Hard-Water Haircare Essentials | HardWater Haircare',
    template: '%s | HardWater Haircare',
  },
  description:
    'Explore thoughtful haircare essentials and practical guidance for hard-water wash days.',
  applicationName: 'HardWater Haircare',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <StoreProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
