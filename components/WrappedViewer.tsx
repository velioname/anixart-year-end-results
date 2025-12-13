'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, CircularProgress, IconButton, Snackbar, Alert, LinearProgress, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { api, Profile, Release, HistoryItem, Collection } from '@/lib/api';
import { calculateHours, calculateDays, getTopReleaseFromHistory, getLastWatched, getDaysSinceRegistration, calculateAveragePerDay, getCurrentYear, filterByCurrentYear } from '@/lib/utils';
import WelcomeScreen from './screens/WelcomeScreen';
import TimeScreen from './screens/TimeScreen';
import ActivityScreen from './screens/ActivityScreen';
import TopReleaseScreen from './screens/TopReleaseScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import CollectionsScreen from './screens/CollectionsScreen';
import LastWatchedScreen from './screens/LastWatchedScreen';
import ProfileListScreen from './screens/ProfileListScreen';
import TopRatedScreen from './screens/TopRatedScreen';
import YearStatsScreen from './screens/YearStatsScreen';
import FinalScreen from './screens/FinalScreen';

interface WrappedViewerProps {
  onLogout: () => void;
  onOpenSettings: () => void;
}

export default function WrappedViewer({ onLogout, onOpenSettings }: WrappedViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [topRelease, setTopRelease] = useState<Release | null>(null);
  const [lastWatched, setLastWatched] = useState<HistoryItem | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [favorites, setFavorites] = useState<Release[]>([]);
  const [topRated, setTopRated] = useState<Release[]>([]);
  const [yearStats, setYearStats] = useState({
    watchedThisYear: 0,
    completedThisYear: 0,
    droppedThisYear: 0,
    favoritesAddedThisYear: 0,
    watchingThisYear: 0,
    planThisYear: 0,
    holdOnThisYear: 0,
    commentsThisYear: 0,
  });
  const [currentScreen, setCurrentScreen] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Навигация клавиатурой
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Игнорируем, если пользователь вводит текст
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentScreen((prev) => {
          if (prev > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return prev - 1;
          }
          return prev;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentScreen((prev) => {
          // Используем ref для получения актуального количества экранов
          const screenElements = document.querySelectorAll('[id^="screen-"]');
          if (prev < screenElements.length - 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return prev + 1;
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем профиль
      const profileData = await api.getProfile();
      setProfile(profileData);

      // Используем историю из профиля или загружаем отдельно
      let historyItems = profileData.history || [];
      
      // Если истории нет в профиле, загружаем отдельно
      if (historyItems.length === 0) {
        try {
          const historyData = await api.getHistory(1);
          historyItems = historyData.items || [];
        } catch {
          // Игнорируем ошибки истории
        }
      }

      if (historyItems.length > 0) {
        const top = getTopReleaseFromHistory(historyItems);
        if (top) {
          try {
            const releaseId = top.release?.id || top.id;
            if (releaseId) {
              const releaseData = await api.getRelease(releaseId);
              setTopRelease(releaseData);
            } else {
              // Используем данные из истории, если они есть
              const releaseData = top.release || top;
              if (releaseData.title_ru) {
                setTopRelease(releaseData as Release);
              }
            }
          } catch (err) {
            console.error('Ошибка загрузки топ релиза:', err);
            // Используем данные из истории, если они есть
            const releaseData = top.release || top;
            if (releaseData.title_ru) {
              setTopRelease(releaseData as Release);
            }
          }
        }

        const last = getLastWatched(historyItems);
        if (last) {
          setLastWatched(last);
        }
      }

      // Загружаем коллекции
      try {
        if (profileData.id) {
          const collectionsData = await api.getCollections(profileData.id, 1);
          if (collectionsData.items && collectionsData.items.length > 0) {
            setCollections(collectionsData.items);
          }
        }
      } catch {
        // Игнорируем ошибки коллекций
      }

      // Загружаем избранное
      try {
        const favoritesData = await api.getFavorites(1);
        if (favoritesData.items && favoritesData.items.length > 0) {
          setFavorites(favoritesData.items);
        }
      } catch {
        // Игнорируем ошибки избранного
      }

      // Загружаем оценки на 5 звезд
      try {
        if (profileData.votes && profileData.votes.length > 0) {
          const fiveStarVotes = profileData.votes.filter((vote: any) => vote.my_vote === 5);
          if (fiveStarVotes.length > 0) {
            // Сначала используем данные из votes, если они полные
            const releasesFromVotes: Release[] = fiveStarVotes
              .slice(0, 10)
              .map((vote: any) => ({
                id: vote.id,
                title_ru: vote.title_ru || 'Без названия',
                title_original: vote.title_original,
                poster: vote.poster,
                image: vote.image,
                genres: vote.genres,
                year: vote.year,
                description: vote.description,
                rating: vote.rating,
                grade: vote.grade,
              }))
              .filter((r: Release) => r.title_ru && r.title_ru !== 'Без названия');

            // Если в votes есть достаточно данных, используем их
            if (releasesFromVotes.length > 0 && releasesFromVotes[0].title_ru) {
              // Пытаемся загрузить дополнительную информацию для тех, у кого нет описания
              const releasesWithDetails = await Promise.allSettled(
                releasesFromVotes.map(async (release) => {
                  // Если уже есть описание и другие данные, возвращаем как есть
                  if (release.description && release.genres) {
                    return release;
                  }
                  // Иначе загружаем полную информацию
                  try {
                    const fullRelease = await api.getRelease(release.id);
                    return {
                      ...release,
                      ...fullRelease,
                      // Сохраняем данные из votes, если они есть
                      title_ru: release.title_ru || fullRelease.title_ru,
                      poster: release.poster || fullRelease.poster,
                      image: release.image || fullRelease.image,
                    };
                  } catch {
                    return release;
                  }
                })
              );

              const successfulReleases = releasesWithDetails
                .filter((r): r is PromiseFulfilledResult<Release> => r.status === 'fulfilled')
                .map(r => r.value);
              
              setTopRated(successfulReleases);
            } else {
              // Если данных в votes недостаточно, загружаем через API
              const releases = await Promise.allSettled(
                fiveStarVotes.slice(0, 10).map((vote: any) => api.getRelease(vote.id))
              );
              const successfulReleases = releases
                .filter((r): r is PromiseFulfilledResult<Release> => r.status === 'fulfilled')
                .map(r => r.value);
              setTopRated(successfulReleases);
            }
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки оценок:', err);
        // Игнорируем ошибки оценок
      }

      // Рассчитываем статистику за год
      try {
        const currentYear = getCurrentYear();
        const yearStart = new Date(currentYear, 0, 1).getTime() / 1000;
        const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59).getTime() / 1000;

        // Фильтруем историю за год
        const historyThisYear = historyItems.filter((item: any) => {
          const timestamp = item.last_view_timestamp;
          return timestamp && timestamp >= yearStart && timestamp <= yearEnd;
        });

        // Фильтруем votes за год
        const votesThisYear = profileData.votes?.filter((vote: any) => {
          const timestamp = vote.voted_at;
          return timestamp && timestamp >= yearStart && timestamp <= yearEnd;
        }) || [];

        // Загружаем списки профиля за год
        let watchingThisYear = 0;
        let planThisYear = 0;
        let completedThisYear = 0;
        let holdOnThisYear = 0;
        let droppedThisYear = 0;

        try {
          // Загружаем все типы списков
          const [watchingList, planList, completedList, holdOnList, droppedList] = await Promise.allSettled([
            api.getProfileList(1, 1), // watching
            api.getProfileList(2, 1), // plan
            api.getProfileList(3, 1), // completed
            api.getProfileList(4, 1), // hold_on
            api.getProfileList(5, 1), // dropped
          ]);

          // Фильтруем по году (если есть timestamp в данных)
          if (watchingList.status === 'fulfilled' && watchingList.value.items) {
            watchingThisYear = watchingList.value.items.length; // Упрощенный подсчет
          }
          if (planList.status === 'fulfilled' && planList.value.items) {
            planThisYear = planList.value.items.length;
          }
          if (completedList.status === 'fulfilled' && completedList.value.items) {
            completedThisYear = completedList.value.items.length;
          }
          if (holdOnList.status === 'fulfilled' && holdOnList.value.items) {
            holdOnThisYear = holdOnList.value.items.length;
          }
          if (droppedList.status === 'fulfilled' && droppedList.value.items) {
            droppedThisYear = droppedList.value.items.length;
          }
        } catch {
          // Используем данные из профиля как fallback
          watchingThisYear = (profileData as any).watching_count || 0;
          planThisYear = (profileData as any).plan_count || 0;
          completedThisYear = profileData.completed_count || 0;
          holdOnThisYear = (profileData as any).hold_on_count || 0;
          droppedThisYear = (profileData as any).dropped_count || 0;
        }

        // Фильтруем избранное за год (если есть timestamp)
        let favoritesAddedThisYear = 0;
        if (favorites.length > 0) {
          // Упрощенный подсчет - используем общее количество
          favoritesAddedThisYear = favorites.length;
        }

        // Комментарии за год (используем общее количество как приближение)
        const commentsThisYear = profileData.comment_count || 0;

        setYearStats({
          watchedThisYear: historyThisYear.length,
          completedThisYear,
          droppedThisYear,
          favoritesAddedThisYear,
          watchingThisYear,
          planThisYear,
          holdOnThisYear,
          commentsThisYear,
        });
      } catch (err) {
        console.error('Ошибка расчета статистики за год:', err);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
      // Прокрутка вверх при переходе
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
      // Прокрутка вверх при переходе
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 3,
          px: 3,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Загрузка твоих итогов года...
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
        </Box>
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <Alert severity="error">{error || 'Профиль не найден'}</Alert>
        <Button onClick={onLogout}>Выйти</Button>
      </Box>
    );
  }

  const hours = calculateHours(profile.watched_time);
  const days = calculateDays(profile.watched_time);
  const daysSinceRegistration = getDaysSinceRegistration(profile.register_date);
  const averagePerDay = calculateAveragePerDay(profile.watched_time, daysSinceRegistration);

  const screens = [
    <WelcomeScreen key="welcome" login={profile.login} avatar={profile.avatar} />,
    <TimeScreen key="time" hours={hours} days={days} averagePerDay={averagePerDay} watchedTime={profile.watched_time} />,
    <ActivityScreen
      key="activity"
      watchedEpisodes={profile.watched_episode_count}
      completedCount={profile.completed_count}
      favoriteCount={profile.favorite_count}
      friendCount={profile.friend_count}
      commentCount={profile.comment_count}
      watchingCount={(profile as any).watching_count}
      planCount={(profile as any).plan_count}
    />,
    topRelease ? (
      <TopReleaseScreen key="top-release" release={topRelease} />
    ) : (
      <Box key="top-release-fallback" sx={{ textAlign: 'center', p: 4 }}>
        <Typography>Нет данных о топ релизе</Typography>
      </Box>
    ),
    <PreferencesScreen
      key="preferences"
      genres={profile.preferred_genres}
      audiences={profile.preferred_audiences}
      themes={profile.preferred_themes}
    />,
    <CollectionsScreen
      key="collections"
      collectionCount={collections.length}
      topCollection={collections[0] ? { title: collections[0].title, description: collections[0].description } : undefined}
    />,
    lastWatched ? (
      <LastWatchedScreen
        key="last-watched"
        release={{
          title_ru: lastWatched.title_ru,
          title_original: lastWatched.title_original,
          poster: lastWatched.poster,
          image: lastWatched.image,
          year: lastWatched.year,
        }}
        episode={lastWatched.last_view_episode?.position}
        episodeName={lastWatched.last_view_episode?.name}
        watchedAt={lastWatched.last_view_timestamp}
      />
    ) : (
      <Box key="last-watched-fallback" sx={{ textAlign: 'center', p: 4 }}>
        <Typography>Нет данных о последнем просмотре</Typography>
      </Box>
    ),
    favorites.length > 0 ? (
      <ProfileListScreen
        key="favorites"
        releases={favorites}
        title="В избранном"
        description="Тайтлы, которые ты добавил в избранное"
      />
    ) : null,
    topRated.length > 0 ? (
      <TopRatedScreen key="top-rated" releases={topRated} />
    ) : null,
    <YearStatsScreen
      key="year-stats"
      watchedThisYear={yearStats.watchedThisYear}
      completedThisYear={yearStats.completedThisYear}
      droppedThisYear={yearStats.droppedThisYear}
      favoritesAddedThisYear={yearStats.favoritesAddedThisYear}
      watchingThisYear={yearStats.watchingThisYear}
      planThisYear={yearStats.planThisYear}
      holdOnThisYear={yearStats.holdOnThisYear}
      commentsThisYear={yearStats.commentsThisYear}
    />,
    <FinalScreen key="final" />,
  ].filter(Boolean); // Удаляем null экраны

  const totalScreens = screens.length;
  const progress = ((currentScreen + 1) / totalScreens) * 100;

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: { xs: '70px', sm: '80px', md: '100px' } }}>
      {/* Индикатор прогресса сверху */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          zIndex: 1100,
          backgroundColor: 'background.paper',
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            },
          }}
        />
      </Box>

      {/* Счетчик экранов */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          px: 2,
          py: 1,
          boxShadow: 2,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {currentScreen + 1} / {totalScreens}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton 
          onClick={onOpenSettings} 
          color="inherit"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
          title="Настройки"
        >
          <SettingsIcon />
        </IconButton>
        <IconButton 
          onClick={onLogout} 
          color="inherit"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
          title="Выйти"
        >
          <LogoutIcon />
        </IconButton>
      </Box>

      <Box ref={exportRef}>
        {screens.map((screen, index) => (
          <Box
            key={index}
            id={`screen-${index}`}
            className="export-screen"
            data-screen-index={index}
            sx={{
              display: index === currentScreen ? 'block' : 'none',
              width: { xs: '100%', md: '1080px' },
              height: { xs: 'auto', md: '1920px' },
              minHeight: { xs: '100vh', md: '1920px' },
              margin: '0 auto',
              position: 'relative',
              backgroundColor: 'background.default',
              '@media print': {
                display: 'block',
              },
            }}
          >
            {screen}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 100, sm: 110, md: 120 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          zIndex: 1000,
          maxWidth: '90%',
          pb: 1,
        }}
      >
        {/* Подсказка о навигации */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.75rem',
            display: { xs: 'none', md: 'block' },
            opacity: 0.7,
          }}
        >
          Используй ← → для навигации
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={handlePrev}
            disabled={currentScreen === 0}
            sx={{
              borderRadius: '24px',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minWidth: { xs: '80px', sm: '100px' },
              transition: 'all 0.3s ease',
              '&:hover:not(:disabled)': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
            }}
          >
            ← Назад
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={currentScreen === screens.length - 1}
            sx={{
              borderRadius: '24px',
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              textTransform: 'none',
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minWidth: { xs: '80px', sm: '100px' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              transition: 'all 0.3s ease',
              '&:hover:not(:disabled)': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
            }}
          >
            Далее →
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarMessage.includes('Ошибка') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

