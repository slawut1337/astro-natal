import { julian, planetposition, data, solar, moonposition } from 'astronomia';
import { DateTime } from 'luxon';

// Таблица знаков
const zodiacSigns = [
  "Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева",
  "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"
];

// Базовые интерпретации планет в знаках
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
  Луна: {
    Овен: "Эмоциональная импульсивность, активность в выражении чувств",
    Телец: "Эмоциональная стабильность, потребность в комфорте",
    Близнецы: "Эмоциональная подвижность, общительность",
    Рак: "Глубокая эмоциональность, развитая интуиция",
    Лев: "Эмоциональная щедрость, потребность в признании",
    Дева: "Эмоциональная сдержанность, практичность в чувствах",
    Весы: "Стремление к гармоничным отношениям, дипломатичность",
    Скорпион: "Глубина чувств, эмоциональная интенсивность",
    Стрелец: "Эмоциональная свобода, оптимизм",
    Козерог: "Эмоциональная сдержанность, ответственность",
    Водолей: "Эмоциональная независимость, оригинальность",
    Рыбы: "Чувствительность, эмпатия, интуитивность"
  },
  Меркурий: {
    Овен: "Быстрое мышление, прямолинейность в общении",
    Телец: "Практичный ум, основательность в мышлении",
    Близнецы: "Живой ум, коммуникабельность, любознательность",
    Рак: "Интуитивное мышление, эмоциональное восприятие информации",
    Лев: "Творческое мышление, уверенная самопрезентация",
    Дева: "Аналитический ум, внимание к деталям",
    Весы: "Дипломатичность в общении, стремление к справедливости",
    Скорпион: "Проницательность ума, исследовательские способности",
    Стрелец: "Философский склад ума, стремление к знаниям",
    Козерог: "Структурированное мышление, практичность",
    Водолей: "Оригинальное мышление, изобретательность",
    Рыбы: "Интуитивное мышление, творческое воображение"
  },
  Венера: {
    Овен: "Страстность в любви, прямота в выражении чувств",
    Телец: "Чувственность, стремление к красоте и комфорту",
    Близнецы: "Общительность в любви, интеллектуальная совместимость",
    Рак: "Эмоциональная глубина в отношениях, забота",
    Лев: "Романтичность, щедрость в любви",
    Дева: "Практичность в отношениях, внимание к деталям",
    Весы: "Гармония в отношениях, дипломатичность",
    Скорпион: "Страстность, глубина чувств",
    Стрелец: "Свобода в любви, оптимизм",
    Козерог: "Серьезность в отношениях, верность",
    Водолей: "Необычный подход к отношениям, дружелюбие",
    Рыбы: "Романтичность, идеализм в любви"
  },
  Марс: {
    Овен: "Сильная энергия, лидерские качества",
    Телец: "Практическая энергия, упорство",
    Близнецы: "Интеллектуальная активность, многозадачность",
    Рак: "Эмоциональная мотивация, защита близких",
    Лев: "Творческая энергия, амбициозность",
    Дева: "Методичность действий, трудолюбие",
    Весы: "Дипломатичные действия, стремление к справедливости",
    Скорпион: "Мощная энергия, стратегическое мышление",
    Стрелец: "Энтузиазм, стремление к приключениям",
    Козерог: "Целеустремленность, дисциплина",
    Водолей: "Необычные способы действия, независимость",
    Рыбы: "Интуитивные действия, духовная энергия"
  }
};

function getZodiacSign(deg) {
  const index = Math.floor(deg / 30) % 12;
  return zodiacSigns[index];
}

function getExactDegree(deg) {
  return (deg % 30).toFixed(2);
}

function getAspects(planets) {
  const aspects = [];
  const orbs = {
    conjunction: 8, // соединение
    opposition: 8, // оппозиция
    trine: 8, // трин
    square: 7, // квадрат
    sextile: 6 // секстиль
  };

  const planetPairs = Object.entries(planets);
  for (let i = 0; i < planetPairs.length; i++) {
    for (let j = i + 1; j < planetPairs.length; j++) {
      const [planet1, pos1] = planetPairs[i];
      const [planet2, pos2] = planetPairs[j];

      const angle = Math.abs(pos1.degree - pos2.degree);
      
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

export async function calculatePlanets({ date, time, latitude, longitude }) {
  // Соединяем дату и время
  const dt = DateTime.fromISO(`${date}T${time}`, { zone: 'UTC' });

  // Юлианская дата
  const jd = julian.Calendar.jd(dt.toJSDate());

  // Эфемериды планет
  const earth = new planetposition.Planet(data.earth);
  const venus = new planetposition.Planet(data.vsop87Venus);
  const mars = new planetposition.Planet(data.vsop87Mars);
  const jupiter = new planetposition.Planet(data.vsop87Jupiter);
  const saturn = new planetposition.Planet(data.vsop87Saturn);
  const sunLon = solar.apparentLongitude(earth, jd);
  const moonLon = moonposition.position(jd).lon;
  const venusLon = venus.position2000(jd).lon;
  const marsLon = mars.position2000(jd).lon;
  const jupiterLon = jupiter.position2000(jd).lon;
  const saturnLon = saturn.position2000(jd).lon;

  const planetPositions = {
    Солнце: { sign: getZodiacSign(sunLon), degree: getExactDegree(sunLon) },
    Луна: { sign: getZodiacSign(moonLon), degree: getExactDegree(moonLon) },
    Венера: { sign: getZodiacSign(venusLon), degree: getExactDegree(venusLon) },
    Марс: { sign: getZodiacSign(marsLon), degree: getExactDegree(marsLon) },
    Юпитер: { sign: getZodiacSign(jupiterLon), degree: getExactDegree(jupiterLon) },
    Сатурн: { sign: getZodiacSign(saturnLon), degree: getExactDegree(saturnLon) },
  };

  const aspects = getAspects(planetPositions);

  // Добавляем интерпретации для каждой планеты
  const interpretedPositions = {};
  for (const [planet, position] of Object.entries(planetPositions)) {
    interpretedPositions[planet] = {
      ...position,
      interpretation: interpretations[planet]?.[position.sign] || "Требуется дополнительный анализ"
    };
  }

  return {
    positions: interpretedPositions,
    aspects: aspects
  };
}
