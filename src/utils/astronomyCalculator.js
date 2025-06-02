// Константы для расчетов
const TROPICAL_YEAR = 365.242190; // Тропический год в днях
const J2000 = 2451545.0; // Юлианская дата для 2000-01-01 12:00 UT

// Средние орбитальные элементы планет на J2000
const ORBITAL_ELEMENTS = {
  SUN: {
    epoch: J2000,
    n: 0.985647332,  // Среднее движение (градусов/день)
    L: 280.459,      // Средняя долгота (градусы)
    e: 0.016709,     // Эксцентриситет
    pi: 102.937,     // Долгота перигелия (градусы)
  },
  MOON: {
    epoch: J2000,
    n: 13.1763965268, // Среднее движение (градусов/день)
    L: 218.316,       // Средняя долгота (градусы)
    e: 0.0549,        // Эксцентриситет
    pi: 83.353,       // Долгота перигелия (градусы)
  },
  MERCURY: { 
    epoch: J2000,
    n: 4.092339, 
    L: 252.251,
    e: 0.205630,
    pi: 77.456
  },
  VENUS: { 
    epoch: J2000,
    n: 1.602136, 
    L: 181.979,
    e: 0.006773,
    pi: 131.563
  },
  MARS: { 
    epoch: J2000,
    n: 0.524039, 
    L: 355.433,
    e: 0.093405,
    pi: 336.041
  },
  JUPITER: { 
    epoch: J2000,
    n: 0.083056, 
    L: 34.351,
    e: 0.048498,
    pi: 14.331
  },
  SATURN: { 
    epoch: J2000,
    n: 0.033371, 
    L: 50.077,
    e: 0.054309,
    pi: 93.057
  }
};

// Знаки зодиака
const ZODIAC_SIGNS = [
  "Овен", "Телец", "Близнецы", "Рак", 
  "Лев", "Дева", "Весы", "Скорпион",
  "Стрелец", "Козерог", "Водолей", "Рыбы"
];

const PLANET_CHARACTERISTICS = {
  "Солнце-ключевые-слова": "воля, самовыражение, жизненная сила, творчество",
  "Солнце-влияние-личность": "центральная сущность и самовыражение",
  "Солнце-влияние-карьера": "жизненные цели и признание",
  "Солнце-влияние-здоровье": "витальность и энергия",
  
  "Луна-ключевые-слова": "эмоции, интуиция, подсознание, адаптация",
  "Луна-влияние-личность": "эмоциональная природа и реакции",
  "Луна-влияние-отношения": "эмоциональные потребности и привязанности",
  "Луна-влияние-здоровье": "эмоциональное благополучие",
  
  "Меркурий-ключевые-слова": "интеллект, коммуникация, обучение, анализ",
  "Меркурий-влияние-личность": "способ мышления и общения",
  "Меркурий-влияние-карьера": "интеллектуальная деятельность и обучение",
  "Меркурий-влияние-отношения": "коммуникация и обмен информацией",
  
  "Венера-ключевые-слова": "любовь, красота, гармония, ценности",
  "Венера-влияние-личность": "эстетическое восприятие и чувство прекрасного",
  "Венера-влияние-отношения": "романтические связи и партнерство",
  "Венера-влияние-финансы": "материальное благополучие и ресурсы",
  
  "Марс-ключевые-слова": "энергия, действие, инициатива, храбрость",
  "Марс-влияние-личность": "способ действия и проявления энергии",
  "Марс-влияние-карьера": "достижение целей и конкуренция",
  "Марс-влияние-здоровье": "физическая активность и сила",
  
  "Юпитер-ключевые-слова": "расширение, удача, мудрость, оптимизм",
  "Юпитер-влияние-личность": "мировоззрение и философия жизни",
  "Юпитер-влияние-карьера": "социальный успех и рост",
  "Юпитер-влияние-финансы": "благополучие и процветание",
  
  "Сатурн-ключевые-слова": "структура, ответственность, дисциплина, мудрость",
  "Сатурн-влияние-личность": "самодисциплина и зрелость",
  "Сатурн-влияние-карьера": "профессиональное развитие и достижения",
  "Сатурн-влияние-жизненные_уроки": "преодоление препятствий и рост"
};

const HOUSE_MEANINGS = {
  "1-название": "Дом личности",
  "1-ключевые-слова": "самовыражение, внешность, характер",
  "1-области": "личность, поведение, первое впечатление",
  
  "2-название": "Дом ценностей",
  "2-ключевые-слова": "финансы, ресурсы, самооценка",
  "2-области": "деньги, материальные ценности, таланты"
  // ... другие дома
};

const ASPECT_INTERPRETATIONS = {
  соединение: {
    type: "major",
    nature: "neutral",
    interpretation: "слияние энергий, усиление качеств"
  },
  трин: {
    type: "major",
    nature: "harmonious",
    interpretation: "гармоничное взаимодействие, легкость реализации"
  },
  // ... другие аспекты
};

function getJulianDate(date, time) {
  console.log('Input date and time:', { date, time }); // Отладочный вывод

  if (!date || !time) {
    console.error('Missing date or time:', { date, time });
    throw new Error('Необходимо указать дату и время');
  }

  const datetime = new Date(`${date}T${time}`);
  if (isNaN(datetime.getTime())) {
    console.error('Invalid date or time:', { date, time, datetime });
    throw new Error('Неверный формат даты или времени');
  }

  const year = datetime.getUTCFullYear();
  const month = datetime.getUTCMonth() + 1;
  const day = datetime.getUTCDate();
  const hour = datetime.getUTCHours() + 
               datetime.getUTCMinutes() / 60 + 
               datetime.getUTCSeconds() / 3600;

  console.log('Parsed date components:', { year, month, day, hour }); // Отладочный вывод

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  const jd = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + b - 1524.5 +
             hour / 24;

  console.log('Calculated Julian Date:', jd); // Отладочный вывод
  return jd;
}

function calculatePlanetPosition(jd, planet) {
  const elements = ORBITAL_ELEMENTS[planet];
  if (!elements) {
    console.error(`No orbital elements found for planet: ${planet}`);
    return null;
  }

  // Расчет времени в юлианских столетиях от J2000
  const t = (jd - elements.epoch) / 36525;

  // Расчет средней долготы
  let L = elements.L + elements.n * (jd - elements.epoch);
  
  // Нормализация долготы
  L = L % 360;
  if (L < 0) L += 360;

  // Добавляем основные возмущения
  if (planet === 'MOON') {
    const D = L - ORBITAL_ELEMENTS.SUN.L; // Средняя элонгация
    L += 6.289 * Math.sin(D * Math.PI / 180); // Эвекция
  } else if (planet !== 'SUN') {
    // Простые возмущения для других планет
    const sunL = ORBITAL_ELEMENTS.SUN.L + ORBITAL_ELEMENTS.SUN.n * (jd - J2000);
    const dL = Math.sin((L - sunL) * Math.PI / 180);
    L += elements.e * dL * 2;
  }

  // Определение знака зодиака и градуса
  const signIndex = Math.floor(L / 30);
  const degree = L % 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: Number(degree.toFixed(2)),
    longitude: Number(L.toFixed(2))
  };
}

function calculateAspects(positions) {
  const aspects = [];
  const orbs = {
    conjunction: 8,
    opposition: 8,
    trine: 8,
    square: 7,
    sextile: 6
  };

  const planets = Object.entries(positions);
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const [planet1, pos1] = planets[i];
      const [planet2, pos2] = planets[j];
      
      if (!pos1.longitude || !pos2.longitude) continue;
      
      const angle = Math.abs(Number(pos1.longitude) - Number(pos2.longitude));
      
      if (Math.abs(angle - 0) <= orbs.conjunction || Math.abs(angle - 360) <= orbs.conjunction) {
        aspects.push({ aspect: "соединение", planet1, planet2, angle: Number(angle.toFixed(2)) });
      }
      if (Math.abs(angle - 180) <= orbs.opposition) {
        aspects.push({ aspect: "оппозиция", planet1, planet2, angle: Number(angle.toFixed(2)) });
      }
      if (Math.abs(angle - 120) <= orbs.trine) {
        aspects.push({ aspect: "трин", planet1, planet2, angle: Number(angle.toFixed(2)) });
      }
      if (Math.abs(angle - 90) <= orbs.square) {
        aspects.push({ aspect: "квадрат", planet1, planet2, angle: Number(angle.toFixed(2)) });
      }
      if (Math.abs(angle - 60) <= orbs.sextile) {
        aspects.push({ aspect: "секстиль", planet1, planet2, angle: Number(angle.toFixed(2)) });
      }
    }
  }

  return aspects;
}

// Функция для расчета натальной карты
export function calculateNatalChart({ date, time, latitude, longitude }) {
  try {
    // Расчет положений планет
    const positions = calculatePlanetPositions(date, time, latitude, longitude);
    
    // Расчет аспектов
    const aspects = calculateAspects(positions);
    
    return {
      positions,
      aspects
    };
  } catch (error) {
    console.error('Ошибка при расчете натальной карты:', error);
    throw new Error('Не удалось рассчитать натальную карту. Пожалуйста, попробуйте позже.');
  }
}

// Вспомогательные функции

function calculatePlanetPositions(date, time, latitude, longitude) {
  const jd = getJulianDate(date, time);
  console.log('Julian Date:', jd);
  
  const positions = {};
  const planets = {
    'Солнце': 'SUN',
    'Луна': 'MOON',
    'Меркурий': 'MERCURY',
    'Венера': 'VENUS',
    'Марс': 'MARS',
    'Юпитер': 'JUPITER',
    'Сатурн': 'SATURN'
  };

  for (const [ruName, engName] of Object.entries(planets)) {
    const position = calculatePlanetPosition(jd, engName);
    if (position) {
      positions[ruName] = position;
      console.log(`Position for ${ruName}:`, position);
    } else {
      console.error(`Failed to calculate position for ${ruName}`);
    }
  }

  return positions;
}

function calculateHouses(date, time, latitude, longitude) {
  // Расчет системы домов
  return {
    1: { sign: "Лев", degree: 15 },
    2: { sign: "Дева", degree: 10 },
    // ... другие дома
  };
}

function calculateSpecialPoints(date, time, latitude, longitude) {
  // Расчет специальных точек (узлы, жребии и т.д.)
  return {
    northNode: { sign: "Овен", degree: 5, house: 9 },
    southNode: { sign: "Весы", degree: 5, house: 3 },
    // ... другие точки
  };
}

function generateInterpretations(positions, houses, aspects, specialPoints) {
  // Генерация детальных интерпретаций
  
  const planetaryPositions = {};
  Object.entries(positions).forEach(([planet, data]) => {
    planetaryPositions[planet] = {
      ...data,
      interpretation: generatePlanetInterpretation(planet, data),
      lifeAreas: generateLifeAreasInfluence(planet, data)
    };
  });

  const aspectPatterns = aspects.map(aspect => ({
    ...aspect,
    interpretation: generateAspectInterpretation(aspect),
    influence: generateAspectInfluence(aspect)
  }));

  const houseSystem = {};
  Object.entries(houses).forEach(([houseNumber, data]) => {
    houseSystem[houseNumber] = {
      ...data,
      interpretation: generateHouseInterpretation(houseNumber, data),
      recommendations: generateHouseRecommendations(houseNumber, data)
    };
  });

  const karmicFactors = {
    northNode: {
      ...specialPoints.northNode,
      interpretation: generateNodeInterpretation("north", specialPoints.northNode)
    },
    southNode: {
      ...specialPoints.southNode,
      interpretation: generateNodeInterpretation("south", specialPoints.southNode)
    }
  };

  const personalDevelopment = generateDevelopmentPath(
    planetaryPositions,
    aspectPatterns,
    houseSystem,
    karmicFactors
  );

  return {
    planetaryPositions,
    aspectPatterns,
    houseSystem,
    karmicFactors,
    personalDevelopment
  };
}

function generatePlanetInterpretation(planet, data) {
  const keywords = PLANET_CHARACTERISTICS[`${planet}-ключевые-слова`];
  return `В вашей натальной карте ${planet} находится в знаке ${data.sign} в ${data.house} доме. 
          Это положение указывает на ${keywords}. 
          ${generatePositionDetails(planet, data)}`;
}

function generateLifeAreasInfluence(planet, data) {
  const areas = ['личность', 'карьера', 'здоровье', 'отношения', 'финансы', 'жизненные_уроки'];
  return areas.reduce((acc, area) => {
    const influence = PLANET_CHARACTERISTICS[`${planet}-влияние-${area}`];
    if (influence) {
      acc[area] = `${planet} в ${data.sign} влияет на ${influence}...`;
    }
    return acc;
  }, {});
}

function generateAspectInterpretation(aspect) {
  const aspectType = ASPECT_INTERPRETATIONS[aspect.aspect];
  return `${aspect.planet1} в ${aspect.aspect}е с ${aspect.planet2} создает ${aspectType.nature} влияние. 
          ${aspectType.interpretation}`;
}

function generateAspectInfluence(aspect) {
  return {
    личность: `Влияние на развитие личности...`,
    отношения: `Влияние на построение отношений...`,
    творчество: `Влияние на творческий потенциал...`
  };
}

function generateHouseInterpretation(houseNumber, data) {
  const house = HOUSE_MEANINGS[`${houseNumber}-название`];
  const keywords = HOUSE_MEANINGS[`${houseNumber}-ключевые-слова`];
  return `${house} в ${data.sign} указывает на ${keywords}...`;
}

function generateHouseRecommendations(houseNumber, data) {
  const areas = HOUSE_MEANINGS[`${houseNumber}-области`].split(', ');
  return areas.map(area => `Развивайте ${area}...`);
}

function generateNodeInterpretation(nodeType, data) {
  if (nodeType === "north") {
    return `Ваша кармическая задача в ${data.sign} связана с развитием...`;
  } else {
    return `Ваш прошлый опыт в ${data.sign} указывает на...`;
  }
}

function generateDevelopmentPath(positions, aspects, houses, karmicFactors) {
  return {
    strengths: generateStrengths(positions, aspects),
    challenges: generateChallenges(positions, aspects),
    recommendations: generateRecommendations(positions, aspects, houses, karmicFactors)
  };
}

function generateStrengths(positions, aspects) {
  return [
    "Сильная воля и способность к самовыражению",
    "Творческий потенциал и интуиция",
    "Способность к глубокому анализу"
  ];
}

function generateChallenges(positions, aspects) {
  return [
    "Управление эмоциональными реакциями",
    "Построение границ в отношениях",
    "Реализация творческого потенциала"
  ];
}

function generateRecommendations(positions, aspects, houses, karmicFactors) {
  return [
    "Развивайте самодисциплину и организованность",
    "Учитесь выражать эмоции конструктивно",
    "Практикуйте медитацию и самопознание"
  ];
}

function generatePositionDetails(planet, data) {
  const keywords = PLANET_CHARACTERISTICS[`${planet}-ключевые-слова`].split(', ')[0];
  return `Это положение усиливает ваши способности в области ${keywords}...`;
} 