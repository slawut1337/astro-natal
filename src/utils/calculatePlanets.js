import { calculateNatalChart } from './astronomyCalculator';

export async function calculatePlanets(birthData) {
  console.log('Input birthData:', birthData); // Отладочный вывод входных данных
  
  const result = await calculateNatalChart({ 
    date: birthData.date, 
    time: birthData.time, 
    latitude: birthData.latitude, 
    longitude: birthData.longitude 
  });
  
  console.log('Calculated positions:', result.positions); // Отладочный вывод результата
  
  return result;
}
