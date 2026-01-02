import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });
export default <T>(key: string, defaultValue?: T): T => {
  if (process.env[key] === undefined) {
    if (defaultValue) return defaultValue as T;
    throw new Error(`Missing environment variable - "${key}"`);
  }

  return process.env[key] as T;
};
