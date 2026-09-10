import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import prisma from '../config/db';
import { checkDbConnection, memoryMessages } from '../services/productService';

export const submitContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      sendError(res, 'All fields (Full Name, Email, Subject, Message) are required', 400);
      return;
    }

    const isDbLive = await checkDbConnection();

    if (isDbLive) {
      const contact = await prisma.contactMessage.create({
        data: {
          fullName,
          email,
          subject,
          message,
          status: 'UNREAD',
        },
      });
      sendSuccess(res, contact, 'Message sent successfully! We will get back to you shortly.', 201);
      return;
    }

    // Memory fallback
    const newMsg = {
      id: `msg-${Date.now()}`,
      fullName,
      email,
      subject,
      message,
      status: 'UNREAD',
      createdAt: new Date(),
    };
    memoryMessages.unshift(newMsg);

    sendSuccess(res, newMsg, 'Message sent successfully! We will get back to you shortly.', 201);
  } catch (error: any) {
    sendError(res, 'Failed to submit contact message', 500, error);
  }
};

export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const isDbLive = await checkDbConnection();

    if (isDbLive) {
      const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });
      sendSuccess(res, messages);
      return;
    }

    sendSuccess(res, memoryMessages);
  } catch (error: any) {
    sendError(res, 'Failed to retrieve messages', 500, error);
  }
};

