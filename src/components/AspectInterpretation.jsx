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

export default function AspectInterpretation({ aspects }) {
  return (
    <div className="space-y-6">
      <motion.h2
        className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Интерпретация аспектов
      </motion.h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aspects.map((aspect, index) => (
          <motion.div
            key={`${aspect.planet1}-${aspect.planet2}-${aspect.aspect}`}
            className="relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {/* Декоративный градиентный фон */}
            <div className={`absolute inset-0 bg-gradient-to-br ${aspectColors[aspect.aspect]} opacity-5`} />
            
            {/* Заголовок с планетами */}
            <div className="relative flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{planetIcons[aspect.planet1]}</span>
                <span className="text-indigo-900 font-medium">{aspect.planet1}</span>
              </div>
              <span className="text-xl text-indigo-600/70">{aspectIcons[aspect.aspect]}</span>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-900 font-medium">{aspect.planet2}</span>
                <span className="text-lg">{planetIcons[aspect.planet2]}</span>
              </div>
            </div>

            {/* Описание аспекта */}
            <div className="relative">
              <p className="text-sm text-indigo-900/80 leading-relaxed">
                {aspectDescriptions[aspect.aspect]}
              </p>
              
              {/* Дополнительная информация */}
              <div className="mt-3 pt-3 border-t border-indigo-100/30">
                <p className="text-xs text-indigo-900/60">
                  Влияние {aspect.aspect} между планетами {aspect.planet1} и {aspect.planet2}.
                </p>
              </div>
            </div>

            {/* Декоративный элемент */}
            <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 