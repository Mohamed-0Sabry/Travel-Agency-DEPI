import { useTranslation } from 'react-i18next';

export const useAppTranslation = () => {
  const { t, i18n } = useTranslation();
  
  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    isRTL: i18n.language === 'ar',
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
  };
};

export default useAppTranslation;