export async function getTimezoneByCoords(latitude, longitude) {
    const url = `https://www.timeapi.io/api/TimeZone/coordinate?latitude=${latitude}&longitude=${longitude}`;
  
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error("Не удалось получить временную зону");
    }
  
    const data = await response.json();
  
    return {
      timezone: data.timeZone,
      offset: data.currentUtcOffset,
    };
  }
  