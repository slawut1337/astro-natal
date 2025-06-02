import swisseph from 'swisseph';

// Инициализация эфемерид
const ephePath = './ephe'; // Путь к файлам эфемерид
swisseph.swe_set_ephe_path(ephePath);

// Константы для планет
const PLANETS = {
  SUN: swisseph.SE_SUN,
  MOON: swisseph.SE_MOON,
  MERCURY: swisseph.SE_MERCURY,
  VENUS: swisseph.SE_VENUS,
  MARS: swisseph.SE_MARS,
  JUPITER: swisseph.SE_JUPITER,
  SATURN: swisseph.SE_SATURN
};

// Знаки зодиака
const SIGNS = [
  "Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева",
  "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"
];

function getJulianDate(date, time) {
  const datetime = new Date(`${date}T${time}`);
  const year = datetime.getUTCFullYear();
  const month = datetime.getUTCMonth() + 1;
  const day = datetime.getUTCDate();
  const hour = datetime.getUTCHours() + 
               datetime.getUTCMinutes() / 60 + 
               datetime.getUTCSeconds() / 3600;
  
  return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
}

function calculatePlanetPosition(julianDate, planet) {
  const flags = swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH;
  const result = swisseph.swe_calc_ut(julianDate, planet, flags);
  
  if (result.error) {
    throw new Error(`Ошибка при расчете положения планеты: ${result.error}`);
  }

  const longitude = result.longitude;
  const signIndex = Math.floor(longitude / 30);
  const degree = longitude % 30;

  return {
    sign: SIGNS[signIndex],
    degree: degree.toFixed(2),
    longitude: longitude
  };
}

function calculateAspects(positions) {
  const aspects = [];
  const orbs = {
    conjunction: 8, // соединение
    opposition: 8, // оппозиция
    trine: 8, // трин
    square: 7, // квадрат
    sextile: 6 // секстиль
  };

  const planets = Object.entries(positions);
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const [planet1, pos1] = planets[i];
      const [planet2, pos2] = planets[j];
      
      const angle = Math.abs(pos1.longitude - pos2.longitude);
      
      if (Math.abs(angle - 0) <= orbs.conjunction || Math.abs(angle - 360) <= orbs.conjunction) {
        aspects.push({ aspect: "соединение", planet1, planet2, angle: angle.toFixed(2) });
      }
      if (Math.abs(angle - 180) <= orbs.opposition) {
        aspects.push({ aspect: "оппозиция", planet1, planet2, angle: angle.toFixed(2) });
      }
      if (Math.abs(angle - 120) <= orbs.trine) {
        aspects.push({ aspect: "трин", planet1, planet2, angle: angle.toFixed(2) });
      }
      if (Math.abs(angle - 90) <= orbs.square) {
        aspects.push({ aspect: "квадрат", planet1, planet2, angle: angle.toFixed(2) });
      }
      if (Math.abs(angle - 60) <= orbs.sextile) {
        aspects.push({ aspect: "секстиль", planet1, planet2, angle: angle.toFixed(2) });
      }
    }
  }

  return aspects;
}

export function calculateNatalChart({ date, time, latitude, longitude }) {
  try {
    const julianDate = getJulianDate(date, time);
    
    // Устанавливаем географические координаты
    swisseph.swe_set_topo(longitude, latitude, 0);

    // Рассчитываем положения планет
    const positions = {
      Солнце: calculatePlanetPosition(julianDate, PLANETS.SUN),
      Луна: calculatePlanetPosition(julianDate, PLANETS.MOON),
      Меркурий: calculatePlanetPosition(julianDate, PLANETS.MERCURY),
      Венера: calculatePlanetPosition(julianDate, PLANETS.VENUS),
      Марс: calculatePlanetPosition(julianDate, PLANETS.MARS),
      Юпитер: calculatePlanetPosition(julianDate, PLANETS.JUPITER),
      Сатурн: calculatePlanetPosition(julianDate, PLANETS.SATURN)
    };

    // Рассчитываем аспекты
    const aspects = calculateAspects(positions);

    // Добавляем интерпретации
    const interpretedPositions = {};
    for (const [planet, position] of Object.entries(positions)) {
      interpretedPositions[planet] = {
        ...position,
        interpretation: getInterpretation(planet, position.sign)
      };
    }

    return {
      positions: interpretedPositions,
      aspects
    };
  } catch (error) {
    console.error('Ошибка при расчете натальной карты:', error);
    throw new Error('Не удалось рассчитать натальную карту. Пожалуйста, попробуйте позже.');
  }
}

function getInterpretation(planet, sign) {
  const interpretations = {
    Солнце: {
      Овен: "Сильная жизненная энергия, лидерские качества, стремление к самовыражению",
      Телец: "Практичность, надежность, стремление к материальному благополучию",
      Близнецы: "Интеллектуальная активность, коммуникабельность, разносторонность",
      Рак: "Эмоциональная чувствительность, забота о близких, интуитивность",
      Лев: "Творческий потенциал, благородство, стремление к признанию",
      Дева: "Аналитический ум, практичность, внимание к деталям",
      Весы: "Дипломатичность, стремление к гармонии, эстетическое чувство",
      Скорпион: "Сильная воля, проницательность, способность к трансформации",
      Стрелец: "Оптимизм, стремление к развитию, философский склад ума",
      Козерог: "Целеустремленность, ответственность, организованность",
      Водолей: "Оригинальность мышления, независимость, гуманизм",
      Рыбы: "Чувствительность, духовность, творческое воображение"
    },
    // ... остальные интерпретации планет остаются теми же ...
  };
  
  return interpretations[planet]?.[sign] || "Требуется дополнительный анализ";
} 