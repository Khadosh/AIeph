import {getRequestConfig} from 'next-intl/server';
import { getUserMetadata } from '@/actions/user';
 
export default getRequestConfig(async () => {
  const userMetadata = await getUserMetadata();
  const locale = userMetadata?.locale || 'en';
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});