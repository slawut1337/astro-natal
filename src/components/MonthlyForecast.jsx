import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthForm from './BirthForm';
import TransitChart from './TransitChart';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export default function MonthlyForecast() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (userData && !isLoading) {
      console.log("Данные готовы к отображению:", { userData, isLoading });
      setIsDataReady(true);
    }
  }, [userData, isLoading]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    console.log("Получены данные формы:", data);

    setTimeout(() => {
      const currentDate = new Date();
      const month = currentDate.toLocaleString('ru-RU', { month: 'long' });
      
      const newUserData = {
        ...data,
        natal: {
          planets: {
            "Солнце": { longitude: 45 },
            "Луна": { longitude: 120 },
            "Меркурий": { longitude: 80 },
            "Венера": { longitude: 200 },
            "Марс": { longitude: 150 },
            "Юпитер": { longitude: 300 },
            "Сатурн": { longitude: 250 }
          }
        },
        transit: {
          planets: {
            "Солнце": { longitude: 75 },
            "Луна": { longitude: 180 },
            "Меркурий": { longitude: 95 },
            "Венера": { longitude: 210 },
            "Марс": { longitude: 45 },
            "Юпитер": { longitude: 315 },
            "Сатурн": { longitude: 255 }
          }
        },
        forecast: {
          month,
          phases: [
            { 
              date: "1-7 " + month,
              title: "Личное развитие",
              description: `${data.name}, это отличное время для самопознания и личностного роста. Транзитное Солнце активирует ваш натальный Юпитер.`,
              icon: "🌱"
            },
            {
              date: "8-14 " + month,
              title: "Карьера и финансы",
              description: "Благоприятный период для профессионального развития. Марс в гармоничном аспекте к вашему натальному Сатурну.",
              icon: "📈"
            },
            {
              date: "15-21 " + month,
              title: "Отношения",
              description: "Венера создает позитивные аспекты к вашей натальной карте. Хорошее время для укрепления связей.",
              icon: "❤️"
            },
            {
              date: "22-30 " + month,
              title: "Духовный рост",
              description: "Время для медитации и самоанализа. Луна активирует важные точки вашей натальной карты.",
              icon: "✨"
            }
          ],
          aspects: [
            {
              planet: "Юпитер",
              aspect: "трин",
              influence: "Расширение возможностей в сфере карьеры. Хорошее время для начала новых проектов.",
              icon: "♃"
            },
            {
              planet: "Венера",
              aspect: "секстиль",
              influence: "Гармония в личных отношениях. Возможны приятные знакомства или улучшение существующих связей.",
              icon: "♀️"
            },
            {
              planet: "Марс",
              aspect: "соединение",
              influence: "Повышенная энергичность и мотивация. Используйте это время для активных действий.",
              icon: "♂️"
            }
          ]
        }
      };

      console.log("Подготовленные данные:", newUserData);
      setUserData(newUserData);
      setIsLoading(false);
    }, 2000);
  };

  console.log("Рендеринг MonthlyForecast:", { userData, isLoading, isDataReady });

  if (!isDataReady) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 px-4 py-12"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Персональный прогноз на месяц
            </motion.h2>
            <motion.p 
              className="text-lg text-indigo-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Введите ваши данные для расчета индивидуального прогноза
            </motion.p>
          </div>
          <BirthForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 py-8 space-y-10"
      >
        <motion.div variants={item} className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Прогноз на {userData.forecast.month}
          </h2>
          <p className="text-indigo-200">
            Персональный астрологический прогноз для {userData.name}
          </p>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Фазы месяца</h3>
            <div className="space-y-6">
              {userData.forecast.phases.map((phase, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="flex items-start space-x-4"
                >
                  <div className="text-2xl">{phase.icon}</div>
                  <div>
                    <div className="text-sm text-indigo-200 mb-1">{phase.date}</div>
                    <h4 className="text-lg font-medium text-white mb-2">{phase.title}</h4>
                    <p className="text-indigo-100">{phase.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Важные аспекты</h3>
            <div className="space-y-6">
              {userData.forecast.aspects.map((aspect, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="flex items-start space-x-4"
                >
                  <div className="text-2xl">{aspect.icon}</div>
                  <div>
                    <div className="text-sm text-indigo-200 mb-1">
                      {aspect.planet} - {aspect.aspect}
                    </div>
                    <p className="text-indigo-100">{aspect.influence}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Транзитная карта</h3>
          <TransitChart natal={userData.natal} transit={userData.transit} />
        </motion.div>

        <motion.div 
          variants={item} 
          className="flex justify-center gap-4 pt-6"
        >
          <motion.button
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium border border-white/20 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log("Сброс данных");
              setUserData(null);
              setIsDataReady(false);
            }}
          >
            Новый расчет
          </motion.button>
          <motion.button
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Сохранить прогноз
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
} 