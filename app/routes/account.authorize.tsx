import type {LoaderFunctionArgs} from 'react-router';
import {redirect} from 'react-router';

export async function loader({request}: LoaderFunctionArgs) {
  // This route handles OAuth callbacks from Shopify Customer Account API
  // In a real implementation:
  // 1. Extract authorization code from URL
  // 2. Exchange code for access token
  // 3. Create session
  // 4. Redirect to account page

  // For now, redirect to account page
  return redirect('/account');
}

export default function AuthorizePage() {
  // This component shouldn't render as the loader redirects
  return null;
}
