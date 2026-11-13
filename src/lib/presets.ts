export interface LetterPreset {
  id: string;
  name: string;
  description: string;
  tagline: string;
  envelopeColor: string;
  envelopeBorder: string;
  sealColor: string;
  sealIcon: string;
  paperBg: string;
  paperText: string;
  paperBorder: string;
  fontFamily: string;
  accentBg: string;
  badgeText: string;
}

export const LETTER_PRESETS: Record<string, LetterPreset> = {
  vintage: {
    id: "vintage",
    name: "Vintage Wax Seal",
    description: "Nuansa kertas perkamen klasik dengan segel lilin merah bata timbul.",
    tagline: "Seperti surat bersejarah yang ditulis dengan pena celup",
    envelopeColor: "bg-[#E6DAC3] text-[#3E2E20]",
    envelopeBorder: "border-[#C8B89E]",
    sealColor: "bg-[#8E2828] text-[#FBEAEA] border-[#5E1616]",
    sealIcon: "seal",
    paperBg: "bg-[#F7F2E7]",
    paperText: "text-[#281D14]",
    paperBorder: "border-[#D8C7AA]",
    fontFamily: "font-serif",
    accentBg: "bg-[#8E2828]",
    badgeText: "Vintage",
  },
  romantic: {
    id: "romantic",
    name: "Romantic Ribbon",
    description: "Amplop dusty rose lembut dengan aksen pita satin manis.",
    tagline: "Penuh kehangatan, kasih sayang, dan kenangan indah",
    envelopeColor: "bg-[#EED5DA] text-[#4A2630]",
    envelopeBorder: "border-[#DBB0BA]",
    sealColor: "bg-[#B4536E] text-[#FFF0F3] border-[#7F2F44]",
    sealIcon: "heart",
    paperBg: "bg-[#FFF8F9]",
    paperText: "text-[#3D1E26]",
    paperBorder: "border-[#F0C9D3]",
    fontFamily: "font-sans",
    accentBg: "bg-[#B4536E]",
    badgeText: "Romantic",
  },
  postcard: {
    id: "postcard",
    name: "Retro Postcard",
    description: "Kartu pos aerogram retro dengan garis tepi pos udara dan stempel pos kota.",
    tagline: "Surat singkat dari perantau di seberang pulau",
    envelopeColor: "bg-[#EAE5D9] text-[#242A38]",
    envelopeBorder: "border-[#CCC3B0]",
    sealColor: "bg-[#1E3A8A] text-[#DBEAFE] border-[#172554]",
    sealIcon: "stamp",
    paperBg: "bg-[#FAF7F0]",
    paperText: "text-[#1C2433]",
    paperBorder: "border-[#D6CDBC]",
    fontFamily: "font-mono",
    accentBg: "bg-[#1E3A8A]",
    badgeText: "Postcard",
  },
  kraft: {
    id: "kraft",
    name: "Artisan Kraft",
    description: "Amplop cokelat kraft tebal dengan detail segel kancing dan lilitan tali pos.",
    tagline: "Sederhana, membumi, dan bernilai orisinalitas tinggi",
    envelopeColor: "bg-[#D9C4A5] text-[#332212]",
    envelopeBorder: "border-[#BCA380]",
    sealColor: "bg-[#5C3D24] text-[#F3E9DD] border-[#3B2513]",
    sealIcon: "button",
    paperBg: "bg-[#EFE4D2]",
    paperText: "text-[#261A0F]",
    paperBorder: "border-[#CCBA9E]",
    fontFamily: "font-mono",
    accentBg: "bg-[#5C3D24]",
    badgeText: "Kraft",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Solitude",
    description: "Amplop charcoal gelap mewah dengan cap stempel emas berkilau.",
    tagline: "Kumpulan kata yang hanya berani ditulis saat malam larut",
    envelopeColor: "bg-[#1F2530] text-[#E8ECF2]",
    envelopeBorder: "border-[#343F52]",
    sealColor: "bg-[#D4A359] text-[#1F2530] border-[#9E7332]",
    sealIcon: "moon",
    paperBg: "bg-[#171C24]",
    paperText: "text-[#F1E8D9]",
    paperBorder: "border-[#2D3748]",
    fontFamily: "font-serif",
    accentBg: "bg-[#D4A359]",
    badgeText: "Midnight",
  },
};

export function getPreset(styleId: string): LetterPreset {
  return LETTER_PRESETS[styleId] || LETTER_PRESETS.vintage;
}
