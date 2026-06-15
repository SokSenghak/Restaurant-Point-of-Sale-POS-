export interface FontOption {
  value: string;
  label: string;
}

export const ENGLISH_FONTS: FontOption[] = [
  { value: 'Inter', label: 'Inter (Sans-Serif)' },
  { value: 'Roboto', label: 'Roboto (Standard Sans)' },
  { value: 'Open Sans', label: 'Open Sans (Clean)' },
  { value: 'Poppins', label: 'Poppins (Geometric)' },
  { value: 'Montserrat', label: 'Montserrat (Elegant)' },
  { value: 'Lato', label: 'Lato (Warm)' },
  { value: 'Oswald', label: 'Oswald (Condense)' },
  { value: 'Raleway', label: 'Raleway (Stylish Thin)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif Display)' },
  { value: 'Merriweather', label: 'Merriweather (Book Serif)' },
  { value: 'Nunito', label: 'Nunito (Friendly Rounded)' },
  { value: 'Ubuntu', label: 'Ubuntu (Technical)' },
  { value: 'Lora', label: 'Lora (Editorial Serif)' },
  { value: 'PT Sans', label: 'PT Sans (Universal)' },
  { value: 'Quicksand', label: 'Quicksand (Round Display)' },
  { value: 'Josefin Sans', label: 'Josefin Sans (Art-Deco)' },
  { value: 'Fira Sans', label: 'Fira Sans (Dev Mono/Sans)' },
  { value: 'Rubik', label: 'Rubik (Puffy Friendly)' },
  { value: 'Outfit', label: 'Outfit (Modern Tech)' },
  { value: 'Space Grotesk', label: 'Space Grotesk (Brutalist)' }
];

export const KHMER_FONTS: FontOption[] = [
  { value: 'Koulen', label: 'Koulen (គូលែន - Bold Display)' },
  { value: 'Hanuman', label: 'Hanuman (ហនុមាន - Classical Serif)' },
  { value: 'Nokora', label: 'Nokora (នគរ - Clean Slab)' },
  { value: 'Battambang', label: 'Battambang (បាត់ដំបង - Rounded)' },
  { value: 'Siemreap', label: 'Siemreap (សៀមរាប - Smooth Standard)' },
  { value: 'Bokor', label: 'Bokor (បូកគោ - Retro Script)' },
  { value: 'Metal', label: 'Metal (មាស - Heavy Gothic)' },
  { value: 'Content', label: 'Content (មាតិកា - Standard Book)' },
  { value: 'Preahvihear', label: 'Preahvihear (ព្រះវិហារ - Editorial Bold)' },
  { value: 'Angkor', label: 'Angkor (អង្គរ - Traditional Carved)' },
  { value: 'Moul', label: 'Moul (មូល - High Calligraphy)' },
  { value: 'Chenla', label: 'Chenla (ចេនឡា - Rounded Book)' },
  { value: 'Taprom', label: 'Taprom (តាព្រហ្ម - Artistic)' },
  { value: 'Freehand', label: 'Freehand (សរសេរដៃ - Cursive Pen)' },
  { value: 'Kdam Thmor 3', label: 'Kdam Thmor 3 (ក្តាមថ្ម - Comic Sans Style)' },
  { value: 'Suwannaphum', label: 'Suwannaphum (សុវណ្ណភូមិ - Classical Tall)' },
  { value: 'Odor Mean Chey', label: 'Odor Mean Chey (ឧត្តរមានជ័យ - Display Light)' },
  { value: 'Fasthand', label: 'Fasthand (ដៃរហ័ស - Expressive Ink)' },
  { value: 'Dangrek', label: 'Dangrek (ដងរែក - Tall Slab Header)' },
  { value: 'Khula', label: 'Khula (ខូឡា - Modern Geometric)' }
];

// Helper to inject fonts dynamically to DOM head
export function injectGoogleFont(fontName: string) {
  const linkId = 'dynamic-google-fonts-link';
  let link = document.getElementById(linkId) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  // format font name for google url parameter e.g. "Space Grotesk" to "Space+Grotesk"
  const formattedName = fontName.replace(/\s+/g, '+');
  
  // Check if it is a Khmer font
  const isKhmer = KHMER_FONTS.some(f => f.value === fontName);
  
  if (isKhmer) {
    // Khmer fonts might fail with complex weight requests. Omit weights to request default regular weight safely.
    link.href = `https://fonts.googleapis.com/css2?family=${formattedName}&display=swap`;
  } else {
    // English fonts are highly compatible with standard weights: 300, 400, 500, 600, 700
    link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@300;400;500;600;700&display=swap`;
  }

  // Update root elements and Tailwind variables
  document.documentElement.style.setProperty('--font-sans', `"${fontName}", ui-sans-serif, system-ui, sans-serif`);
  document.documentElement.style.setProperty('--font-display', `"${fontName}", ui-sans-serif, system-ui, sans-serif`);
  document.body.style.fontFamily = `"${fontName}", ui-sans-serif, system-ui, -apple-system, sans-serif`;
}
