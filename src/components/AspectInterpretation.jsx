import React from 'react';
import { motion } from 'framer-motion';

const planetIcons = {
  "Солнце": "☀️",
  "Луна": "🌙",
  "Меркурий": "☿️",
  "Венера": "♀️",
  "Марс": "♂️",
  "Юпитер": "♃",
  "Сатурн": "♄",
  "Уран": "♅",
  "Нептун": "♆",
  "Плутон": "♇"
};

const aspectIcons = {
  "соединение": "☯️",
  "оппозиция": "⚔️",
  "трин": "△",
  "квадрат": "□",
  "секстиль": "✶"
};

const aspectColors = {
  "соединение": "from-blue-500 to-indigo-500",
  "оппозиция": "from-red-500 to-rose-500",
  "трин": "from-emerald-500 to-green-500",
  "квадрат": "from-red-500 to-pink-500",
  "секстиль": "from-blue-500 to-cyan-500"
};

const aspectDescriptions = {
  "соединение": "Соединение создает мощное слияние энергий планет, усиливая их влияние друг на друга.",
  "оппозиция": "Оппозиция создает напряжение и конфликт между планетами, требующий поиска баланса.",
  "трин": "Трин формирует гармоничный поток энергии между планетами, способствуя их взаимному развитию.",
  "квадрат": "Квадрат создает напряженный аспект, требующий преодоления препятствий и трансформации.",
  "секстиль": "Секстиль образует благоприятную связь между планетами, открывая возможности для роста."
};

const planetColors = {
  "Солнце": "#FFB74D",    // Теплый оранжевый
  "Луна": "#90CAF9",      // Нежный голубой
  "Меркурий": "#81C784",  // Спокойный зеленый
  "Венера": "#F48FB1",    // Мягкий розовый
  "Марс": "#EF5350",      // Энергичный красный
  "Юпитер": "#7E57C2",    // Глубокий фиолетовый
  "Сатурн": "#78909C"     // Серо-голубой
};

export default function AspectInterpretation({ aspects }) {
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

  // Группируем аспекты по типам для лучшей организации
  const groupedAspects = aspects.reduce((acc, aspect) => {
    if (!acc[aspect.aspect]) {
      acc[aspect.aspect] = [];
    }
    acc[aspect.aspect].push(aspect);
    return acc;
  }, {});

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.h2
        className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900 mb-6"
        variants={item}
      >
        Интерпретация аспектов
      </motion.h2>

      {/* Группы аспектов */}
      {Object.entries(groupedAspects).map(([aspectType, aspectList]) => (
        <motion.div key={aspectType} variants={item} className="space-y-4">
          <h3 className="text-lg font-semibold text-indigo-900 pl-4 border-l-4 border-indigo-500">
            {aspectType}
            <span className="ml-2 text-xl">{aspectIcons[aspectType]}</span>
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aspectList.map((aspect, index) => (
              <motion.div
                key={`${aspect.planet1}-${aspect.planet2}-${aspect.aspect}`}
                className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                variants={item}
              >
                {/* Градиентный фон */}
                <div className={`absolute inset-0 bg-gradient-to-br ${aspectColors[aspect.aspect]} opacity-5`} />

                <div className="relative p-4">
                  {/* Заголовок с планетами */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <span 
                          className="w-8 h-8 rounded-full flex items-center justify-center border-2 text-lg"
                          style={{ borderColor: planetColors[aspect.planet1], color: planetColors[aspect.planet1] }}
                        >
                          {planetIcons[aspect.planet1]}
                        </span>
                        <span className="mx-2 text-indigo-600/70">●</span>
                        <span 
                          className="w-8 h-8 rounded-full flex items-center justify-center border-2 text-lg"
                          style={{ borderColor: planetColors[aspect.planet2], color: planetColors[aspect.planet2] }}
                        >
                          {planetIcons[aspect.planet2]}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl text-indigo-600/70">{aspectIcons[aspect.aspect]}</span>
                  </div>

                  {/* Описание аспекта */}
                  <div className="space-y-3">
                    <p className="text-sm text-indigo-900/80 leading-relaxed">
                      {aspectDescriptions[aspect.aspect]}
                    </p>
                    
                    {/* Дополнительная информация */}
                    <div className="pt-3 border-t border-indigo-100/30">
                      <p className="text-xs text-indigo-900/60">
                        {aspect.planet1} и {aspect.planet2} формируют {aspect.aspect.toLowerCase()} 
                        {aspect.angle && ` (${Math.round(parseFloat(aspect.angle))}°)`}
                      </p>
                    </div>
                  </div>

                  {/* Декоративный элемент */}
                  <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 