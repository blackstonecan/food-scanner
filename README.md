# Food Scanner

A modern React Native mobile application built with Expo that allows users to scan food product barcodes, view comprehensive nutritional information, and share product reviews with the community. The app leverages the Open Food Facts database for product data and includes a cloud-based review system powered by Supabase.

## Features

### Core Functionality
- **Barcode Scanning**: Real-time barcode scanning using device camera with ML Kit integration
- **Image Selection**: Upload barcode images from device gallery
- **Manual Entry**: Input barcodes manually when camera scanning isn't available
- **Product Information**: Comprehensive product details including:
  - Nutritional facts (calories, fat, carbohydrates, proteins, fiber, salt, etc.)
  - Health scores (Nutri-Score, NOVA Group, Eco-Score)
  - Allergen information and traces
  - Complete ingredient lists with analysis
  - Product images, brand information, and manufacturing details

### Community Features
- **Product Reviews**: Write and share reviews for scanned products
- **Star Ratings**: Rate products from 1-5 stars
- **Review Management**: View, edit, and delete your own reviews
- **Community Ratings**: See average ratings and reviews from other users
- **Device-Based Authentication**: Reviews are tied to your device for seamless experience

### User Experience
- **Scan History**: Track previously scanned products with timestamps
- **Quick Access**: Tap any history item to instantly view product details
- **History Management**: Clear individual items or entire scan history
- **Cross-Platform**: Works seamlessly on iOS and Android devices
- **Dark Mode**: Automatic theme support based on system preferences

## Tech Stack

### Frontend
- **Framework**: [Expo](https://expo.dev) ~54.0 with New Architecture
- **Language**: TypeScript ~5.9
- **UI Framework**: React Native 0.81
- **Navigation**: Expo Router 6.0 (file-based routing with typed routes)
- **State Management**: React Hooks (useState, useCallback, useFocusEffect)
- **Animations**: React Native Reanimated 4.1

### Camera & Scanning
- **Barcode Scanning**: @react-native-ml-kit/barcode-scanning 2.0
- **Camera**: expo-camera 17.0
- **Image Picker**: expo-image-picker 17.0

### Backend & Data
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Authentication**: Device-based using expo-application
- **API**: [Open Food Facts API v2](https://world.openfoodfacts.org/api/v2)
- **Client SDK**: @supabase/supabase-js 2.89

### Additional Libraries
- **Icons**: @expo/vector-icons 15.0
- **Haptics**: expo-haptics 15.0
- **Image Optimization**: expo-image 3.0
- **Gestures**: react-native-gesture-handler 2.28

## Prerequisites

- **Node.js**: v18 or later (LTS version recommended)
- **Package Manager**: npm or yarn
- **Expo Go**: Install on your mobile device from App Store/Play Store
- **Development Tools** (optional):
  - iOS Simulator (macOS only with Xcode)
  - Android Studio with Android Emulator
- **Supabase Account**: Free account at [supabase.com](https://supabase.com) for review functionality

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/blackstonecan/food-scanner.git
cd food-scan/app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace with your Supabase credentials:
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

### 4. Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `supabase.sql` to create the reviews table:
   - Creates `reviews` table with proper schema
   - Sets up indexes for performance
   - Configures Row Level Security (RLS) policies
   - Adds automatic timestamp updates

### 5. Start Development Server
```bash
npx expo start
```

### 6. Run on Your Device

**Option A: Physical Device (Recommended)**
- Install Expo Go from App Store (iOS) or Play Store (Android)
- Scan the QR code displayed in terminal
- Ensure your phone and computer are on the same network

**Option B: iOS Simulator (macOS only)**
```bash
npm run ios
```
Or press `i` in the Expo CLI

**Option C: Android Emulator**
```bash
npm run android
```
Or press `a` in the Expo CLI

**Option D: Web Browser**
```bash
npm run web
```
Or press `w` in the Expo CLI (limited functionality)

## Project Structure

```
app/
├── app/                          # App screens (file-based routing)
│   ├── _layout.tsx              # Root layout with navigation
│   ├── index.tsx                # Home screen with barcode scanner
│   ├── history.tsx              # Full scan history view
│   ├── reviews.tsx              # User's reviews management
│   └── product/
│       └── [code].tsx           # Dynamic product details screen
├── components/                   # Reusable UI components
│   ├── CameraModal.tsx          # Camera view for barcode scanning
│   ├── HistoryItemCard.tsx      # Scan history list item
│   ├── ProductCard.tsx          # Product information display
│   ├── ReviewCard.tsx           # Individual review display
│   ├── ReviewModal.tsx          # Review creation/editing modal
│   ├── ReviewsList.tsx          # List of product reviews
│   ├── StarRating.tsx           # Star rating display
│   └── StarRatingInput.tsx      # Interactive star rating input
├── types/                        # TypeScript type definitions
│   ├── ProductInfo.ts           # Product and nutrition types
│   └── Review.ts                # Review-related types
├── utilities/                    # Utility functions and services
│   ├── supabaseClient.ts        # Supabase client configuration
│   ├── reviewService.ts         # Review CRUD operations
│   ├── historyService.ts        # Local scan history management
│   └── deviceService.ts         # Device identification
├── assets/                       # Static assets
│   └── images/                  # App icons and images
├── android/                      # Android native code
├── ios/                          # iOS native code
├── app.json                      # Expo configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── supabase.sql                  # Database schema
└── .env                          # Environment variables (create this)
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator (requires Android Studio)
- `npm run ios` - Run on iOS simulator (macOS only, requires Xcode)
- `npm run web` - Run in web browser (limited functionality)
- `npm run lint` - Run ESLint for code quality checks
- `npm run reset-project` - Reset project to initial state

## Permissions

The app requires the following permissions:

### iOS
- **Camera**: To scan product barcodes in real-time
- **Photo Library**: To select barcode images from photo gallery

### Android
- **Camera**: `android.permission.CAMERA`
- **Record Audio**: `android.permission.RECORD_AUDIO` (camera requirement)

Permissions are requested at runtime when needed.

## API Integration

### Open Food Facts API

This app uses the [Open Food Facts API v2](https://world.openfoodfacts.org) to fetch comprehensive product information.

**API Endpoint:**
```
https://world.openfoodfacts.org/api/v2/product/{barcode}
```

**Features:**
- No API key required
- Free and open-source database
- Global product coverage
- Multilingual support
- Real-time updates from community

### Supabase Backend

The review system uses Supabase for:
- Storing user reviews
- Real-time review updates
- Automatic timestamp management
- Row-level security policies
- Device-based user identification

## Usage Guide

### Scanning Products

1. **Camera Scan**
   - Tap "Scan Barcode" on the home screen
   - Point your camera at a product barcode (EAN-13, EAN-8, UPC-A)
   - The barcode will be detected automatically
   - Product details load immediately after detection

2. **Image Upload**
   - Tap "Select Image" to choose from gallery
   - Select a photo containing a barcode
   - Barcode will be extracted and processed

3. **Manual Entry**
   - Tap "Enter Manually" for keyboard input
   - Type the barcode number (8-13 digits)
   - Tap "Search" to fetch product information

### Viewing Product Details

After scanning, you'll see:
- Product name, brand, and images
- Nutrition facts per 100g serving
- Health scores (Nutri-Score: A-E, NOVA: 1-4)
- Environmental impact (Eco-Score)
- Allergen warnings and traces
- Complete ingredient list
- Community reviews and ratings

### Managing Reviews

**Writing a Review:**
1. Scan or view a product
2. Tap "Write a Review" button
3. Select star rating (1-5 stars)
4. Write your review text
5. Tap "Submit" to publish

**Viewing Your Reviews:**
1. Navigate to "My Reviews" tab
2. See all your submitted reviews
3. Tap any review to view the product

**Editing Reviews:**
1. Go to "My Reviews"
2. Tap "Edit" on any review
3. Update rating or text
4. Save changes

**Deleting Reviews:**
1. Go to "My Reviews"
2. Tap "Delete" on any review
3. Confirm deletion

### Scan History

**Viewing History:**
- Recent scans (5 latest) appear on home screen
- Tap "View All History" for complete list
- Tap any item to view product details again

**Clearing History:**
- Tap "Clear All History" to remove all entries
- History is stored locally on device
- Does not affect your submitted reviews

## Building for Production

### Android (APK/AAB)

**Development Build:**
```bash
eas build --platform android --profile development
```

**Production Build:**
```bash
eas build --platform android --profile production
```

### iOS (IPA)

**Development Build:**
```bash
eas build --platform ios --profile development
```

**Production Build:**
```bash
eas build --platform ios --profile production
```

For detailed build configuration, see [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/).

## Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1...` |

## Configuration

### App Configuration (app.json)

Key settings:
- **Bundle Identifier**: `com.anonymous.app` (change for production)
- **Version**: 1.0.0
- **Orientation**: Portrait only
- **New Architecture**: Enabled for better performance
- **Edge-to-Edge**: Enabled on Android
- **Typed Routes**: Enabled for type-safe navigation

## Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted
- Restart the app after granting permissions
- Check if camera works in other apps

### Barcode Not Detected
- Ensure good lighting conditions
- Hold camera steady and perpendicular to barcode
- Try adjusting distance from barcode
- Verify barcode is EAN-13, EAN-8, or UPC-A format

### Product Not Found
- Verify barcode was scanned correctly
- Product may not be in Open Food Facts database
- Try manual entry to confirm barcode number
- Consider contributing to Open Food Facts

### Reviews Not Loading
- Check internet connection
- Verify Supabase credentials in `.env`
- Ensure database schema is properly set up
- Check Supabase dashboard for errors

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style conventions
- TypeScript types are properly defined
- No lint errors (`npm run lint`)
- App builds successfully on both platforms

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Product Data**: [Open Food Facts](https://world.openfoodfacts.org) - Open food products database
- **Framework**: [Expo](https://expo.dev) - React Native development platform
- **Backend**: [Supabase](https://supabase.com) - Open source Firebase alternative
- **ML Kit**: Google ML Kit for barcode scanning
- **Community**: Thanks to all contributors and users

## Links

- **GitHub Repository**: [github.com/blackstonecan/food-scanner](https://github.com/blackstonecan/food-scanner)
- **Open Food Facts**: [world.openfoodfacts.org](https://world.openfoodfacts.org)
- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section

---

Built with React Native and Expo | Powered by Open Food Facts & Supabase
