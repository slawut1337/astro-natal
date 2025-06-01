import { useState } from "react";
import { motion } from "framer-motion";

export default function BirthForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    birthDate: "",
    birthTime: "",
    birthPlace: ""
  });

  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClasses = "w-full p-3 border rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-indigo-700 mb-1";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl space-y-6 border border-indigo-100"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-indigo-800">✨ Данные рождения</h2>
        <p className="text-indigo-600/70 mt-2">Введите точные данные для расчёта натальной карты</p>
      </div>

      <div>
        <label htmlFor="name" className={labelClasses}>
          Имя
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Введите ваше имя"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="gender" className={labelClasses}>
          Пол
        </label>
        <select
          id="gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses}
          required
        >
          <option value="">Выберите пол</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="birthDate" className={labelClasses}>
            Дата рождения
          </label>
          <input
            id="birthDate"
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label htmlFor="birthTime" className={labelClasses}>
            Время рождения
          </label>
          <input
            id="birthTime"
            type="time"
            name="birthTime"
            value={form.birthTime}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="birthPlace" className={labelClasses}>
          Место рождения
        </label>
        <input
          id="birthPlace"
          type="text"
          name="birthPlace"
          placeholder="Например: Москва, Россия"
          value={form.birthPlace}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses}
          required
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 mt-8"
      >
        Рассчитать натальную карту
      </motion.button>
    </motion.form>
  );
}
