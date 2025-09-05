# Architecture Documentation

## Project Structure & Folder Layout

```
freshprep-test/
├── app/                          # Expo Router app directory
│   ├── _layout.tsx              # Root layout with QueryClient provider
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # Home screen (repositories list)
│   │   └── favorites.tsx        # Favorites screen
│   ├── repository/              # Dynamic route for repository details
│   │   └── [id].tsx             # Repository details screen
│   └── +not-found.tsx           # 404 page
├── components/                   # Reusable UI components
│   ├── ThemedText.tsx           # Themed text component
│   ├── ThemedView.tsx           # Themed view component
│   ├── HapticTab.tsx            # Haptic feedback for tabs
│   └── ui/                      # UI-specific components
├── constants/                    # App constants
│   └── Colors.ts                # Color scheme definitions
├── hooks/                        # Custom React hooks
│   ├── useRepositories.ts       # Repository data fetching hooks
│   ├── useFavorites.ts          # Favorites management hooks
│   └── useColorScheme.ts        # Theme management
├── lib/                          # Library configurations
│   └── queryClient.ts           # React Query client configuration
├── services/                     # External service integrations
│   ├── api.ts                   # GitHub API service
│   └── favorites.ts             # AsyncStorage favorites service
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Shared types and interfaces
└── __tests__/                    # Test files
    ├── api.test.ts              # API service tests
    └── favorites.test.ts        # Favorites service tests
```

## React Query Configuration and Usage

### Query Client Setup
The React Query client is configured in `lib/queryClient.ts` with the following settings:
- **Stale Time**: Infinity - data never expires during app session
- **Garbage Collection Time**: Infinity - cached data is kept in memory for the entire app session
- **Retry Logic**: Smart retry strategy that doesn't retry 4xx client errors
- **Retry Delay**: Exponential backoff with max delay of 30 seconds

### Query Keys Strategy
We use a hierarchical query key structure for better cache management:

```typescript
export const repositoryKeys = {
  all: ['repositories'] as const,
  searches: () => [...repositoryKeys.all, 'search'] as const,
  search: (params: SearchParams) => [...repositoryKeys.searches(), params] as const,
  details: () => [...repositoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...repositoryKeys.details(), id] as const,
  favorites: () => [...repositoryKeys.all, 'favorites'] as const,
};
```

### Data Fetching Patterns

1. **Infinite Queries**: Used for paginated repository lists with `useInfiniteQuery`
2. **Regular Queries**: Used for single repository details and favorites
3. **Optimistic Updates**: Implemented for favorites with rollback on failure
4. **Cache Invalidation**: Automatic invalidation when favorites change

### Caching Strategy
- **In-Memory Caching**: All data is cached in memory during app session
- **Query Deduplication**: Identical queries are automatically deduplicated
- **Background Refetching**: Data is refetched in the background when stale
- **Cache Persistence**: Favorites are persisted to AsyncStorage, repository data is not

## State Management

### Current Approach
- **React Query**: Handles server state (repositories, API data)
- **AsyncStorage**: Handles persistent local state (favorites)
- **React State**: Handles UI state (search queries, loading states)

### Data Flow
1. User interactions trigger React Query mutations
2. Optimistic updates provide immediate UI feedback
3. Server requests are made in the background
4. On success, cache is updated; on failure, optimistic changes are rolled back
5. All components using the same data automatically re-render

## Scaling Considerations

### As the Team Grows

#### 1. State Management
- **Current**: React Query + AsyncStorage + React State
- **Future**: Consider adding Zustand or Redux Toolkit for complex client state
- **Rationale**: React Query handles server state well, but complex UI state might need more structure

#### 2. Code Organization
- **Feature-Based Structure**: Move to feature-based folders (e.g., `features/repositories/`, `features/favorites/`)
- **Shared Components**: Create a more robust design system with Storybook
- **Custom Hooks**: Extract more business logic into custom hooks

#### 3. Testing Strategy
- **Unit Tests**: Expand coverage for all services and utilities
- **Integration Tests**: Add tests for React Query hooks and component interactions
- **E2E Tests**: Implement Detox for end-to-end testing
- **Visual Regression**: Add Chromatic or similar for UI testing

#### 4. Performance Optimization
- **Code Splitting**: Implement lazy loading for screens and components
- **Image Optimization**: Add proper image caching and optimization
- **Bundle Analysis**: Regular bundle size monitoring
- **Memory Management**: Implement proper cleanup for long-running queries

#### 5. Developer Experience
- **Linting & Formatting**: Add Prettier and stricter ESLint rules
- **Pre-commit Hooks**: Add Husky for automated checks
- **Type Safety**: Stricter TypeScript configuration
- **Documentation**: Add JSDoc comments and component documentation

#### 6. CI/CD Pipeline
- **Automated Testing**: Run tests on every PR
- **Code Quality**: Automated linting and type checking
- **Build Verification**: Test builds on multiple platforms
- **Deployment**: Automated app store deployments

#### 7. Monitoring & Analytics
- **Error Tracking**: Add Sentry or similar for crash reporting
- **Performance Monitoring**: Track app performance metrics
- **User Analytics**: Understand user behavior patterns
- **API Monitoring**: Track API response times and error rates

#### 8. Security Considerations
- **API Security**: Implement proper API key management
- **Data Validation**: Add runtime validation for API responses
- **Secure Storage**: Consider more secure storage for sensitive data
- **Network Security**: Implement certificate pinning for production

### Recommended Next Steps

1. **Immediate (1-2 weeks)**:
   - Add more comprehensive tests
   - Implement error boundaries
   - Add loading skeletons

2. **Short-term (1-2 months)**:
   - Refactor to feature-based structure
   - Add E2E tests
   - Implement proper error handling

3. **Medium-term (3-6 months)**:
   - Add state management library if needed
   - Implement offline support
   - Add performance monitoring

4. **Long-term (6+ months)**:
   - Consider micro-frontend architecture
   - Implement advanced caching strategies
   - Add real-time features if needed

## Tradeoffs and Assumptions

### Tradeoffs Made
1. **In-Memory Caching**: Chose simplicity over persistence for repository data
2. **GitHub API**: Used public API without authentication (rate limits apply)
3. **AsyncStorage**: Simple local storage instead of more complex database
4. **Expo Router**: Chose file-based routing for simplicity

### Assumptions
1. **Network Availability**: App assumes network connectivity for data fetching
2. **GitHub API Stability**: Relies on GitHub API being available and stable
3. **Device Storage**: Assumes sufficient local storage for favorites
4. **React Native Compatibility**: Assumes standard React Native features work across platforms

### Future Considerations
1. **Offline Support**: Could add offline-first architecture with background sync
2. **Real-time Updates**: Could add WebSocket support for live data
3. **Advanced Search**: Could implement more sophisticated search and filtering
4. **Social Features**: Could add user profiles and social interactions
