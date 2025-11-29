# Feature: Brand Integration

## 1. Problem Description
We have received a handover from the brand team containing assets (fonts, logos, icons) and guidelines. We need to integrate these into the app to ensure a consistent brand identity ("HeyLina").

## 2. User Story
As a user, I want the app to look and feel like "HeyLina" with consistent fonts, colors, and logos, so that I trust the brand and have a cohesive experience.

## 3. Goals & Success Criteria
-   **App Name**: Displayed as "HeyLina" consistently.
-   **Logo**: Used as app icon, splash screen, and browser favicon (if applicable).
-   **Fonts**: `Inter` and `Montserrat` configured globally.
-   **Colors**: Brand colors defined in a central config and applied globally.
-   **Cleanup**: `Handover Files` folder deleted after integration.

## 4. Technical Constraints
-   **Framework**: React Native (Expo).
-   **Assets**: Must be optimized for mobile.
-   **Fonts**: Must be loaded asynchronously to prevent FOUT/FOIT.

## 5. Implementation Plan

### 5.1 Asset Porting
-   **Fonts**:
    -   Move `Handover Files/Fonts/Inter/*.ttf` to `assets/fonts/Inter/`.
    -   Move `Handover Files/Fonts/Montserrat/*.ttf` to `assets/fonts/Montserrat/`.
-   **Images**:
    -   Move `Handover Files/App Icon/App-Iocn-Blue.png` to `assets/images/icon.png` (and adaptive icon variants).
    -   Move `Handover Files/Logos/PNGs/*` to `assets/images/logos/`.

### 5.2 Configuration
-   **`app.json`**:
    -   Update `name`, `slug`, `scheme` to "HeyLina".
    -   Update `icon`, `splash`, `adaptiveIcon` paths.
    -   Update `web.favicon`.
-   **`constants/Colors.ts`**:
    -   Define `light` and `dark` themes using extracted brand colors.
    -   *Note: Need specific Hex codes from Brand Guidelines (PDF not readable).*
-   **`app/_layout.tsx`**:
    -   Load fonts using `expo-font`.
    -   Configure `SplashScreen` to wait for fonts.

### 5.3 Cleanup
-   Delete `Handover Files` directory.

## 6. Questions / Risks
-   **Color Codes**: I cannot read the PDF Brand Guidelines. Please provide the Hex codes for the Primary, Secondary, and Accent colors.
-   **Icon Background**: The "Olive" and "Blue" icons are provided. Which one is the primary app icon? (Assuming Blue based on "App-Iocn-Blue.png").

## 7. Verification Plan
### Automated Tests
-   `npm run android` / `npm run ios`: Verify build succeeds with new assets.
-   `npx expo config --json`: Verify `app.json` values are correct.

### Manual Verification
-   **Splash Screen**: Launch app, verify logo and background color.
-   **App Icon**: Verify icon on device home screen.
-   **Fonts**: Check text elements for `Inter` and `Montserrat`.
-   **Colors**: Verify UI elements match the defined palette.
