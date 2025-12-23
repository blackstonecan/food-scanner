# Food Scanner

A React Native mobile app built with Expo that allows users to scan food product barcodes and view detailed nutritional information, ingredients, allergens, and health scores using the Open Food Facts database.

## Features

- **Barcode Scanning**: Scan product barcodes using device camera or select from gallery
- **Product Information**: View comprehensive product details including:
  - Nutritional facts (calories, fat, carbs, proteins, etc.)
  - Health scores (Nutri-Score, NOVA Group, Eco-Score)
  - Allergen information and traces
  - Complete ingredient lists
  - Product images and brand information
- **Scan History**: Track previously scanned products with ability to view and clear history
- **Cross-platform**: Works on iOS and Android devices

## Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0
- **Language**: TypeScript
- **UI**: React Native 0.81
- **Navigation**: Expo Router 6.0 (file-based routing)
- **Barcode Scanning**: @react-native-ml-kit/barcode-scanning
- **Camera**: expo-camera
- **Image Picker**: expo-image-picker
- **API**: [Open Food Facts API](https://world.openfoodfacts.org)

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo Go app on your mobile device, or
- iOS Simulator (macOS only) / Android Emulator

## Installation

1. Clone the repository:
```bash
git clone https://github.com/blackstonecan/food-scanner.git
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go app on your device

## Project Structure

```
app/
├── app/                      # App screens (file-based routing)
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Home screen with scanner
│   ├── history.tsx          # Scan history screen
│   └── product/
│       └── [code].tsx       # Product details screen
├── components/              # Reusable components
├── types/                   # TypeScript type definitions
├── utilities/               # Utility functions and services
├── assets/                  # Images and static assets
└── app.json                 # Expo configuration
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Permissions

The app requires the following permissions:
- **Camera**: To scan product barcodes
- **Photo Library**: To select barcode images from gallery

## API Integration

This app uses the [Open Food Facts API](https://world.openfoodfacts.org) to fetch product information. No API key is required.

API Endpoint:
```
https://world.openfoodfacts.org/api/v0/product/{barcode}.json
```

## Features Walkthrough

### Scanning Products
1. Tap "Scan Barcode" to open the camera
2. Point camera at a product barcode (EAN-13 or EAN-8)
3. Barcode will be detected automatically
4. Alternatively, tap "Select Image" to scan from a photo

### Viewing Product Details
- After scanning, product information is fetched and displayed
- View nutrition facts per 100g
- Check health and environmental scores
- Review allergens and ingredients
- See product images and brand details

### Scan History
- Recent scans appear on the home screen
- Tap "View All" to see complete history
- Tap any item to view product details again
- Clear all history with "Clear All History" button

## Building for Production

### Android APK
```bash
npx expo build:android
```

### iOS
```bash
npx expo build:ios
```

For more details, see [Expo Build Documentation](https://docs.expo.dev/build/introduction/).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Product data provided by [Open Food Facts](https://world.openfoodfacts.org)
- Built with [Expo](https://expo.dev)
- Barcode scanning powered by ML Kit
