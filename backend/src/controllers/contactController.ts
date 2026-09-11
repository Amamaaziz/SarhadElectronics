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

export const updateContactMessageStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      sendError(res, 'Message ID and status are required', 400);
      return;
    }

    const validStatuses = ['UNREAD', 'READ', 'REPLIED', 'RESOLVED'];
    const formattedStatus = status.toUpperCase();

    if (!validStatuses.includes(formattedStatus)) {
      sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      return;
    }

    const isDbLive = await checkFirebaseConnection();
    if (isDbLive) {
      try {
        const msgRef = db.collection('contact_messages').doc(id);
        const doc = await msgRef.get();
        if (doc.exists) {
          await msgRef.update({
            status: formattedStatus,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('⚠️ Firestore updateContactMessageStatus error:', err);
      }
    }

    // Update memory & disk
    const memIndex = memoryMessages.findIndex((m) => m.id === id);
    if (memIndex !== -1) {
      memoryMessages[memIndex].status = formattedStatus;
      memoryMessages[memIndex].updatedAt = new Date().toISOString();
      saveMessagesToDisk();
    }

    sendSuccess(res, { id, status: formattedStatus }, `Message status updated to ${formattedStatus}`);
  } catch (error: any) {
    sendError(res, 'Failed to update message status', 500, error);
  }
};

export const deleteContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendError(res, 'Message ID is required', 400);
      return;
    }

    const isDbLive = await checkFirebaseConnection();
    if (isDbLive) {
      try {
        await db.collection('contact_messages').doc(id).delete();
      } catch (err) {
        console.warn('⚠️ Firestore deleteContactMessage error:', err);
      }
    }

    // Delete from memory & disk
    const memIndex = memoryMessages.findIndex((m) => m.id === id);
    if (memIndex !== -1) {
      memoryMessages.splice(memIndex, 1);
      saveMessagesToDisk();
    }

    sendSuccess(res, { id }, 'Customer message deleted successfully');
  } catch (error: any) {
    sendError(res, 'Failed to delete message', 500, error);
  }
};
