import AsyncStorage from '@react-native-async-storage/async-storage';
import { favoritesService } from '../services/favorites';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Favorites Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFavorites', () => {
    it('should return empty array when no favorites exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await favoritesService.getFavorites();

      expect(result).toEqual([]);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('favorite_repositories');
    });

    it('should return favorite IDs when favorites exist', async () => {
      const mockFavorites = [
        { id: 1, addedAt: '2023-01-01T00:00:00Z' },
        { id: 2, addedAt: '2023-01-02T00:00:00Z' },
      ];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockFavorites));

      const result = await favoritesService.getFavorites();

      expect(result).toEqual([1, 2]);
    });

    it('should handle JSON parse errors', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce('invalid json');

      const result = await favoritesService.getFavorites();

      expect(result).toEqual([]);
    });
  });

  describe('addFavorite', () => {
    it('should add a new favorite', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce('[]');

      await favoritesService.addFavorite(1);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'favorite_repositories',
        expect.stringContaining('"id":1')
      );
    });

    it('should not add duplicate favorites', async () => {
      const existingFavorites = [{ id: 1, addedAt: '2023-01-01T00:00:00Z' }];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingFavorites));

      await favoritesService.addFavorite(1);

      expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite', async () => {
      const existingFavorites = [
        { id: 1, addedAt: '2023-01-01T00:00:00Z' },
        { id: 2, addedAt: '2023-01-02T00:00:00Z' },
      ];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existingFavorites));

      await favoritesService.removeFavorite(1);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'favorite_repositories',
        JSON.stringify([{ id: 2, addedAt: '2023-01-02T00:00:00Z' }])
      );
    });
  });

  describe('isFavorite', () => {
    it('should return true when repository is favorited', async () => {
      const existingFavorites = [1, 2, 3];
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([
        { id: 1, addedAt: '2023-01-01T00:00:00Z' },
        { id: 2, addedAt: '2023-01-02T00:00:00Z' },
        { id: 3, addedAt: '2023-01-03T00:00:00Z' },
      ]));

      const result = await favoritesService.isFavorite(2);

      expect(result).toBe(true);
    });

    it('should return false when repository is not favorited', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([
        { id: 1, addedAt: '2023-01-01T00:00:00Z' },
        { id: 2, addedAt: '2023-01-02T00:00:00Z' },
      ]));

      const result = await favoritesService.isFavorite(3);

      expect(result).toBe(false);
    });
  });
});
