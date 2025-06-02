import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const planetColors = {
  "Солнце": "#FFD700",
  "Луна": "#C0C0C0",
  "Меркурий": "#4169E1",
  "Венера": "#FF69B4",
  "Марс": "#FF4500",
  "Юпитер": "#9370DB",
  "Сатурн": "#696969"
};

const planetSymbols = {
  "Солнце": "☉",
  "Луна": "☽",
  "Меркурий": "☿",
  "Венера": "♀",
  "Марс": "♂",
  "Юпитер": "♃",
  "Сатурн": "♄"
};

export default function TransitChart({ birthData }) {
  useEffect(() => {
    console.log("TransitChart получил данные:", birthData);
  }, [birthData]);

  if (!birthData || !birthData.planets) {
    console.log("Нет данных для отображения карты");
    return (
      <div className="text-indigo-300/80 text-center py-4">
        Загрузка данных натальной карты...
      </div>
    );
  }

  const calculatePosition = (degree) => {
    const radius = 150;
    const angleInRadians = (degree - 90) * (Math.PI / 180);
    return {
      x: radius * Math.cos(angleInRadians) + radius,
      y: radius * Math.sin(angleInRadians) + radius
    };
  };

  return (
    <div className="space-y-8">
      {/* Визуальное отображение карты */}
      <div className="relative w-[300px] h-[300px] mx-auto">
        {/* Зодиакальный круг */}
        <svg className="absolute inset-0" viewBox="0 0 300 300">
          <circle
            cx="150"
            cy="150"
            r="145"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          {/* Разделители знаков зодиака */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            const start = calculatePosition(angle);
            return (
              <line
                key={i}
                x1="150"
                y1="150"
                x2={start.x}
                y2={start.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            );
          })}

          {/* Линии аспектов */}
          {birthData.aspects && birthData.aspects.map((aspect, index) => {
            const pos1 = calculatePosition(birthData.planets[aspect.planet1].longitude);
            const pos2 = calculatePosition(birthData.planets[aspect.planet2].longitude);
            return (
              <line
                key={`aspect-${index}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke={
                  aspect.aspect === 'трин' ? 'rgba(0,255,0,0.2)' :
                  aspect.aspect === 'квадрат' ? 'rgba(255,0,0,0.2)' :
                  aspect.aspect === 'оппозиция' ? 'rgba(255,0,0,0.2)' :
                  'rgba(255,255,255,0.2)'
                }
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Планеты */}
        {Object.entries(birthData.planets).map(([planet, data]) => {
          const pos = calculatePosition(data.longitude);
          return (
            <motion.div
              key={planet}
              className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center"
              style={{
                left: pos.x,
                top: pos.y,
                color: planetColors[planet]
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-lg font-bold">{planetSymbols[planet]}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Список планет и их положений */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-medium text-white mb-3">Положение планет</h4>
          <div className="space-y-2">
            {Object.entries(birthData.planets).map(([planet, data]) => (
              <div key={planet} className="flex items-center gap-2">
                <span style={{ color: planetColors[planet] }}>{planetSymbols[planet]}</span>
                <span className="text-indigo-200">{planet}</span>
                <span className="text-indigo-300/70">{Math.round(data.longitude)}°</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-white mb-3">Аспекты</h4>
          <div className="space-y-2">
            {birthData.aspects && birthData.aspects.map((aspect, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-indigo-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span style={{ color: planetColors[aspect.planet1] }}>
                  {planetSymbols[aspect.planet1]}
                </span>
                <span className="text-indigo-300/70">{aspect.aspect}</span>
                <span style={{ color: planetColors[aspect.planet2] }}>
                  {planetSymbols[aspect.planet2]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 