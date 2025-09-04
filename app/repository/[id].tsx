import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useRepository } from '@/hooks/useRepositories';

export default function RepositoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const repositoryId = parseInt(id || '0', 10);

  const {
    data: repository,
    isLoading,
    isError,
    error,
  } = useRepository(repositoryId);

  const toggleFavorite = useToggleFavorite();
  const isFavorite = useIsFavorite(repositoryId);

  const handleFavoritePress = useCallback(() => {
    toggleFavorite.mutate({
      repositoryId,
      isFavorite,
    });
  }, [toggleFavorite, repositoryId, isFavorite]);

  const handleOpenInBrowser = useCallback(() => {
    if (repository?.html_url) {
      Linking.openURL(repository.html_url);
    }
  }, [repository?.html_url]);

  const handleOwnerPress = useCallback(() => {
    if (repository?.owner.html_url) {
      Linking.openURL(repository.owner.html_url);
    }
  }, [repository?.owner.html_url]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText style={styles.loadingText}>Loading repository...</ThemedText>
      </ThemedView>
    );
  }

  if (isError || !repository) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText type="subtitle" style={styles.errorTitle}>Repository not found</ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error instanceof Error ? error.message : 'The repository could not be loaded'}
        </ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>
              {repository.name}
            </ThemedText>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleFavoritePress}
              disabled={toggleFavorite.isPending}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? '#ff6b6b' : Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.ownerContainer}
            onPress={handleOwnerPress}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: repository.owner.avatar_url }}
              style={styles.avatar}
            />
            <ThemedText style={styles.ownerName}>
              {repository.owner.login}
            </ThemedText>
            <Ionicons
              name="open-outline"
              size={16}
              color={Colors[colorScheme ?? 'light'].tint}
            />
          </TouchableOpacity>

          {repository.description && (
            <ThemedText style={styles.description}>
              {repository.description}
            </ThemedText>
          )}
        </ThemedView>

        {/* Stats */}
        <ThemedView style={styles.statsContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Statistics</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color={Colors[colorScheme ?? 'light'].tint} />
              <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                {repository.stargazers_count.toLocaleString()}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Stars</ThemedText>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="git-branch" size={24} color={Colors[colorScheme ?? 'light'].tint} />
              <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                {repository.forks_count.toLocaleString()}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Forks</ThemedText>
            </View>

            {repository.language && (
              <View style={styles.statCard}>
                <Ionicons name="code-slash" size={24} color={Colors[colorScheme ?? 'light'].tint} />
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                  {repository.language}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Language</ThemedText>
              </View>
            )}
          </View>
        </ThemedView>

        {/* Repository Info */}
        <ThemedView style={styles.infoContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Repository Info</ThemedText>
          
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Full Name</ThemedText>
            <ThemedText style={styles.infoValue}>{repository.full_name}</ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Created</ThemedText>
            <ThemedText style={styles.infoValue}>
              {new Date(repository.created_at).toLocaleDateString()}
            </ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Last Updated</ThemedText>
            <ThemedText style={styles.infoValue}>
              {new Date(repository.updated_at).toLocaleDateString()}
            </ThemedText>
          </View>
        </ThemedView>

        {/* Actions */}
        <ThemedView style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={handleOpenInBrowser}
          >
            <Ionicons name="open-outline" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Open in GitHub</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  favoriteButton: {
    padding: 8,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  ownerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  statsContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
