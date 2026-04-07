// Aarti data types and barrel exports

export interface AartiTranslation {
  title: string;
  verses: string[];
}

export interface Aarti {
  slug: string;
  name: string;
  deity: string;
  deityEmoji: string;
  description: string;
  translations: Record<string, AartiTranslation>;
}

export interface Language {
  code: string;
  label: string;
  nativeLabel: string;
  fontFamily?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'hindi', label: 'Hindi', nativeLabel: 'हिन्दी', fontFamily: "'Noto Serif Devanagari', serif" },
  { code: 'sanskrit', label: 'Sanskrit', nativeLabel: 'संस्कृतम्', fontFamily: "'Noto Serif Devanagari', serif" },
  { code: 'english', label: 'English', nativeLabel: 'English' },
  { code: 'tamil', label: 'Tamil', nativeLabel: 'தமிழ்', fontFamily: "'Noto Sans Tamil', sans-serif" },
  { code: 'kannada', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', fontFamily: "'Noto Sans Kannada', sans-serif" },
  { code: 'telugu', label: 'Telugu', nativeLabel: 'తెలుగు', fontFamily: "'Noto Sans Telugu', sans-serif" },
  { code: 'bangla', label: 'Bangla', nativeLabel: 'বাংলা', fontFamily: "'Noto Sans Bengali', sans-serif" },
  { code: 'malayalam', label: 'Malayalam', nativeLabel: 'മലയാളം', fontFamily: "'Noto Sans Malayalam', sans-serif" },
];

export const DEFAULT_LANGUAGE = 'hindi';

// Import all aartis
import { ganeshAarti } from './ganesh-aarti';
import { shivAarti } from './shiv-aarti';
import { hanumanChalisa } from './hanuman-chalisa';
import { mahaLakshmiAshtakam } from './lakshmi-aarti';
import { bhavaniAshtakam } from './durga-aarti';
import { achyutashtakam } from './vishnu-aarti';
import { shivaTandavaStotram } from './shiva-tandava';
import { sriVishnuSahasranamaStotram } from './vishnu-sahasranamam';
import { bajrangBaan } from './bajrang-baan';
import { adityaHrudayam } from './aditya-hrudayam';
import { lingashtakam } from './lingashtakam';
import { kanakadharaStotram } from './kanakadhara';
import { mahishasuraMardiniStotram } from './aigiri-nandini';
import { saraswatiStotram } from './saraswati-vandana';

export const allAartis: Aarti[] = [
  ganeshAarti,
  shivAarti,
  hanumanChalisa,
  mahaLakshmiAshtakam,
  bhavaniAshtakam,
  achyutashtakam,
  shivaTandavaStotram,
  sriVishnuSahasranamaStotram,
  bajrangBaan,
  adityaHrudayam,
  lingashtakam,
  kanakadharaStotram,
  mahishasuraMardiniStotram,
  saraswatiStotram,
];

export function getAartiBySlug(slug: string): Aarti | undefined {
  return allAartis.find(a => a.slug === slug);
}

export function getAvailableLanguages(aarti: Aarti): Language[] {
  return SUPPORTED_LANGUAGES.filter(lang => lang.code in aarti.translations);
}
