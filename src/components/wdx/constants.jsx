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
  'MG200 (SH)': ['OX'],
  'MG350 (SH)': ['OX'],
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