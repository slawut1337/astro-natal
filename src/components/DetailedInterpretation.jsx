import React from 'react';
import { motion } from 'framer-motion';
import {
  planetInSignInterpretations,
  lifeAreasInterpretations,
  developmentRecommendations,
  karmicPurpose
} from '../utils/astro-interpretations';
import { getZodiacSign } from '../utils/zodiac';

export default function DetailedInterpretation({ data }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardHover = {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  };

  const Section = ({ title, children, icon }) => (
    <motion.div
      variants={item}
      className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:border-white/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );

  const PlanetCard = ({ planet, info }) => (
    <motion.div
      whileHover={cardHover}
      className="bg-white/30 rounded-xl p-5 shadow-lg border border-white/20 hover:border-white/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{info.icon || '✨'}</span>
        <h4 className="text-lg font-semibold text-indigo-900">
          {planet} в {info.sign}
        </h4>
      </div>
      <p className="text-indigo-800/90 leading-relaxed">
        {planetInSignInterpretations[planet]?.[info.sign] || 
         "Индивидуальное влияние этой планеты в данном знаке."}
      </p>
    </motion.div>
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto px-4 py-8 space-y-10"
    >
      <div className="text-center">
        <motion.h2 
          className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900 mb-2 sm:mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Интерпретация натальной карты
        </motion.h2>
        <motion.p 
          className="text-sm sm:text-base text-indigo-600/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Подробный анализ положения планет в момент вашего рождения
        </motion.p>
      </div>

      <Section title="Ключевые характеристики личности" icon="🌟">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(data.planets || {}).map(([planet, position]) => (
            <PlanetCard 
              key={planet} 
              planet={planet} 
              info={{
                sign: getZodiacSign(position),
                position: position
              }}
            />
          ))}
        </div>
      </Section>

      <Section title="Сферы жизни" icon="🎯">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={cardHover}
            className="bg-white/30 rounded-xl p-5 shadow-lg border border-white/20 hover:border-white/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💼</span>
              <h4 className="text-lg font-semibold text-indigo-900">Карьера</h4>
            </div>
            <p className="text-indigo-800/90 leading-relaxed">
              {lifeAreasInterpretations.карьера?.["Солнце-MC"] || 
               "Ваш путь к профессиональному успеху раскроется через развитие личных талантов."}
            </p>
          </motion.div>

          <motion.div
            whileHover={cardHover}
            className="bg-white/30 rounded-xl p-5 shadow-lg border border-white/20 hover:border-white/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">❤️</span>
              <h4 className="text-lg font-semibold text-indigo-900">Отношения</h4>
            </div>
            <p className="text-indigo-800/90 leading-relaxed">
              {lifeAreasInterpretations.отношения?.["Венера-Асцендент"] || 
               "В отношениях важно найти баланс между личной свободой и близостью."}
            </p>
          </motion.div>

          <motion.div
            whileHover={cardHover}
            className="bg-white/30 rounded-xl p-5 shadow-lg border border-white/20 hover:border-white/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💰</span>
              <h4 className="text-lg font-semibold text-indigo-900">Финансы</h4>
            </div>
            <p className="text-indigo-800/90 leading-relaxed">
              {lifeAreasInterpretations.финансы?.["Венера-2дом"] || 
               "Ваш финансовый успех связан с развитием практических навыков."}
            </p>
          </motion.div>
        </div>
      </Section>

      <Section title="Рекомендации по развитию" icon="🎯">
        <motion.div
          whileHover={cardHover}
          className="bg-white/30 rounded-xl p-5 shadow-lg border border-white/20 hover:border-white/30 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🌱</span>
            <h4 className="text-lg font-semibold text-indigo-900">Личностный рост</h4>
          </div>
          <p className="text-indigo-800/90 leading-relaxed">
            {developmentRecommendations.личностныйРост || 
             "Фокусируйтесь на развитии своих природных талантов и преодолении внутренних ограничений."}
          </p>
        </motion.div>
      </Section>

      <Section title="Кармическое предназначение" icon="🔮">
        <motion.div
          whileHover={cardHover}
          className="bg-white/30 rounded-xl p-5 shadow-lg border border-white/20 hover:border-white/30 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">✨</span>
            <h4 className="text-lg font-semibold text-indigo-900">Ваша миссия</h4>
          </div>
          <p className="text-indigo-800/90 leading-relaxed">
            {karmicPurpose.миссия || 
             "Ваше кармическое предназначение связано с развитием и передачей духовного опыта."}
          </p>
        </motion.div>
      </Section>

      <motion.div 
        className="mt-8 pt-6 sm:pt-8 border-t border-indigo-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="text-center">
          <p className="text-sm sm:text-base text-indigo-600/70 max-w-2xl mx-auto">
            Помните, что натальная карта - это лишь инструмент для самопознания. 
            Ваша судьба находится в ваших руках, а звезды могут лишь подсказать возможные направления развития.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
} 