export const ESW_PRODUCT_TYPES = {
  Window: [
    { group: 'Horizontal Roller', items: ['ES-2000', 'ES-2050', 'ES-EL200', 'ES-MX2000', 'ES-SW340 LMI', 'ES-V200 - HORIZONTAL ROLLER', 'HR-2600 - LMI'] },
    { group: 'Casement', items: ['ES-5000', 'ES-P252 LMI - CASEMENT', 'ES-V500 - CASEMENT', 'HC-200 LMI'] },
    { group: 'Single Hung', items: ['600T LMI', 'ES-1000', 'ES-1000WW', 'ES-1050', 'ES-1050WW', 'ES-1150WW', 'ES-EL100'] },
    { group: 'Fixed Window', items: ['ES-1500', 'ES-8000 JUMBO', 'ES-8000T JUMBO', 'ES-EL150', 'ES-MX1500', 'ES-P252 LMI - FIXED WINDOW', 'ES-V150 - FIXED WINDOW'] },
    { group: 'Fixed Casement', items: ['ES-5100'] },
    { group: 'Awning', items: ['ES-5500', 'ES-5600', 'ES-P252 LMI AWNING', 'ES-V550 - AWNING', 'GW-2650 LMI'] },
  ],
  Doors: [
    'ES-3001', 'ES-9000 - INSWING DOOR', 'ES-9000', 'ES-9100', 'ES-EL300', 'ES-MX3000', 'ES-PSD5030T DOOR',
    'ES-BF5010T',
  ],
  Sliders: [
    'ES-6000 INSULAMINATED', 'ES-6000 LAMINATED', 'ES-EL400 - SLIDING GLASS DOOR', 'ES-MX4000', 'ES-SD450', 'ES-SD451 LMI', 'ES-SGD2020 - SLIDING GLASS DOOR',
  ],
  Storefront: [
    'ES-7000', 'ES-7100', 'ES-7500', 'ES-7600', 'ES-8000 - STOREFRONT', 'ES-8000T LMI - STOREFRONT', 'ES-8860 LMI',
  ],
  Mullion: [
    'ES-8000 SHAPE', 'ES-EL150 SHAPE', 'ES-MX1500 SHAPE', 'ES-V150 SHAPE - FIXED WINDOW',
  ],
};

export const MR_GLASS_SERIES = [
  { group: true, label: '── WINDOWS ──' },
  'MG200 (SH)',
  'MG300 (HR)',
  'MG400 (PW)',
  'MG450 (PW)',
  'MG600 (CA)',
  { group: true, label: '── MG350 SERIES ──' },
  'MG350 (HR)',
  'MG350 (SH)',
  'MG350 (PW)',
  { group: true, label: '── DOORS ──' },
  'MG1000 (SGD)',
  'MG1100 (SGD MultiTrack)',
  'MG1500 (SGD)',
  'MG3000 (FD)',
  'MG3500 (FD)',
  'MG4000 (Pivot Door)',
  { group: true, label: '── COMMERCIAL ──' },
  'MG275/MG4500 (SF)',
  'MG500/MG5000 (SF)',
  'MG6000 (SF)',
  'MG5500 (SF/WW)',
];

export const SERIES_CONFIGS = {
  'MG200 (SH)': ['OX Equal', 'OX Unequal (Oriel)'],
  'MG350 (SH)': ['OX Equal', 'OX Unequal (Oriel)'],
  'MG300 (HR)': ['XO', 'OX', 'XOX [1/3][1/3][1/3]', 'XOX [1/4][1/2][1/4]'],
  'MG350 (HR)': ['XO', 'OX', 'XOX [1/3][1/3][1/3]', 'XOX [1/4][1/2][1/4]'],
  'MG400 (PW)': ['RECTANGLE', 'ARCH WITH LEGS', 'HALF CIRCLE', 'EYEBROW', 'CIRCLE', 'TRAPEZOID', 'TRIANGLE', 'OVAL', 'OCTAGON', 'HALF ARC LEG', 'HALF EYEBROW'],
  'MG450 (PW)': ['RECTANGLE', 'ARCH WITH LEGS', 'HALF CIRCLE', 'EYEBROW', 'CIRCLE', 'TRAPEZOID', 'TRIANGLE', 'OVAL', 'OCTAGON', 'HALF ARC LEG', 'HALF EYEBROW'],
  'MG350 (PW)': ['RECTANGLE', 'ARCH WITH LEGS', 'HALF CIRCLE', 'EYEBROW', 'CIRCLE', 'TRAPEZOID', 'TRIANGLE', 'OVAL', 'OCTAGON', 'HALF ARC LEG', 'HALF EYEBROW'],
  'MG600 (CA)': ['SINGLE', 'DOUBLE', 'DOUBLE W/TRANSOM', 'SINGLE W/TRANSOM', 'TRIPLE'],
  'MG1000 (SGD)': ['OX', 'XO', 'XX', 'OXO', 'OXO Reverse', 'XOX', 'OXXO', 'OXXO Reverse', 'X Pocket', 'X Reverse Pocket', 'XX Pocket', 'XX Reverse Pocket', 'XX Two Sides Pocket', 'XX Two Sides Reverse Pocket', 'XXXX Pocket', 'XXXX Reverse Pocket'],
  'MG1100 (SGD MultiTrack)': ['XXX', 'XXXXXX', 'XXO', 'OXX', 'XXX Reverse', 'OXXXO', 'PXXXXXXP', 'PXXXXXXP Reverse', 'PXXX', 'XXXP Reverse'],
  'MG1500 (SGD)': ['XX', 'XO', 'XX Reverse', 'OX', 'OXO', 'OXO Reverse', 'OXXO', 'OXXO Reverse'],
  'MG3000 (FD)': ['X', 'O', 'XX', 'OX', 'XO', 'XXO', 'OXX', 'OXXO', 'OXO'],
  'MG3500 (FD)': ['X', 'XX'],
  'MG4000 (Pivot Door)': ['X'],
  'MG275/MG4500 (SF)': ['FIXED'],
  'MG500/MG5000 (SF)': ['FIXED'],
  'MG6000 (SF)': ['FIXED'],
  'MG5500 (SF/WW)': ['FIXED'],
  // ESW Single Hung — OX Equal / OX Unequal (Oriel) system
  '600T LMI': ['OX Equal', 'OX Unequal (Oriel)'],
  'ES-1000': ['OX Equal', 'OX Unequal (Oriel)'],
  'ES-1000WW': ['OX Equal', 'OX Unequal (Oriel)'],
  'ES-1050': ['OX Equal', 'OX Unequal (Oriel)'],
  'ES-1050WW': ['OX Equal', 'OX Unequal (Oriel)'],
  'ES-1150WW': ['OX Equal', 'OX Unequal (Oriel)'],
  'ES-EL100': ['OX Equal', 'OX Unequal (Oriel)'],
  // ESW Horizontal Roller — mirrors MR Glass HR config
  'ES-2000': ['XO', 'OX', 'XOX [1/3][1/3][1/3]', 'XOX [1/4][1/2][1/4]'],
  'ES-2050': ['XO', 'OX', 'XOX [1/3][1/3][1/3]', 'XOX [1/4][1/2][1/4]'],
  'ES-EL200': ['XO', 'OX', 'XOX [1/3][1/3][1/3]', 'XOX [1/4][1/2][1/4]'],
  'ES-MX2000': ['XO', 'OX', 'XOX [1/3][1/3][1/3]', 'XOX [1/4][1/2][1/4]'],
  'ES-SW340 LMI': ['XO', 'OX', 'XOX [1/3][1/3][1/3]', 'XOX [1/4][1/2][1/4]'],
  'ES-V200 - HORIZONTAL ROLLER': ['XO', 'OX', 'XOX [1/3][1/3][1/3]', 'XOX [1/4][1/2][1/4]'],
  'HR-2600 - LMI': ['XO', 'OX', 'XOX [1/3][1/3][1/3]', 'XOX [1/4][1/2][1/4]'],
  // ESW Casement
  'ES-5000': ['SINGLE', 'DOUBLE'],
  'ES-P252 LMI - CASEMENT': ['SINGLE', 'DOUBLE'],
  'ES-V500 - CASEMENT': ['SINGLE', 'DOUBLE'],
  'HC-200 LMI': ['SINGLE', 'DOUBLE'],
};

export const GLASS_COLORS = [
  'CLEAR', 'GRAY', 'BRONZE', 'SOLEX GREEN', 'SOLAR COOL BRONZE',
  'SOLAR COOL GRAY', 'DOUBLE GRAY', 'DOUBLE BRONZE', 'PACIFIC BLUE',
  'PACIFICA BLUE', 'BLUE-GREEN', 'AZURIA', 'SOLAR BLUE',
  'SOLARCOOL AZURIA', 'SOLARCOOL PACIFICA', 'NONE'
];

export const FRAME_COLORS = [
  'Clear Anodized', 'White', 'White 2605', 'Arcadia Silver 2605',
  'Bronze Powdercoat', 'Bronze 2605', 'Black Matte', 'Texture Black',
  'MG CHARCOAL', 'Wood Grain Dark Walnut', 'Wood Grain Java'
];

export const LOWE_COATINGS = ['NONE', 'CLIMA GUARD 62/27', 'SB70', 'SB60'];

// ESW Sliding door opening directions
export const ESW_SLIDER_OPENINGS = [
  'XO', 'OX', 'XX', 'XXO', 'OXX', 'XXX', 'OXXX', 'XXXO', 'OX-XO', 'XXXX', 'OXX-XXO', 'XXX-XXX',
];

// Series that use OX Equal / OX Unequal (Oriel) config with sash height
export const SH_UNEQUAL_SERIES = [
  'MG200 (SH)', 'MG350 (SH)',
  '600T LMI', 'ES-1000', 'ES-1000WW', 'ES-1050', 'ES-1050WW', 'ES-1150WW', 'ES-EL100',
];

// Series that show window option checkboxes (Privacy + Flush Adapter / Equal Leg)
export const WINDOW_OPTION_SERIES = [
  'MG200 (SH)', 'MG300 (HR)', 'MG400 (PW)', 'MG450 (PW)', 'MG600 (CA)',
  'MG350 (HR)', 'MG350 (SH)', 'MG350 (PW)',
  // ESW Single Hung
  '600T LMI', 'ES-1000', 'ES-1000WW', 'ES-1050', 'ES-1050WW', 'ES-1150WW', 'ES-EL100',
  // ESW Horizontal Roller
  'ES-2000', 'ES-2050', 'ES-EL200', 'ES-MX2000', 'ES-SW340 LMI', 'ES-V200 - HORIZONTAL ROLLER', 'HR-2600 - LMI',
];

// Series that show door option checkboxes (Privacy + LH + RH)
export const DOOR_OPTION_SERIES = [
  'MG3000 (FD)', 'MG3500 (FD)', 'MG4000 (Pivot Door)',
];