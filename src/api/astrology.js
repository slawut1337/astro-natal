const API_BASE_URL = 'https://api.astrology.com/v1';
const API_KEY = process.env.REACT_APP_ASTROLOGY_API_KEY;

export async function calculateNatalChart({ date, time, latitude, longitude }) {
  try {
    const response = await fetch(`${API_BASE_URL}/horoscope/natal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        datetime: `${date}T${time}`,
        latitude,
        longitude,
        timezone: 'UTC'
      })
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении данных гороскопа');
    }

    const data = await response.json();
    return transformApiResponse(data);
  } catch (error) {
    console.error('Ошибка при расчете натальной карты:', error);
    throw new Error('Не удалось рассчитать натальную карту. Пожалуйста, попробуйте позже.');
  }
}

function transformApiResponse(apiData) {
  const positions = {
    Солнце: transformPlanetData(apiData.planets.sun),
    Луна: transformPlanetData(apiData.planets.moon),
    Венера: transformPlanetData(apiData.planets.venus),
    Марс: transformPlanetData(apiData.planets.mars),
    Юпитер: transformPlanetData(apiData.planets.jupiter),
    Сатурн: transformPlanetData(apiData.planets.saturn)
  };

  return {
    positions,
    aspects: transformAspects(apiData.aspects)
  };
}

function transformPlanetData(planetData) {
  const longitude = planetData.position;
  return {
    sign: getZodiacSignName(planetData.sign),
    degree: planetData.position.toFixed(2),
    longitude: longitude,
    interpretation: getInterpretation(planetData.planet, planetData.sign)
  };
}

function getZodiacSignName(signNumber) {
  const signs = [
    "Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева",
    "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"
  ];
  return signs[signNumber - 1];
}

function transformAspects(apiAspects) {
  return apiAspects.map(aspect => ({
    aspect: getAspectName(aspect.type),
    planet1: getPlanetName(aspect.planet1),
    planet2: getPlanetName(aspect.planet2),
    angle: aspect.angle.toFixed(2)
  }));
}

function getAspectName(type) {
  const aspectTypes = {
    conjunction: "соединение",
    opposition: "оппозиция",
    trine: "трин",
    square: "квадрат",
    sextile: "секстиль"
  };
  return aspectTypes[type] || type;
}

function getPlanetName(planetKey) {
  const planets = {
    sun: "Солнце",
    moon: "Луна",
    venus: "Венера",
    mars: "Марс",
    jupiter: "Юпитер",
    saturn: "Сатурн"
  };
  return planets[planetKey] || planetKey;
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