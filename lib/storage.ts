import AsyscStorage from "@react-native-async-storage/async-storage";

// Tpyed Key names to prevent typos

export const STORAGE_KEYS = {
  PROFILE: "profile",
  NOTIFICATIONS: "notifications",
} as const;

// Get a value from storage (automatically parses JSON)

export const get = async <T>(key: string): Promise<T | null> => {
  const value = await AsyscStorage.getItem(key);
  if (value === null) return null;
  return JSON.parse(value) as T;
};


// Set a value from storage (automatically parses JSON)

export const set = async(key: string, value: unknown): Promise<void> => {
    await AsyscStorage.setItem(key, JSON.stringify(value) )
}

// Remove a value from storage 
export const remove = async(key: string) : Promise<void> =>{
    await AsyscStorage.removeItem(key)
}