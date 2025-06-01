import React from "react";
import { motion } from "framer-motion";

const zodiacSigns = [
  "Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева",
  "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы",
];

const planetIcons = {
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

const aspectColors = {
  соединение: "#4f46e5", // индиго
  оппозиция: "#dc2626", // красный
  трин: "#059669", // зеленый
  квадрат: "#b91c1c", // темно-красный
  секстиль: "#2563eb", // синий
};

export default function NatalChart({ data }) {
  const { positions, aspects } = data;
  const radius = 120;
  const center = 150;

  const getPosition = (sign, offset = 0) => {
    const index = zodiacSigns.indexOf(sign);
    const angleDeg = index * 30 - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: center + (radius + offset) * Math.cos(angleRad),
      y: center + (radius + offset) * Math.sin(angleRad),
    };
  };

  // Функция для отрисовки аспектов
  const renderAspects = () => {
    return aspects.map((aspect, i) => {
      const pos1 = getPosition(positions[aspect.planet1].sign, -20);
      const pos2 = getPosition(positions[aspect.planet2].sign, -20);

      return (
        <motion.line
          key={`aspect-${i}`}
          x1={pos1.x}
          y1={pos1.y}
          x2={pos2.x}
          y2={pos2.y}
          stroke={aspectColors[aspect.aspect]}
          strokeWidth={1}
          strokeDasharray={aspect.aspect === "оппозиция" ? "4 4" : undefined}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1, delay: 1 + i * 0.1 }}
        />
      );
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <motion.svg 
          width={300} 
          height={300} 
          className="drop-shadow-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Фоновый круг */}
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#c4b5fd", stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: "#818cf8", stopOpacity: 0.2 }} />
            </linearGradient>
          </defs>
          
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="url(#circleGradient)" 
            stroke="#818cf8" 
            strokeWidth={2}
            className="filter drop-shadow-lg"
          />

          {/* Аспекты */}
          {renderAspects()}

          {/* Линии знаков */}
          {zodiacSigns.map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            return (
              <motion.line
                key={`line-${i}`}
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(angle)}
                y2={center + radius * Math.sin(angle)}
                stroke="#818cf8"
                strokeWidth={0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            );
          })}

          {/* Знаки зодиака */}
          {zodiacSigns.map((sign, i) => {
            const { x, y } = getPosition(sign, 25);
            return (
              <motion.text
                key={sign}
                x={x}
                y={y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="10"
                fill="#4c1d95"
                fontWeight="600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {sign}
              </motion.text>
            );
          })}

          {/* Планеты */}
          {Object.entries(positions).map(([planet, data], i) => {
            const { x, y } = getPosition(data.sign, -20);
            return (
              <motion.g
                key={planet}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill="white"
                  className="filter drop-shadow-sm"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="16"
                >
                  {planetIcons[planet] || "✨"}
                </text>
              </motion.g>
            );
          })}
        </motion.svg>
      </div>

      {/* Интерпретация */}
      <div className="space-y-6">
        <motion.div 
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-lg font-semibold text-indigo-800">🌟 Положение планет</h3>
          {Object.entries(positions).map(([planet, data]) => (
            <motion.div
              key={planet}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{planetIcons[planet]}</span>
                <span className="font-medium text-indigo-900">{planet}</span>
                <span className="text-sm text-indigo-600">
                  {data.sign} {data.degree}°
                </span>
              </div>
              <p className="text-sm text-gray-600">{data.interpretation}</p>
            </motion.div>
          ))}
        </motion.div>

        {aspects.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <h3 className="text-lg font-semibold text-indigo-800">✨ Аспекты между планетами</h3>
            <div className="grid gap-3">
              {aspects.map((aspect, i) => (
                <motion.div
                  key={i}
                  className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <span>{planetIcons[aspect.planet1]}</span>
                    <span className="text-sm font-medium">{aspect.planet1}</span>
                    <span className="text-sm text-indigo-600">{aspect.aspect}</span>
                    <span>{planetIcons[aspect.planet2]}</span>
                    <span className="text-sm font-medium">{aspect.planet2}</span>
                    <span className="text-xs text-gray-500">({aspect.angle}°)</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
