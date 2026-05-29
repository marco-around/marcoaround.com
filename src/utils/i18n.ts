import en from '../locales/en'
import ptBR from '../locales/pt-br'

const translations = {
  en,
  'pt-br': ptBR,
} 

export function getTranslations(locale: string | undefined) {
  if (!locale) return en;
  return translations[locale as keyof typeof translations] || en;
}