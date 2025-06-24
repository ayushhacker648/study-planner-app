const STORAGE_KEY = 'study-planner-data';
const SETTINGS_KEY = 'study-planner-settings';

// Enhanced storage with error handling and data validation
export const saveToStorage = (subjects) => {
  try {
    const dataToSave = {
      subjects,
      lastUpdated: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

export const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsedData = JSON.parse(data);
    
    // Handle both old and new data formats
    if (Array.isArray(parsedData)) {
      // Old format - just subjects array
      return parsedData;
    } else if (parsedData.subjects) {
      // New format - object with metadata
      return parsedData.subjects;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
};

export const loadSettings = () => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : {
      pomodoroWorkTime: 25,
      pomodoroBreakTime: 5,
      pomodoroLongBreakTime: 15,
      pomodoroSessions: 4,
      notifications: true
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return {
      pomodoroWorkTime: 25,
      pomodoroBreakTime: 5,
      pomodoroLongBreakTime: 15,
      pomodoroSessions: 4,
      notifications: true
    };
  }
};

export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
};

export const exportData = () => {
  try {
    const subjects = loadFromStorage();
    const settings = loadSettings();
    const exportData = {
      subjects,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Failed to export data:', error);
    return null;
  }
};

export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.subjects) {
      saveToStorage(data.subjects);
    }
    if (data.settings) {
      saveSettings(data.settings);
    }
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Auto-save functionality
export const enableAutoSave = (callback, interval = 30000) => {
  return setInterval(callback, interval);
};

export const disableAutoSave = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};