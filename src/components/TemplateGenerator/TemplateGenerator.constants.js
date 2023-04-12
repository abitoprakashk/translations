import {t} from 'i18next'

export const STAFF = 'staff'
export const STUDENT = 'student'

export const pluginList = [
  'advlist',
  'nonbreaking',
  'autolink',
  'lists',
  'link',
  'image',
  'charmap',
  'anchor',
  'searchreplace',
  'visualblocks',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'table',
  'fontsize',
  'quickbars',
  'imageRadius', // custom plugin
]
export const orientation = {LANDSCAPE: 'LANDSCAPE', PORTRAIT: 'PORTRAIT'}
export const paperSize = {A4: 'A4', LETTER: 'LETTER', IDCARD: 'IDCARD'}
export const imageCategory = {
  BACKGROUND: 'BACKGROUND',
  WATERMARK: 'WATERMARK',
  GENERAL: 'GENERAL',
}

export const fieldType = {
  // common for ID and Certificate
  INSTITUTE: 'INSTITUTE',
  IMIS: 'IMIS',
  CUSTOM: 'CUSTOM',
}

export const tinyEmcPageConfig = {
  LETTER: {
    PORTRAIT: {
      height: `${841 + 4 + 78 + 25}`,
      width: `${595 + 4}`,
      fontSize: '100%',
    },
    LANDSCAPE: {
      height: `${595 + 4 + 78 + 25}`,
      width: `${841 + 4}`,
      fontSize: '100%',
    },
  },
  A4: {
    PORTRAIT: {
      width: `${595 + 4}`, // 4 is border width (2px right and 2px left)
      height: `${841 + 4 + 78 + 25 + 8}`, // inclusive of tiny emc top-bar and footer - 4px (top bottom border)  + 78px (toolbar height)+ 8px (toolbar padding top bottom) + 25px(footer height)
      fontSize: '100%',
    },
    LANDSCAPE: {
      height: `${595 + 4 + 78 + 25 + 8}`,
      width: `${841 + 4}`,
      fontSize: '100%',
    },
  },
  IDCARD: {
    PORTRAIT: {
      height: `${508 + 4 + 39 + 25 + 8}`,
      width: `${319 + 4}`,
      fontSize: '100%',
    },
    LANDSCAPE: {
      height: `${318 + 4 + 39 + 25 + 8}`,
      width: `${508 + 4}`,
      fontSize: '100%',
    },
  },
}

export const marginFields = [
  {label: t('templateGenerator.left'), fieldName: 'left'},
  {label: t('templateGenerator.top'), fieldName: 'top'},
  {label: t('templateGenerator.right'), fieldName: 'right'},
  {label: t('templateGenerator.bottom'), fieldName: 'bottom'},
]

export const STATIC = 'static'

export const FONT_MAP = {
  'Lato, sans-serif': {
    name: 'Roboto',
    url: 'https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap');`,
  },
  "'Dancing Script', cursive": {
    name: 'Dancing Script',
    url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');`,
  },
  "'Great Vibes', cursive": {
    name: 'Great Vibes',
    url: 'https://fonts.googleapis.com/css2?family=Great+Vibes',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`,
  },
  'Quintessential, cursive': {
    name: 'Quintessential',
    url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Quintessential&display=swap');`,
  },
  "'Open Sans', sans-serif": {
    name: 'Open Sans',
    url: `https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800`,
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');`,
  },
  "'Source Sans Pro', sans-serif": {
    name: 'Source Sans Pro',
    url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap');`,
  },
  "'Inter', sans-serif": {
    name: 'Inter',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');`,
  },
  "'Raleway', sans-serif": {
    name: 'Raleway',
    url: 'https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');`,
  },
  "'Merriweather Sans', sans-serif": {
    name: 'Merriweather',
    url: 'https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');`,
  },
  "'Bebas Neue', cursive": {
    name: 'Bebas Neue',
    url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`,
  },
  "'Crimson Text', serif": {
    name: 'Crimson Text',
    url: 'https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap');`,
  },
  "'Poppins', sans-serif": {
    name: 'Poppins',
    url: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
    importUrl: `@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap')`,
  },
}

export const DEFAULT_COLORS = [
  '#ADDDFA', // Primary-70
  '#ECD2EB', // Pastels/Melaine/50
  '#D3EEE4', // Pastels/Fringy/50
  '#FF6666', // Semantic/Error/100
  '#7DC9F8', // Primary/Primary-80
  '#C9DAEB', // Pastels/Polo Blue/50
  '#E4F3F7', // Pastels/Morning Glory/10
  '#A7DDC9', // Pastels/Fringy/100
  '#EAA624', // Semantic/Warning/100
  '#65B66D', // Semantic/Success/100
  '#1DA1F2', // Primary/Primary-100
  '#DAA6D8', // Pastels/Melaine/100
  '#A7DAC9', // Pastels/Fringy/100
  '#F19A8E', // Pastels/Sea Pink/100
]
