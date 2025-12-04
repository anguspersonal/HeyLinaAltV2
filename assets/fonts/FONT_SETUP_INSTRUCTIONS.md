# Font Setup Instructions

This document provides instructions for downloading and installing the required custom fonts for the HeyLina mobile app.

## Required Fonts

### 1. Instrument Sans
- **Purpose**: Primary UI font (sans-serif)
- **Source**: [Google Fonts - Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)
- **Required Files**:
  - `InstrumentSans-Regular.ttf` (400 weight)
  - `InstrumentSans-Medium.ttf` (500 weight)
  - `InstrumentSans-SemiBold.ttf` (600 weight)
  - `InstrumentSans-Bold.ttf` (700 weight)

**Installation Steps**:
1. Visit https://fonts.google.com/specimen/Instrument+Sans
2. Click "Download family"
3. Extract the downloaded ZIP file
4. Copy the following files to `assets/fonts/InstrumentSans/`:
   - `InstrumentSans-Regular.ttf`
   - `InstrumentSans-Medium.ttf`
   - `InstrumentSans-SemiBold.ttf`
   - `InstrumentSans-Bold.ttf`

### 2. Carattere
- **Purpose**: Accent font for personalization (handwritten/script)
- **Source**: [Google Fonts - Carattere](https://fonts.google.com/specimen/Carattere)
- **Required Files**:
  - `Carattere-Regular.ttf`

**Installation Steps**:
1. Visit https://fonts.google.com/specimen/Carattere
2. Click "Download family"
3. Extract the downloaded ZIP file
4. Copy `Carattere-Regular.ttf` to `assets/fonts/Carattere/`

## Verification

After adding the font files, your directory structure should look like:

```
assets/fonts/
├── InstrumentSans/
│   ├── InstrumentSans-Regular.ttf
│   ├── InstrumentSans-Medium.ttf
│   ├── InstrumentSans-SemiBold.ttf
│   └── InstrumentSans-Bold.ttf
├── Carattere/
│   └── Carattere-Regular.ttf
├── Inter/
├── Montserrat/
└── Montserrat_Alternates/
```

## Next Steps

Once the font files are in place, the app will automatically load them on startup. The fonts are configured in:
- `app/_layout.tsx` - Font loading configuration
- `constants/theme.ts` - Font family constants
- `hooks/useFonts.ts` - Custom font loading hook
