import { useState } from "react";
import BirthForm from "../components/BirthForm";
import { getCoordinatesByCity } from "../api/geocode";
import { getTimezoneByCoords } from "../api/timezone";
import { calculatePlanets } from "../utils/calculatePlanets";
import { motion, AnimatePresence } from "framer-motion";
import NatalChart from "../components/NatalChart";

export default function Home() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError("");

      const coords = await getCoordinatesByCity(formData.birthPlace);
      const timezoneData = await getTimezoneByCoords(coords.latitude, coords.longitude);
      const planetData = await calculatePlanets({
        date: formData.birthDate,
        time: formData.birthTime,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      
      const combined = {
        ...formData,
        ...coords,
        ...timezoneData,
        ...planetData
      };

      setResult(combined);
    } catch (err) {
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
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
            🌟 Натальная Карта
          </h1>
          <p className="text-indigo-600/70 text-lg max-w-2xl mx-auto">
            Узнайте расположение планет в момент вашего рождения и раскройте тайны своей судьбы
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <BirthForm onSubmit={handleFormSubmit} />
          </div>

          <div>
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center p-12"
                >
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">⚠️</div>
                    <div className="ml-3">
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {result && !isLoading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-8 border border-indigo-100"
                >
                  <div className="relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-300 opacity-20 rounded-full filter blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-300 opacity-20 rounded-full filter blur-3xl"></div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-indigo-800 text-center">
                        Натальная карта для {result.name}
                      </h3>
                      <p className="text-center text-indigo-600/70 mt-2">
                        {new Date(result.birthDate).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                        {' '}в{' '}
                        {result.birthTime}
                      </p>
                    </div>

                    <NatalChart data={result} />

                    <div className="mt-8 pt-6 border-t border-indigo-100">
                      <h4 className="text-sm font-semibold mb-2 text-gray-500">
                        📍 Координаты места рождения
                      </h4>
                      <p className="text-sm text-gray-600">
                        {result.birthPlace} ({result.latitude.toFixed(4)}°, {result.longitude.toFixed(4)}°)
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Часовой пояс: {result.timezone}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
