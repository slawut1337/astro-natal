import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BirthForm from './BirthForm';

const compatibilityAreas = [
  {
    title: "Эмоциональная связь",
    icon: "❤️",
    description: "Анализ совместимости Луны и Венеры показывает глубину эмоциональной связи между партнерами."
  },
  {
    title: "Интеллектуальная совместимость",
    icon: "🧠",
    description: "Взаимодействие Меркурия определяет качество общения и взаимопонимания."
  },
  {
    title: "Физическое притяжение",
    icon: "✨",
    description: "Аспекты Марса и Венеры указывают на силу физического притяжения между партнерами."
  },
  {
    title: "Долгосрочные перспективы",
    icon: "🎯",
    description: "Положение Сатурна и Юпитера показывает потенциал для длительных отношений."
  }
];

export default function Compatibility() {
  const [step, setStep] = useState(1);
  const [partner1Data, setPartner1Data] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFirstPartnerSubmit = (data) => {
    setPartner1Data(data);
    setStep(2);
  };

  const handleSecondPartnerSubmit = (data) => {
    setIsLoading(true);
    // Здесь будет логика расчета совместимости
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8 space-y-10"
    >
      <div className="text-center">
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900 mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Проверка астрологической совместимости
        </motion.h2>
        <motion.p 
          className="text-indigo-600/70 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Узнайте, насколько хорошо вы подходите друг другу на основе положения планет
        </motion.p>
      </div>

      {/* Прогресс */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((number) => (
            <div key={number} className="flex items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= number
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'bg-white/10 text-indigo-900'
                }`}
                animate={{
                  scale: step === number ? 1.1 : 1,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                {number}
              </motion.div>
              {number < 3 && (
                <div className={`w-24 sm:w-32 h-1 mx-2 rounded ${
                  step > number ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Шаг 1: Данные первого партнера */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-semibold text-indigo-900 mb-6 text-center">
              Введите данные первого партнера
            </h3>
            <BirthForm onSubmit={handleFirstPartnerSubmit} isLoading={isLoading} />
          </motion.div>
        )}

        {/* Шаг 2: Данные второго партнера */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-semibold text-indigo-900 mb-6 text-center">
              Введите данные второго партнера
            </h3>
            <BirthForm onSubmit={handleSecondPartnerSubmit} isLoading={isLoading} />
          </motion.div>
        )}

        {/* Шаг 3: Результаты */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Общая совместимость */}
            <div className="text-center">
              <div className="inline-block mb-4">
                <div className="relative">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-white/10"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-indigo-500"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                      strokeDasharray="350"
                      strokeDashoffset="87.5"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <p className="text-4xl font-bold text-indigo-900">75%</p>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-2">Отличная совместимость!</h3>
              <p className="text-indigo-600/70">У вас высокий потенциал для гармоничных отношений</p>
            </div>

            {/* Области совместимости */}
            <div className="grid sm:grid-cols-2 gap-6">
              {compatibilityAreas.map((area, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{area.icon}</span>
                    <h4 className="font-medium text-indigo-900">{area.title}</h4>
                  </div>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    {area.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Рекомендации */}
            <motion.div
              className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-indigo-900 mb-4">Рекомендации для пары</h3>
              <div className="space-y-3 text-sm text-indigo-800/80">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💫</span>
                  <p>Ваша эмоциональная связь очень сильна. Поддерживайте её через глубокие разговоры и совместные переживания.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🗣️</span>
                  <p>Уделяйте особое внимание общению - это ключ к преодолению любых разногласий в ваших отношениях.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">🌱</span>
                  <p>У вас есть все предпосылки для долгосрочных отношений. Работайте над совместным развитием и ростом.</p>
                </div>
              </div>
            </motion.div>

            {/* Действия */}
            <div className="flex justify-center gap-4">
              <motion.button
                className="px-6 py-2.5 rounded-xl bg-white/10 text-indigo-900 font-medium hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
              >
                Новый расчет
              </motion.button>
              <motion.button
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Сохранить результат
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 