import { useEffect, useState } from 'react';
import { achievementService } from '../services/gameArcadeAPI';
import { Loading } from '../components/Common';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export const AchievementsPage = () => {
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allResponse = await achievementService.getAllAchievements();
        setAllAchievements(allResponse.data);

        if (user) {
          const userResponse = await achievementService.getUserAchievements();
          setUserAchievements(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <Loading />;

  const unlockedIds = new Set(userAchievements.map((a) => a.id));
  const unlockedCount = userAchievements.length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Achievements</h1>
        <p className="text-center text-gray-400 mb-12">
          {unlockedCount} of {allAchievements.length} unlocked
        </p>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-gray-700 rounded-full h-3 mb-12 overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / allAchievements.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-gradient-to-r from-primary to-secondary h-full"
          />
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {allAchievements.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            const userAchievement = userAchievements.find((a) => a.id === achievement.id);

            return (
              <motion.div key={achievement.id} variants={item}>
                <div
                  className={`card h-full transition ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/50'
                      : 'opacity-60 grayscale'
                  }`}
                >
                  <div className="mb-4 text-5xl">{achievement.icon || '🏆'}</div>
                  <h3 className="text-lg font-bold mb-2">{achievement.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

                  <div className="flex items-center justify-between">
                    {isUnlocked ? (
                      <>
                        <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                          Unlocked
                        </span>
                        {userAchievement && (
                          <span className="text-xs text-gray-400">
                            {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs bg-gray-700 text-gray-400 px-3 py-1 rounded-full">
                        Locked
                      </span>
                    )}
                    {achievement.reward > 0 && (
                      <span className="text-sm font-bold text-secondary">
                        +{achievement.reward} pts
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
