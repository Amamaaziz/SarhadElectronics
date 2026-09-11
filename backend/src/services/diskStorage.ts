import * as fs from 'fs';
import * as path from 'path';

// Locate data directory in backend/data or root/data
const DATA_DIR = path.resolve(process.cwd(), 'data');

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.warn('⚠️ Could not create data directory:', e);
    }
  }
};

export const readJsonFile = <T>(fileName: string, fallback: T): T => {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(fallback) && Array.isArray(parsed)) {
        return parsed as T;
      }
      if (parsed && typeof parsed === 'object') {
        return parsed as T;
      }
    }
  } catch (err) {
    console.warn(`⚠️ Error reading ${fileName} from disk:`, err);
  }
  return fallback;
};

export const writeJsonFile = <T>(fileName: string, data: T): void => {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`⚠️ Error writing ${fileName} to disk:`, err);
  }
};

