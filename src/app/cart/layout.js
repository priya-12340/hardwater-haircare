export const metadata = {
  title: 'Your cart',
  description: 'Review the items in your shopping cart.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: false },
};

export default function RouteMetadataLayout({ children }) {
  return children;
}
