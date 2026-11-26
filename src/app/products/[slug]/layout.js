import { products } from '../../../lib/data';

export async function generateMetadata({ params }) {
  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    return {
      title: 'Product not found',
      description: 'The requested product could not be found.',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: 'website',
      images: product.image ? [product.image] : [],
    },
  };
}

export default function ProductMetadataLayout({ children }) {
  return children;
}
