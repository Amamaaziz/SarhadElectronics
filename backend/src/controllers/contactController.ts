import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { db, checkFirebaseConnection } from '../config/firebase';
import { memoryMessages, saveMessagesToDisk } from '../services/productService';

export const submitContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      sendError(res, 'All fields (Full Name, Email, Subject, Message) are required', 400);
      return;
    }

    const isDbLive = await checkFirebaseConnection();

    if (isDbLive) {
      try {
        const msgRef = db.collection('contact_messages').doc();
        const contact = {
          id: msgRef.id,
          fullName,
          email,
          subject,
          message,
          status: 'UNREAD' as const,
          createdAt: new Date().toISOString(),
        };

        await msgRef.set(contact);
        memoryMessages.unshift(contact);
        saveMessagesToDisk();
        sendSuccess(res, contact, 'Message sent successfully! We will get back to you shortly.', 201);
        return;
      } catch (err) {
        console.warn('⚠️ Firestore submitContactMessage error, saving to disk:', err);
      }
    }

    // Local persistent disk storage
    const newMsg = {
      id: `msg-${Date.now()}`,
      fullName,
      email,
      subject,
      message,
      status: 'UNREAD' as const,
      createdAt: new Date().toISOString(),
    };
    memoryMessages.unshift(newMsg);
    saveMessagesToDisk();

    sendSuccess(res, newMsg, 'Message sent successfully! We will get back to you shortly.', 201);
  } catch (error: any) {
    sendError(res, 'Failed to submit contact message', 500, error);
  }
};

export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const isDbLive = await checkFirebaseConnection();

    if (isDbLive) {
      try {
        const snapshot = await db.collection('contact_messages').orderBy('createdAt', 'desc').get();
        const messages = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        sendSuccess(res, messages);
        return;
      } catch (err) {
        console.warn('⚠️ Firestore getContactMessages error, reading from disk:', err);
      }
    }

    sendSuccess(res, memoryMessages);
  } catch (error: any) {
    sendError(res, 'Failed to retrieve messages', 500, error);
  }
};
