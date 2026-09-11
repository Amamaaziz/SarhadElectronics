import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { db, checkFirebaseConnection } from '../config/firebase';
import { memorySubscribers, saveSubscribersToDisk } from '../services/productService';

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      sendError(res, 'A valid email address is required', 400);
      return;
    }

    const emailNormalized = email.toLowerCase().trim();
    const isDbLive = await checkFirebaseConnection();

    if (isDbLive) {
      try {
        const existingSnap = await db
          .collection('subscribers')
          .where('email', '==', emailNormalized)
          .limit(1)
          .get();

        if (!existingSnap.empty) {
          const existing = { id: existingSnap.docs[0].id, ...existingSnap.docs[0].data() };
          sendSuccess(res, existing, 'You are already subscribed to our newsletter!');
          return;
        }

        const subRef = db.collection('subscribers').doc();
        const subscriber = {
          id: subRef.id,
          email: emailNormalized,
          subscribedAt: new Date().toISOString(),
        };

        await subRef.set(subscriber);
        memorySubscribers.push(subscriber);
        saveSubscribersToDisk();
        sendSuccess(res, subscriber, 'Successfully subscribed to Sarhad Electrics newsletter!', 201);
        return;
      } catch (err) {
        console.warn('⚠️ Firestore subscribe error, saving to disk:', err);
      }
    }

    const existing = memorySubscribers.find((s) => s.email === emailNormalized);
    if (existing) {
      sendSuccess(res, existing, 'You are already subscribed to our newsletter!');
      return;
    }

    const subscriber = {
      id: `sub-${Date.now()}`,
      email: emailNormalized,
      subscribedAt: new Date().toISOString(),
    };
    memorySubscribers.push(subscriber);
    saveSubscribersToDisk();

    sendSuccess(res, subscriber, 'Successfully subscribed to Sarhad Electrics newsletter!', 201);
  } catch (error: any) {
    sendError(res, 'Subscription failed', 500, error);
  }
};

export const getSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const isDbLive = await checkFirebaseConnection();

    if (isDbLive) {
      try {
        const snapshot = await db.collection('subscribers').orderBy('subscribedAt', 'desc').get();
        const subscribers = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        sendSuccess(res, subscribers);
        return;
      } catch (err) {
        console.warn('⚠️ Firestore getSubscribers error, reading from disk:', err);
      }
    }

    sendSuccess(res, memorySubscribers);
  } catch (error: any) {
    sendError(res, 'Failed to fetch subscribers', 500, error);
  }
};
