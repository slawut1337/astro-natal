import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthForm from './components/BirthForm';
import NatalChart from './components/NatalChart';
import PersonalityInterpretation from './components/PersonalityInterpretation';
import DetailedInterpretation from './components/DetailedInterpretation';
import MonthlyForecast from './components/MonthlyForecast';
import Compatibility from './components/Compatibility';
import TabNavigation from './components/TabNavigation';

// Добавим отладочную информацию
console.log("App компонент инициализирован");

export default function App() {
  const [birthData, setBirthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('natal');

  // Отладочная информация
  console.log("Текущая вкладка:", activeTab);
  console.log("Данные рождения:", birthData);
  console.log("Состояние загрузки:", isLoading);

  const handleSubmit = async (data) => {
    console.log("Получены данные формы в App:", data);
    setIsLoading(true);
    
    setTimeout(() => {
      setBirthData({
        name: data.name,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        planets: {
          "Солнце": { longitude: 45 },
          "Луна": { longitude: 120 },
          "Меркурий": { longitude: 80 },
          "Венера": { longitude: 200 },
          "Марс": { longitude: 150 },
          "Юпитер": { longitude: 300 },
          "Сатурн": { longitude: 250 }
        },
        aspects: [
          { planet1: "Солнце", planet2: "Луна", aspect: "соединение" },
          { planet1: "Венера", planet2: "Марс", aspect: "трин" },
          { planet1: "Меркурий", planet2: "Юпитер", aspect: "квадрат" },
          { planet1: "Марс", planet2: "Сатурн", aspect: "оппозиция" }
        ]
      });
      setIsLoading(false);
    }, 2000);
  };

  const renderContent = () => {
    console.log("Рендеринг контента для вкладки:", activeTab); // Отладочная информация

    if (activeTab === 'natal') {
      return birthData ? (
        <div className="space-y-12">
          <NatalChart data={birthData} />
          <PersonalityInterpretation data={birthData} />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <BirthForm onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.div>
      );
    }
    
    if (activeTab === 'forecast') {
      return <MonthlyForecast />;
    }
    
    if (activeTab === 'compatibility') {
      return <Compatibility />;
    }

    if (activeTab === 'learning') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto px-4 py-8 text-center"
        >
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            Скоро здесь появятся уроки астрологии
          </h2>
          <p className="text-indigo-600/70">
            Мы готовим для вас интересные материалы по изучению астрологии
          </p>
        </motion.div>
      );
    }

    if (activeTab === 'blog') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto px-4 py-8 text-center"
        >
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            Блог в разработке
          </h2>
          <p className="text-indigo-600/70">
            Скоро здесь появятся интересные статьи об астрологии
          </p>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Астрологический портал
          </motion.h1>
          <motion.p
            className="text-lg text-indigo-600/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Исследуйте тайны звезд и познайте себя
          </motion.p>
        </div>

        {/* Навигация */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Контент */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
