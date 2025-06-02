import { useState, useRef, useEffect } from "react";
import BirthForm from "../components/BirthForm";
import { getCoordinatesByCity } from "../api/geocode";
import { getTimezoneByCoords } from "../api/timezone";
import { calculatePlanets } from "../utils/calculatePlanets";
import { motion, AnimatePresence } from "framer-motion";
import NatalChart from "../components/NatalChart";
import DetailedInterpretation from "../components/DetailedInterpretation";

export default function Home() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef(null);

  // Эффект для прокрутки к результатам
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [result]);

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError("");

      console.log('Form data:', formData); // Отладочный вывод

      // Проверяем и форматируем дату
      if (!formData.birthDate || !formData.birthTime) {
        throw new Error('Необходимо указать дату и время рождения');
      }

      const coords = await getCoordinatesByCity(formData.birthPlace);
      console.log('Coordinates:', coords); // Отладочный вывод

      const timezoneData = await getTimezoneByCoords(coords.latitude, coords.longitude);
      console.log('Timezone data:', timezoneData); // Отладочный вывод

      // Форматируем данные для расчета
      const calculationData = {
        date: formData.birthDate,
        time: formData.birthTime,
        latitude: Number(coords.latitude),
        longitude: Number(coords.longitude),
      };

      console.log('Calculation data:', calculationData); // Отладочный вывод

      const planetData = await calculatePlanets(calculationData);
      console.log('Planet data:', planetData); // Отладочный вывод
      
      const combined = {
        ...formData,
        ...coords,
        ...timezoneData,
        ...planetData
      };

      console.log('Combined result:', combined); // Отладочный вывод

      setResult(combined);
    } catch (err) {
      console.error('Error in form submission:', err); // Отладочный вывод
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  function getPlanetEmoji(name) {
    const icons = {
      Солнце: "☀️",
      Луна: "🌙",
      Меркурий: "☿️",
      Венера: "♀️",
      Марс: "♂️",
      Юпитер: "♃",
      Сатурн: "♄",
      Уран: "♅",
      Нептун: "♆",
      Плутон: "♇",
    };
    return icons[name] || "✨";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-200/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Шапка */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-8 sm:py-12 text-center"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900 mb-4 sm:mb-6 leading-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            Натальная карта
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-indigo-700/70 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Раскройте тайны своей судьбы через положение звезд в момент вашего рождения
          </motion.p>
        </motion.header>

        {/* Основной контент */}
        <main className="container mx-auto px-4 pb-12 sm:pb-16">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            {/* Форма */}
            <div className="w-full max-w-md mx-auto">
              <BirthForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              
              <AnimatePresence>
              {error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 p-4 sm:p-6 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl sm:rounded-2xl"
                >
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl">⚠️</span>
                      <div>
                        <h4 className="font-semibold text-red-900">Произошла ошибка</h4>
                        <p className="text-sm sm:text-base text-red-700">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            {/* Результаты */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  ref={resultRef}
                  key="results"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="bg-white/30 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl border border-white/20 scroll-mt-4 sm:scroll-mt-8"
                >
                    <NatalChart data={result} />
                  <div className="mt-8 sm:mt-12">
                    <DetailedInterpretation data={result} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Подвал */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="container mx-auto px-4 py-6 sm:py-8 mt-8 sm:mt-12 border-t border-indigo-100"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-indigo-600/70">
            <p className="text-sm sm:text-base text-center sm:text-left">© 2024 Натальная карта. Все права защищены.</p>
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6 text-sm sm:text-base">
              <a href="#" className="hover:text-indigo-900 transition-colors px-2 py-1">О проекте</a>
              <a href="#" className="hover:text-indigo-900 transition-colors px-2 py-1">Конфиденциальность</a>
              <a href="#" className="hover:text-indigo-900 transition-colors px-2 py-1">Контакты</a>
          </div>
        </div>
        </motion.footer>
      </div>
    </div>
  );
}
