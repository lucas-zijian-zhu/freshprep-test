
# GitHub Repositories Mobile App

A React Native mobile application built with Expo that allows users to search, browse, and favorite GitHub repositories. This app demonstrates modern React Native development practices with TypeScript, React Query, and optimistic updates.

## Features

### Level 1: Basic Mobile Client ✅
- **Home Screen**: Paginated list of GitHub repositories with search and sorting
- **Details Screen**: Detailed view of individual repositories
- **Loading & Error States**: Comprehensive loading indicators and error handling
- **Pull-to-Refresh**: Refresh functionality for the repository list
- **React Query Integration**: All data fetching powered by React Query

### Level 2: Query Caching & Search ✅
- **In-Memory Caching**: Repositories are cached during app session and never expire
- **Search Functionality**: Real-time search with debouncing
- **Sort Options**: Sort by stars, forks, or last updated
- **Persistent Caching**: Data remains cached throughout the entire app session

### Level 3: Favorites with Optimistic Updates ✅
- **Favorites Tab**: Dedicated tab for favorited repositories
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Local Storage**: Favorites persisted using AsyncStorage
- **Cache Integration**: Favorites sync with repository cache
- **Cross-Screen Sync**: Changes reflect across all screens instantly

## Tech Stack

- **React Native** with **Expo** for cross-platform mobile development
- **TypeScript** for type safety and better developer experience
- **React Query** for server state management and caching
- **AsyncStorage** for local data persistence
- **Expo Router** for file-based navigation
- **Jest** and **React Native Testing Library** for testing

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freshprep-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web browser
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Project Structure

```
freshprep-test/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen (repositories list)
│   │   └── favorites.tsx  # Favorites screen
│   ├── repository/        # Repository details screen
│   │   └── [id].tsx       # Dynamic route for repository details
│   └── _layout.tsx        # Root layout with QueryClient provider
├── components/            # Reusable UI components
│   ├── ThemedText.tsx     # Themed text component
│   ├── ThemedView.tsx     # Themed view component
│   ├── HapticTab.tsx      # Haptic feedback for tabs
│   └── ui/                # UI-specific components
├── hooks/                 # Custom React hooks
│   ├── useRepositories.ts # Repository data fetching hooks
│   ├── useFavorites.ts    # Favorites management hooks
│   └── useColorScheme.ts  # Theme management
├── services/              # API and storage services
│   ├── api.ts             # GitHub API service
│   └── favorites.ts       # AsyncStorage favorites service
├── types/                 # TypeScript type definitions
│   └── index.ts           # Shared types and interfaces
├── lib/                   # Library configurations
│   └── queryClient.ts     # React Query client configuration
└── __tests__/             # Test files
    ├── api.test.ts        # API service tests
    └── favorites.test.ts  # Favorites service tests
```

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Key Features Explained

### Search & Filtering
- Real-time search with GitHub's search API
- Sort by stars, forks, or last updated
- Pagination with infinite scroll
- Debounced search input for performance

### Favorites System
- Tap heart icon to add/remove favorites
- Optimistic updates for immediate feedback
- Persistent storage using AsyncStorage
- Cross-screen synchronization

### Error Handling
- Network error handling with retry mechanisms
- User-friendly error messages
- Graceful fallbacks for missing data
- Loading states for all async operations

### Performance Optimizations
- React Query caching reduces API calls
- Memoized components prevent unnecessary re-renders
- Infinite scroll for large datasets
- Optimized image loading

## Testing

The app includes comprehensive tests for core functionality:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Test coverage includes:
- API service functions
- Favorites service operations
- React Query hook behaviors
- Component rendering and interactions

## API Integration

The app integrates with GitHub's public API:
- **Search Endpoint**: `/search/repositories` for repository search
- **Repository Endpoint**: `/repos/{owner}/{repo}` for individual repositories
- **Rate Limiting**: Respects GitHub's rate limits (60 requests/hour for unauthenticated requests)

## Development Notes

### Assumptions Made
- Network connectivity is available
- GitHub API is stable and accessible
- Users have sufficient device storage
- Standard React Native features work across platforms

### Tradeoffs
- In-memory caching for simplicity (vs. persistent caching)
- Public GitHub API without authentication (vs. authenticated requests)
- AsyncStorage for local storage (vs. more complex database)
- File-based routing with Expo Router (vs. more complex navigation)

## Future Enhancements

- **Offline Support**: Cache repositories for offline viewing
- **Authentication**: Add GitHub OAuth for higher rate limits
- **Advanced Search**: Filters by language, date range, etc.
- **Social Features**: User profiles and sharing
- **Push Notifications**: Notify about repository updates
- **Dark Mode**: Enhanced theme support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue in the repository.
