export const metadata = {
  title: 'Track your order',
  description: 'Look up the latest status of your order.',
  alternates: { canonical: '/track-order' },
  robots: { index: false, follow: false },
};

export default function RouteMetadataLayout({ children }) {
  return children;
}
