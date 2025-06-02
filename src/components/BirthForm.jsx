import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, icon, ...props }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-indigo-900/80 mb-1.5">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500/50 group-focus-within:text-indigo-600">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-indigo-100 bg-white/50 backdrop-blur-sm 
                 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                 transition-all duration-200 ease-in-out
                 placeholder:text-indigo-300 text-indigo-900
                 shadow-sm hover:shadow-md focus:shadow-lg"
      />
      <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  </div>
);

export default function BirthForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: ''
  });

  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="w-full max-w-md mx-auto"
        initial="hidden"
        animate="visible"
        variants={formContainerVariants}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20"
          variants={formContainerVariants}
        >
          <motion.div className="space-y-5" variants={formContainerVariants}>
            <motion.div variants={formItemVariants}>
              <InputField
                label="Ваше имя"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>}
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Введите ваше имя"
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={formItemVariants}>
                <InputField
                  label="Дата рождения"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>}
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('birthDate')}
                  onBlur={() => setFocusedField(null)}
                />
              </motion.div>

              <motion.div variants={formItemVariants}>
                <InputField
                  label="Время рождения"
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>}
                  type="time"
                  id="birthTime"
                  name="birthTime"
                  required
                  value={formData.birthTime}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('birthTime')}
                  onBlur={() => setFocusedField(null)}
                />
              </motion.div>
            </div>

            <motion.div variants={formItemVariants}>
              <InputField
                label="Место рождения"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>}
                type="text"
                id="birthPlace"
                name="birthPlace"
                required
                value={formData.birthPlace}
                onChange={handleChange}
                onFocus={() => setFocusedField('birthPlace')}
                onBlur={() => setFocusedField(null)}
                placeholder="Например: Москва"
              />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <label className="block text-sm font-medium text-indigo-900/80 mb-1.5">
                Пол
              </label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'gender', value: 'male' } })}
                  className={`relative group overflow-hidden px-4 py-2.5 rounded-xl border-2 transition-all duration-200 
                    ${formData.gender === 'male'
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'border-indigo-100 bg-white/50 text-indigo-900 hover:border-indigo-300'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Мужской
                  </span>
                  {formData.gender !== 'male' && (
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'gender', value: 'female' } })}
                  className={`relative group overflow-hidden px-4 py-2.5 rounded-xl border-2 transition-all duration-200 
                    ${formData.gender === 'female'
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'border-indigo-100 bg-white/50 text-indigo-900 hover:border-indigo-300'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Женский
                  </span>
                  {formData.gender !== 'female' && (
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className={`relative w-full group overflow-hidden px-6 py-3 rounded-xl text-white font-medium transition-all duration-200
              ${isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
              }`}
            whileHover={!isLoading ? { scale: 1.01 } : {}}
            whileTap={!isLoading ? { scale: 0.99 } : {}}
            variants={formItemVariants}
          >
            <span className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Расчет...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Рассчитать натальную карту
                </>
              )}
            </span>
            {!isLoading && (
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
