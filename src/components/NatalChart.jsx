import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DetailedInterpretation from "./DetailedInterpretation";
import AspectInterpretation from "./AspectInterpretation";

const zodiacSigns = [
  "♈", "♉", "♊", "♋", "♌", "♍", 
  "♎", "♏", "♐", "♑", "♒", "♓"
];

const zodiacSymbols = {
  "Овен": "♈",
  "Телец": "♉",
  "Близнецы": "♊",
  "Рак": "♋",
  "Лев": "♌",
  "Дева": "♍",
  "Весы": "♎",
  "Скорпион": "♏",
  "Стрелец": "♐",
  "Козерог": "♑",
  "Водолей": "♒",
  "Рыбы": "♓"
};

const planetIcons = {
  Солнце: "☀️",
  Луна: "🌙",
  Меркурий: "☿️",
  Венера: "♀️",
  Марс: "♂️",
  Юпитер: "♃",
  Сатурн: "♄"
};

const aspectIcons = {
  соединение: "☯️",
  оппозиция: "⚔️",
  трин: "△",
  квадрат: "□",
  секстиль: "✶"
};

const aspectColors = {
  "соединение": "rgba(147, 51, 234, 0.3)",  // Фиолетовый
  "трин": "rgba(16, 185, 129, 0.3)",        // Зеленый
  "квадрат": "rgba(239, 68, 68, 0.3)",      // Красный
  "оппозиция": "rgba(245, 158, 11, 0.3)"    // Оранжевый
};

export const planetColors = {
  "Солнце": "#FFB74D",    // Теплый оранжевый
  "Луна": "#90CAF9",      // Нежный голубой
  "Меркурий": "#81C784",  // Спокойный зеленый
  "Венера": "#F48FB1",    // Мягкий розовый
  "Марс": "#EF5350",      // Энергичный красный
  "Юпитер": "#7E57C2",    // Глубокий фиолетовый
  "Сатурн": "#78909C"     // Серо-голубой
};

export const planetSymbols = {
  "Солнце": "☉",
  "Луна": "☽",
  "Меркурий": "☿",
  "Венера": "♀",
  "Марс": "♂",
  "Юпитер": "♃",
  "Сатурн": "♄"
};

export default function NatalChart({ data }) {
  console.log("NatalChart получил данные:", data);

  if (!data || !data.planets) {
    console.log("Нет данных для отображения натальной карты");
    return (
      <div className="text-indigo-900/80 text-center py-4">
        Загрузка данных натальной карты...
      </div>
    );
  }

  const calculatePosition = (degree, radius = 150) => {
    const angleInRadians = (degree - 90) * (Math.PI / 180);
    return {
      x: radius * Math.cos(angleInRadians) + 200,
      y: radius * Math.sin(angleInRadians) + 200
    };
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Натальная карта
        </motion.h2>
        <motion.p 
          className="text-indigo-600/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {data.name}, {new Date(data.birthDate).toLocaleDateString('ru-RU')} в {data.birthTime}
        </motion.p>
      </div>

      <div className="relative w-[400px] h-[400px] mx-auto bg-white/50 backdrop-blur-sm rounded-full shadow-lg border border-indigo-100">
        <svg className="absolute inset-0" viewBox="0 0 400 400">
          {/* Основной круг */}
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke="rgba(79, 70, 229, 0.1)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="rgba(79, 70, 229, 0.1)"
            strokeWidth="1"
          />

          {/* Знаки зодиака */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            const outerPos = calculatePosition(angle, 165);
            const lineEnd = calculatePosition(angle, 180);
            return (
              <g key={`zodiac-${i}`}>
                <line
                  x1="200"
                  y1="200"
                  x2={lineEnd.x}
                  y2={lineEnd.y}
                  stroke="rgba(79, 70, 229, 0.1)"
                  strokeWidth="1"
                />
                <text
                  x={outerPos.x}
                  y={outerPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-indigo-900/60 text-[14px]"
                >
                  {zodiacSigns[i]}
                </text>
              </g>
            );
          })}

          {/* Аспекты */}
          {data.aspects && data.aspects.map((aspect, index) => {
            const pos1 = calculatePosition(data.planets[aspect.planet1].longitude, 150);
            const pos2 = calculatePosition(data.planets[aspect.planet2].longitude, 150);
            return (
              <motion.line
                key={`aspect-${index}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke={aspectColors[aspect.aspect]}
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Планеты */}
        {Object.entries(data.planets).map(([planet, position]) => {
          const pos = calculatePosition(position.longitude, 150);
          return (
            <motion.div
              key={planet}
              className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center"
              style={{
                left: pos.x,
                top: pos.y
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative group">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md border-2 transition-transform transform-gpu group-hover:scale-110"
                  style={{ borderColor: planetColors[planet] }}
                >
                  <span 
                    className="text-lg font-bold"
                    style={{ color: planetColors[planet] }}
                  >
                    {planetSymbols[planet]}
                  </span>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-md shadow-sm text-xs whitespace-nowrap">
                  {planet} {Math.round(position.longitude)}°
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mt-12">
        <motion.div 
          className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-indigo-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-medium text-indigo-900 mb-4">Положение планет</h4>
          <div className="space-y-3">
            {Object.entries(data.planets).map(([planet, position]) => (
              <div key={planet} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                  style={{ borderColor: planetColors[planet], color: planetColors[planet] }}
                >
                  {planetSymbols[planet]}
                </div>
                <div>
                  <div className="text-indigo-900 font-medium">{planet}</div>
                  <div className="text-indigo-600/70 text-sm">{Math.round(position.longitude)}°</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-md border border-indigo-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h4 className="text-lg font-medium text-indigo-900 mb-4">Аспекты</h4>
          <div className="space-y-3">
            {data.aspects && data.aspects.map((aspect, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{ borderColor: planetColors[aspect.planet1], color: planetColors[aspect.planet1] }}
                  >
                    {planetSymbols[aspect.planet1]}
                  </span>
                  <span className="text-indigo-600/70">●</span>
                  <span 
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{ borderColor: planetColors[aspect.planet2], color: planetColors[aspect.planet2] }}
                  >
                    {planetSymbols[aspect.planet2]}
                  </span>
                </div>
                <span className="text-indigo-900">{aspect.aspect}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getPlanetEmoji(name) {
  const icons = {
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
  return icons[name] || "✨";
}

// Добавляем функцию debounce для оптимизации ресайза
function debounce(func, wait) {
  let timeout;
  const debouncedFunction = function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
  debouncedFunction.cancel = function() {
    clearTimeout(timeout);
  };
  return debouncedFunction;
}
