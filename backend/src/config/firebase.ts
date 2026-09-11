import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';

let isFirebaseInitialized = false;

const initFirebase = (): App | null => {
  if (getApps().length > 0) {
    isFirebaseInitialized = true;
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'sarhad-electronics-97abe';
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'sarhad-electronics-97abe.firebasestorage.app';

  // 1. Check direct JSON string in environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      const app = initializeApp({
        credential: cert(parsed),
        projectId: parsed.project_id || projectId,
        storageBucket,
      });
      isFirebaseInitialized = true;
      console.log('🔥 Firebase Admin initialized via FIREBASE_SERVICE_ACCOUNT_KEY env');
      return app;
    } catch (e) {
      console.warn('⚠️ Could not parse FIREBASE_SERVICE_ACCOUNT_KEY env string:', e);
    }
  }

  // 2. Check file path in environment variable or default locations
  const possiblePaths = [
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    path.resolve(process.cwd(), 'serviceAccountKey.json'),
    path.resolve(process.cwd(), 'backend', 'serviceAccountKey.json'),
    path.resolve(__dirname, '../../serviceAccountKey.json'),
    path.resolve(__dirname, '../../../serviceAccountKey.json'),
  ].filter(Boolean) as string[];

  for (const keyPath of possiblePaths) {
    if (fs.existsSync(keyPath)) {
      try {
        const fileContent = fs.readFileSync(keyPath, 'utf8');
        const serviceAccount = JSON.parse(fileContent);
        const app = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id || projectId,
          storageBucket,
        });
        isFirebaseInitialized = true;
        console.log(`🔥 Firebase Admin initialized with service account from: ${keyPath}`);
        return app;
      } catch (err) {
        console.error(`⚠️ Failed to load Firebase credentials from ${keyPath}:`, err);
      }
    }
  }

  // 3. Fallback: Initialize with project ID
  try {
    const app = initializeApp({
      projectId,
      storageBucket,
    });
    isFirebaseInitialized = true;
    console.log(`🔥 Firebase Admin initialized with project ID: ${projectId} (waiting for serviceAccountKey.json for authenticated access)`);
    return app;
  } catch (err) {
    console.warn('⚠️ Firebase Admin default initialization error:', err);
    return null;
  }
};

const app = initFirebase();

export const db: Firestore = app ? getFirestore(app) : ({} as Firestore);
try {
  if (db && typeof db.settings === 'function') {
    db.settings({ ignoreUndefinedProperties: true });
  }
} catch {
  // Settings may already be locked in certain environments
}

export const auth: Auth = app ? getAuth(app) : ({} as Auth);
export const storage: Storage = app ? getStorage(app) : ({} as Storage);

export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    if (!isFirebaseInitialized || !db || typeof db.listCollections !== 'function') return false;
    await db.listCollections();
    return true;
  } catch {
    return false;
  }
};

export { app };
export default app;

