/**
 * Embeddable community page for use in iframes from wildsaura.com, drishya, market.wildsaura.com
 * Usage: <iframe src="https://community.wildsaura.com/embed" />
 */
export const dynamic = 'force-dynamic';

import { CommunityPage } from '@/components/community/CommunityPage';

export default function EmbedPage() {
  return <CommunityPage />;
}
