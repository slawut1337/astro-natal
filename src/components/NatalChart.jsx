import React, { useState, useEffect, useRef, useMemo } from "react";
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
  "оппозиция": "rgba(245, 158, 11, 0.3)",    // Оранжевый
  "секстиль": "rgba(59, 130, 246, 0.3)"     // Голубой
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
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedAspect, setSelectedAspect] = useState(null);
  const chartRef = useRef(null);
  
  // Функция для получения знака зодиака по градусу
  const getZodiacSign = (degree) => {
    const normalizedDegree = ((degree % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedDegree / 30);
    return zodiacSigns[signIndex];
  };

  // Функция для расчета позиции на круге
  const calculatePosition = (degree, radius = 150) => {
    // Нормализуем градус и переводим в радианы
    const normalizedDegree = ((degree % 360) + 360) % 360;
    const angleInRadians = ((normalizedDegree - 90) * Math.PI) / 180;
    
    // Рассчитываем позицию
    return {
      x: 200 + radius * Math.cos(angleInRadians),
      y: 200 + radius * Math.sin(angleInRadians)
    };
  };

  // Группируем планеты по секторам (30 градусов каждый)
  const groupPlanetsBySector = (planets) => {
    if (!planets) return Array(12).fill().map(() => []);
    
    const sectors = Array(12).fill().map(() => []);
    
    Object.entries(planets).forEach(([planet, data]) => {
      const normalizedDegree = ((data.longitude % 360) + 360) % 360;
      const sectorIndex = Math.floor(normalizedDegree / 30);
      sectors[sectorIndex].push({ planet, degree: normalizedDegree });
    });
    
    return sectors;
  };

  // Рассчитываем позиции планет с учетом группировки
  const calculatePlanetPositions = (planets) => {
    if (!planets) return {};
    
    const sectors = groupPlanetsBySector(planets);
    const positions = {};
    
    sectors.forEach((sector, sectorIndex) => {
      if (sector.length === 0) return;
      
      // Базовый угол для сектора
      const baseAngle = sectorIndex * 30;
      
      // Если в секторе одна планета
      if (sector.length === 1) {
        const { planet, degree } = sector[0];
        positions[planet] = calculatePosition(degree);
        return;
      }
      
      // Если в секторе несколько планет, распределяем их по радиусу
      sector.forEach(({ planet, degree }, index) => {
        const radiusOffset = index * 15; // Смещаем каждую следующую планету на 15 пикселей
        positions[planet] = calculatePosition(degree, 150 - radiusOffset);
      });
    });
    
    return positions;
  };

  // Рассчитываем позиции с помощью useMemo для оптимизации
  const planetPositions = useMemo(() => calculatePlanetPositions(data?.planets), [data?.planets]);

  if (!data || !data.planets) {
    return (
      <div className="text-indigo-900/80 text-center py-4">
        Загрузка данных натальной карты...
      </div>
    );
  }

  // Функция для отрисовки линии аспекта
  const renderAspectLine = (pos1, pos2, aspect, isSelected) => {
    if (!pos1 || !pos2) return null;

    // Рассчитываем вектор между планетами
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Если планеты слишком близко, не рисуем аспект
    if (distance < 30) return null;

    // Нормализуем вектор
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Отступаем от центров планет
    const offset = 20;
    const startX = pos1.x + nx * offset;
    const startY = pos1.y + ny * offset;
    const endX = pos2.x - nx * offset;
    const endY = pos2.y - ny * offset;

    return {
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY
    };
  };

  return (
    <div className="relative w-[400px] h-[400px] mx-auto bg-white/5 backdrop-blur-sm rounded-full p-4" ref={chartRef}>
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

        {/* Сектора знаков зодиака */}
        {Array.from({ length: 12 }).map((_, i) => {
          const startAngle = i * 30;
          const endAngle = (i + 1) * 30;
          const startPos = calculatePosition(startAngle, 180);
          const midPos = calculatePosition(startAngle + 15, 165);
          
          return (
            <g key={`zodiac-${i}`}>
              <line
                x1="200"
                y1="200"
                x2={startPos.x}
                y2={startPos.y}
                stroke="rgba(79, 70, 229, 0.1)"
                strokeWidth="1"
              />
              <text
                x={midPos.x}
                y={midPos.y}
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
          const pos1 = planetPositions[aspect.planet1];
          const pos2 = planetPositions[aspect.planet2];
          const isSelected = selectedAspect === index;
          
          const lineCoords = renderAspectLine(pos1, pos2, aspect.aspect, isSelected);
          if (!lineCoords) return null;
          
          return (
            <motion.line
              key={`aspect-${index}`}
              {...lineCoords}
              stroke={aspectColors[aspect.aspect]}
              strokeWidth={isSelected ? "3" : "2"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: isSelected ? 0.8 : 0.4,
                strokeWidth: isSelected ? 3 : 2
              }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              onMouseEnter={() => setSelectedAspect(index)}
              onMouseLeave={() => setSelectedAspect(null)}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </svg>

      {/* Планеты */}
      {Object.entries(data.planets).map(([planet, position]) => {
        const pos = planetPositions[planet];
        const isSelected = selectedPlanet === planet;
        if (!pos) return null;

        return (
          <motion.div
            key={planet}
            className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center"
            style={{
              left: pos.x,
              top: pos.y,
              zIndex: isSelected ? 10 : 1
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: isSelected ? 1.2 : 1,
              filter: `drop-shadow(0 0 ${isSelected ? '8px' : '4px'} ${planetColors[planet]})`
            }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onMouseEnter={() => setSelectedPlanet(planet)}
            onMouseLeave={() => setSelectedPlanet(null)}
          >
            <div className="relative group">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md border-2 transition-transform transform-gpu hover:scale-110"
                style={{ borderColor: planetColors[planet] }}
              >
                <span 
                  className="text-lg font-bold"
                  style={{ color: planetColors[planet] }}
                >
                  {planetSymbols[planet]}
                </span>
              </div>
              <motion.div 
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-sm text-xs whitespace-nowrap"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : -10 }}
                transition={{ duration: 0.2 }}
              >
                {planet} {Math.round(position.longitude)}° {getZodiacSign(position.longitude)}
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {/* Информация об аспектах */}
      {selectedAspect !== null && data.aspects[selectedAspect] && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: planetColors[data.aspects[selectedAspect].planet1] }}>
              {planetSymbols[data.aspects[selectedAspect].planet1]}
            </span>
            <span className="text-indigo-900">
              {data.aspects[selectedAspect].aspect}
            </span>
            <span style={{ color: planetColors[data.aspects[selectedAspect].planet2] }}>
              {planetSymbols[data.aspects[selectedAspect].planet2]}
            </span>
          </div>
        </motion.div>
      )}
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
