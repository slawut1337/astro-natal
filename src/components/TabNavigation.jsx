import React from 'react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'natal', icon: '🌟', label: 'Натальная карта' },
  { id: 'forecast', icon: '🔮', label: 'Прогноз на месяц' },
  { id: 'compatibility', icon: '❤️', label: 'Совместимость' },
  { id: 'learning', icon: '📚', label: 'Уроки астрологии' },
  { id: 'blog', icon: '✍️', label: 'Статьи' }
];

export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="relative mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex flex-nowrap overflow-x-auto pb-4 sm:pb-0 gap-2 sm:gap-4 hide-scrollbar">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-white/10 hover:bg-white/20 text-indigo-900'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
              
              {/* Индикатор активной вкладки */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Эффект при наведении */}
              <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </nav>
      </div>
      
      {/* Декоративная линия */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200/20 to-transparent" />
    </div>
  );
}

// Стили для скрытия скроллбара
const styles = `
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

// Добавляем стили в head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
} 