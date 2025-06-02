// Константы для знаков зодиака
export const ZODIAC_SIGNS = [
  "Овен", "Телец", "Близнецы", "Рак",
  "Лев", "Дева", "Весы", "Скорпион",
  "Стрелец", "Козерог", "Водолей", "Рыбы"
];

// Функция для определения знака зодиака по градусам
export const getZodiacSign = (degrees) => {
  if (typeof degrees !== 'number') return ZODIAC_SIGNS[0];
  const normalizedDegrees = ((degrees % 360) + 360) % 360; // Нормализация градусов
  const signIndex = Math.floor(normalizedDegrees / 30);
  return ZODIAC_SIGNS[signIndex];
}; 