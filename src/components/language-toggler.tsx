import { getUserMetadata } from "@/actions/user";
import { LanguageDropdown } from "@/components/ui/language-dropdown";

export default async function LanguageToggler() {
  try {
    const userMetadata = await getUserMetadata();
    
    if (!userMetadata) {
      return null;
    }

    const initialLocale = userMetadata?.locale || 'en';

    return <LanguageDropdown initialLocale={initialLocale} />;
  } catch (error) {
    console.error(error);
    return null;
  }
}