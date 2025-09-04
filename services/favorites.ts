import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorite_repositories';

export interface FavoriteRepository {
  id: number;
  addedAt: string;
}

export class FavoritesService {
  async getFavorites(): Promise<number[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        const parsed: FavoriteRepository[] = JSON.parse(favorites);
        return parsed.map(fav => fav.id);
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  async getFavoritesWithMetadata(): Promise<FavoriteRepository[]> {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        return JSON.parse(favorites);
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites with metadata:', error);
      return [];
    }
  }

  async addFavorite(repositoryId: number): Promise<void> {
    try {
      const favorites = await this.getFavoritesWithMetadata();
      const exists = favorites.some(fav => fav.id === repositoryId);
      
      if (!exists) {
        const newFavorite: FavoriteRepository = {
          id: repositoryId,
          addedAt: new Date().toISOString(),
        };
        favorites.push(newFavorite);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(repositoryId: number): Promise<void> {
    try {
      const favorites = await this.getFavoritesWithMetadata();
      const filtered = favorites.filter(fav => fav.id !== repositoryId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async isFavorite(repositoryId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.includes(repositoryId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }
}

export const favoritesService = new FavoritesService();
