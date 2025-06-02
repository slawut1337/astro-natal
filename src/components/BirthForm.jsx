import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDate = (value) => {
  if (!value) return '';
  
  // Убираем все нецифровые символы
  const nums = value.replace(/\D/g, '').slice(0, 8);
  
  // Обрабатываем дни (01-31)
  if (nums.length >= 2) {
    const days = parseInt(nums.slice(0, 2), 10);
    if (days > 31) return '31' + (nums.length > 2 ? '.' + nums.slice(2) : '');
    if (days === 0) return '01' + (nums.length > 2 ? '.' + nums.slice(2) : '');
  }
  
  // Обрабатываем месяцы (01-12)
  if (nums.length >= 4) {
    const months = parseInt(nums.slice(2, 4), 10);
    if (months > 12) {
      return nums.slice(0, 2) + '.12' + (nums.length > 4 ? '.' + nums.slice(4) : '');
    }
    if (months === 0) {
      return nums.slice(0, 2) + '.01' + (nums.length > 4 ? '.' + nums.slice(4) : '');
    }
  }
  
  // Форматируем строку с точками
  if (nums.length <= 2) return nums;
  if (nums.length <= 4) return `${nums.slice(0, 2)}.${nums.slice(2)}`;
  return `${nums.slice(0, 2)}.${nums.slice(2, 4)}.${nums.slice(4)}`;
};

const formatTime = (value) => {
  if (!value) return '';
  
  // Убираем все нецифровые символы
  const nums = value.replace(/\D/g, '').slice(0, 4);
  
  // Обрабатываем часы (00-23)
  if (nums.length >= 2) {
    const hours = parseInt(nums.slice(0, 2), 10);
    if (hours > 23) return '23' + (nums.length > 2 ? ':' + nums.slice(2) : '');
  }
  
  // Обрабатываем минуты (00-59)
  if (nums.length >= 4) {
    const minutes = parseInt(nums.slice(2, 4), 10);
    if (minutes > 59) return nums.slice(0, 2) + ':59';
  }
  
  // Форматируем строку с двоеточием
  if (nums.length <= 2) return nums;
  return `${nums.slice(0, 2)}:${nums.slice(2)}`;
};

const validateDate = (date) => {
  if (!date) return false;
  const [day, month, year] = date.split('.');
  if (!day || !month || !year) return false;
  
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  
  if (y < 1900 || y > new Date().getFullYear()) return false;
  if (m < 1 || m > 12) return false;
  
  // Проверяем количество дней в конкретном месяце
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d < 1 || d > daysInMonth) return false;
  
  return true;
};

const validateTime = (time) => {
  if (!time) return false;
  const [hours, minutes] = time.split(':');
  if (!hours || !minutes) return false;
  
  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);
  
  if (h < 0 || h > 23) return false;
  if (m < 0 || m > 59) return false;
  
  return true;
};

const InputField = ({ label, icon, error, type, onChange, value, ...props }) => {
  const handleKeyDown = (e) => {
    if (type === 'date' || type === 'time') {
      // Разрешаем: цифры, точки, двоеточия, backspace, delete, стрелки
      if (!/[\d.:]/.test(e.key) && 
          !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        e.preventDefault();
      }
      
      // Дополнительная проверка для даты
      if (type === 'date') {
        const currentValue = e.target.value;
        if (e.key >= '0' && e.key <= '9') {
          // Проверяем дни
          if (currentValue.length === 0 && e.key > '3') {
            e.preventDefault();
          }
          if (currentValue.length === 1 && currentValue[0] === '3' && e.key > '1') {
            e.preventDefault();
          }
          // Проверяем месяцы
          if (currentValue.length === 3 && e.key > '1') {
            e.preventDefault();
          }
          if (currentValue.length === 4 && currentValue[3] === '1' && e.key > '2') {
            e.preventDefault();
          }
        }
      }
      
      // Дополнительная проверка для времени
      if (type === 'time') {
        const currentValue = e.target.value;
        if (e.key >= '0' && e.key <= '9') {
          // Проверяем часы
          if (currentValue.length === 0 && e.key > '2') {
            e.preventDefault();
          }
          if (currentValue.length === 1 && currentValue[0] === '2' && e.key > '3') {
            e.preventDefault();
          }
          // Проверяем минуты
          if (currentValue.length === 3 && e.key > '5') {
            e.preventDefault();
          }
        }
      }
    }
  };

  const handleChange = (e) => {
    let newValue = e.target.value;
    
    if (type === 'date') {
      newValue = formatDate(newValue);
    } else if (type === 'time') {
      newValue = formatTime(newValue);
    }
    
    onChange({ target: { name: props.name, value: newValue } });
  };

  const getPlaceholder = () => {
    if (type === 'date') return 'ДД.ММ.ГГГГ';
    if (type === 'time') return 'ЧЧ:ММ';
    return props.placeholder;
  };

  return (
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
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-indigo-100 bg-white/50 backdrop-blur-sm 
                   focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                   transition-all duration-200 ease-in-out
                   placeholder:text-indigo-300 text-indigo-900
                   shadow-sm hover:shadow-md focus:shadow-lg
                   text-base sm:text-sm"
        />
        <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

const formatDateForDisplay = (date) => {
  if (!date) return '';
  try {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  } catch {
    return date;
  }
};

const formatDateForSubmit = (date) => {
  if (!date) return '';
  try {
    const [day, month, year] = date.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch {
    return date;
  }
};

export default function BirthForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: ''
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Введите ваше имя';
    if (!validateDate(formData.birthDate)) newErrors.birthDate = 'Введите корректную дату в формате ДД.ММ.ГГГГ';
    if (!validateTime(formData.birthTime)) newErrors.birthTime = 'Введите корректное время в формате ЧЧ:ММ';
    if (!formData.birthPlace.trim()) newErrors.birthPlace = 'Укажите место рождения';
    if (!formData.gender) newErrors.gender = 'Выберите пол';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Преобразуем дату в формат YYYY-MM-DD перед отправкой
      const submissionData = {
        ...formData,
        birthDate: formatDateForSubmit(formData.birthDate)
      };
      onSubmit(submissionData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Если поле - дата и значение похоже на ISO формат, преобразуем его
    if (name === 'birthDate' && value.includes('-')) {
      newValue = formatDateForDisplay(value);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

  const handleFocus = (field) => {
    setFocusedField(field);
    // Очищаем ошибку при фокусе
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="w-full max-w-md mx-auto px-4 sm:px-0"
        initial="hidden"
        animate="visible"
        variants={formContainerVariants}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20"
          variants={formContainerVariants}
        >
          <motion.div className="space-y-6" variants={formContainerVariants}>
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
                onFocus={() => handleFocus('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Введите ваше имя"
                error={errors.name}
              />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  onFocus={() => handleFocus('birthDate')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.birthDate}
                  maxLength={10}
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
                  onFocus={() => handleFocus('birthTime')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.birthTime}
                  maxLength={5}
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
                error={errors.birthPlace}
              />
            </motion.div>

            <motion.div variants={formItemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-indigo-900/80 mb-1.5">
                Пол
              </label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() => {
                    handleChange({ target: { name: 'gender', value: 'male' } });
                    if (errors.gender) setErrors(prev => ({ ...prev, gender: '' }));
                  }}
                  className={`relative group overflow-hidden px-4 py-3 rounded-xl border-2 transition-all duration-200 
                    ${formData.gender === 'male'
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'border-indigo-100 bg-white/50 text-indigo-900 hover:border-indigo-300'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-sm">
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
                  onClick={() => {
                    handleChange({ target: { name: 'gender', value: 'female' } });
                    if (errors.gender) setErrors(prev => ({ ...prev, gender: '' }));
                  }}
                  className={`relative group overflow-hidden px-4 py-3 rounded-xl border-2 transition-all duration-200 
                    ${formData.gender === 'female'
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'border-indigo-100 bg-white/50 text-indigo-900 hover:border-indigo-300'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-sm">
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
              {errors.gender && (
                <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
              )}
            </motion.div>

            <motion.div variants={formItemVariants}>
              <motion.button
                type="submit"
                className={`w-full px-6 py-3 rounded-xl text-white font-medium
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  hover:from-indigo-600 hover:to-purple-600
                  focus:ring-2 focus:ring-indigo-500/20
                  transition-all duration-200 shadow-md hover:shadow-lg
                  flex items-center justify-center gap-2 text-base sm:text-sm
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Обработка...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Построить карту
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
