export async function getCoordinatesByCity(cityName) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      cityName
    )}&format=json&limit=1`;
  
    const response = await fetch(url, {
      headers: {
        "User-Agent": "astro-natal-app"
      }
    });
  
    if (!response.ok) {
      throw new Error("Ошибка при получении координат");
    }
  
    const data = await response.json();
  
    if (!data || data.length === 0) {
      throw new Error("Город не найден");
    }
  
    const { lat, lon } = data[0];
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    };
  }
  