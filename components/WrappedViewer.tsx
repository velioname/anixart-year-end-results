'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, CircularProgress, IconButton, Snackbar, Alert, LinearProgress, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { Anixart, BookmarkSortType, BookmarkType, IProfile, IRelease, IVoteRelease, ICollection } from 'anixartjs';
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
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [topRelease, setTopRelease] = useState<IRelease | null>(null);
  const [lastWatched, setLastWatched] = useState<IRelease | null>(null);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [favorites, setFavorites] = useState<IRelease[]>([]);
  const [topRated, setTopRated] = useState<IRelease[] | IVoteRelease[]>([]);
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

      const API = new Anixart({
        token: sessionStorage.getItem('anixart_token') ?? ""
      });

      // Загружаем профиль
      const profileData = (await API.endpoints.profile.info(Number(sessionStorage.getItem("anixart_profile_id")) ?? 0)).profile;
      setProfile(profileData);

      // Используем историю из профиля или загружаем отдельно
      let historyItems: IRelease[] = [];
      let historyTotal = (await API.endpoints.release.getHistory(0)).total_count;

      // Проходимся циклом по истории
      for (let i = 0; i < Math.floor(historyTotal / 25); i++) {
        let historyData = await API.endpoints.release.getHistory(i);

        // Проверяем все ли элементы относятся не к текущему году
        if (!historyData.content.every(x => (
          new Date(x.last_view_timestamp * 1000).getFullYear() != new Date().getFullYear()
        ))) {
          // Если да, то заносим в массив
          historyItems = historyItems.concat(historyData.content || []);
        } else break;
      }

      let releaseVotes: IVoteRelease[] = [];
      let releaseVotesTotal = (await API.endpoints.profile.getVotedReleases(profileData.id, 0)).total_count;

      for (let i = 0; i < Math.floor(releaseVotesTotal / 25); i++) {
        let releaseVotesData = await API.endpoints.profile.getVotedReleases(profileData.id, i, BookmarkSortType.NewToOldAddTime);

        if (!releaseVotesData.content.every(x => (
          new Date(x.voted_at * 1000).getFullYear() != new Date().getFullYear()
        ))) {
          releaseVotes = releaseVotes.concat(releaseVotesData.content || []);
        } else break;
      }

      if (historyItems.length > 0) {
        const top = getTopReleaseFromHistory(historyItems);
        if (top) {
          console.log(top);
          try {
            const releaseId = top.release?.id || top.id;
            if (releaseId) {
              const releaseData = (await API.endpoints.release.info(releaseId)).release;
              setTopRelease(releaseData);
            } else {
              // Используем данные из истории, если они есть
              const releaseData = top.release || top;
              if (releaseData.title_ru) {
                setTopRelease(releaseData);
              }
            }
          } catch (err) {
            console.error('Ошибка загрузки топ релиза:', err);
            // Используем данные из истории, если они есть
            const releaseData = top.release || top;
            if (releaseData.title_ru) {
              setTopRelease(releaseData as IRelease);
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
          const collectionsData = await API.endpoints.collection.getUserCollections(profileData.id, 0);
          if (collectionsData.content && collectionsData.content.length > 0) {
            setCollections(collectionsData.content);
          }
        }
      } catch {
        // Игнорируем ошибки коллекций
      }

      // Загружаем избранное
      try {

        const favoritesData = await API.endpoints.profile.getFavorites({
          page: 0,
          sort: BookmarkSortType.NewToOldAddTime,
          filter_announce: 0
        });
        if (favoritesData.content && favoritesData.content.length > 0) {
          setFavorites(favoritesData.content);
        }
      } catch {
        // Игнорируем ошибки избранного
      }

      // Загружаем оценки на 5 звезд
      try {
        if (releaseVotes && releaseVotes.length > 0) {
          const fiveStarVotes = releaseVotes.filter(vote => vote.my_vote === 5);
          if (fiveStarVotes.length > 0) {
            // Сначала используем данные из votes, если они полные
            const releasesFromVotes: IVoteRelease[] = fiveStarVotes
              .slice(0, 10)
              .filter((r: IVoteRelease) => r.title_ru && r.title_ru !== '');

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
                    const fullRelease = (await API.endpoints.release.info(release.id)).release;
                    return {
                      ...release,
                      ...fullRelease,
                      // Сохраняем данные из votes, если они есть
                      title_ru: release.title_ru || fullRelease.title_ru,
                      image: release.image || fullRelease.image,
                    };
                  } catch {
                    return release;
                  }
                })
              );

              const successfulReleases = releasesWithDetails
                .filter((r): r is PromiseFulfilledResult<IVoteRelease> => r.status === 'fulfilled')
                .map(r => r.value)
                .filter((r) => new Date(r.voted_at * 1000).getFullYear() != new Date().getFullYear());
              
              setTopRated(successfulReleases);
            } else {
              // Если данных в votes недостаточно, загружаем через API
              const releases = await Promise.allSettled(
                fiveStarVotes.slice(0, 10).map(async (vote) => (await API.endpoints.release.info(vote.id)).release)
              );
              const successfulReleases = releases
                .filter((r): r is PromiseFulfilledResult<IRelease> => r.status === 'fulfilled')
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
        const votesThisYear = releaseVotes.filter((vote) => {
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
            API.endpoints.profile.getBookmarks({
              type: BookmarkType.Watching,
              page: 0,
              sort: BookmarkSortType.NewToOldAddTime,
              id: profileData.id,
              filter_announce: 0
            }),

            API.endpoints.profile.getBookmarks({
              type: BookmarkType.InPlans,
              page: 0,
              sort: BookmarkSortType.NewToOldAddTime,
              id: profileData.id,
              filter_announce: 0
            }),

            API.endpoints.profile.getBookmarks({
              type: BookmarkType.Completed,
              page: 0,
              sort: BookmarkSortType.NewToOldAddTime,
              id: profileData.id,
              filter_announce: 0
            }),

            API.endpoints.profile.getBookmarks({
              type: BookmarkType.HoldOn,
              page: 0,
              sort: BookmarkSortType.NewToOldAddTime,
              id: profileData.id,
              filter_announce: 0
            }),

            API.endpoints.profile.getBookmarks({
              type: BookmarkType.Dropped,
              page: 0,
              sort: BookmarkSortType.NewToOldAddTime,
              id: profileData.id,
              filter_announce: 0
            })
          ]);

          // Фильтруем по году (если есть timestamp в данных)
          if (watchingList.status === 'fulfilled' && watchingList.value.content) {
            watchingThisYear = watchingList.value.content.length; // Упрощенный подсчет
          }
          if (planList.status === 'fulfilled' && planList.value.content) {
            planThisYear = planList.value.content.length;
          }
          if (completedList.status === 'fulfilled' && completedList.value.content) {
            completedThisYear = completedList.value.content.length;
          }
          if (holdOnList.status === 'fulfilled' && holdOnList.value.content) {
            holdOnThisYear = holdOnList.value.content.length;
          }
          if (droppedList.status === 'fulfilled' && droppedList.value.content) {
            droppedThisYear = droppedList.value.content.length;
          }
        } catch {
          // Используем данные из профиля как fallback
          watchingThisYear = profileData.watching_count || 0;
          planThisYear = profileData.plan_count || 0;
          completedThisYear = profileData.completed_count || 0;
          holdOnThisYear = profileData.hold_on_count || 0;
          droppedThisYear = profileData.dropped_count || 0;
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

