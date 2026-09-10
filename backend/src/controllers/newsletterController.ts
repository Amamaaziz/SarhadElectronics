import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import prisma from '../config/db';
import { checkDbConnection, memorySubscribers } from '../services/productService';

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      sendError(res, 'A valid email address is required', 400);
      return;
    }

    const emailNormalized = email.toLowerCase().trim();
    const isDbLive = await checkDbConnection();

    if (isDbLive) {
      const existing = await prisma.subscriber.findUnique({
        where: { email: emailNormalized },
      });

      if (existing) {
        sendSuccess(res, existing, 'You are already subscribed to our newsletter!');
        return;
      }

      const subscriber = await prisma.subscriber.create({
        data: { email: emailNormalized },
      });

      sendSuccess(res, subscriber, 'Successfully subscribed to Sarhad Electrics newsletter!', 201);
      return;
    }

    const existing = memorySubscribers.find((s) => s.email === emailNormalized);
    if (existing) {
      sendSuccess(res, existing, 'You are already subscribed to our newsletter!');
      return;
    }

    const subscriber = {
      id: `sub-${Date.now()}`,
      email: emailNormalized,
      subscribedAt: new Date(),
    };
    memorySubscribers.push(subscriber);

    sendSuccess(res, subscriber, 'Successfully subscribed to Sarhad Electrics newsletter!', 201);
  } catch (error: any) {
    sendError(res, 'Subscription failed', 500, error);
  }
};

export const getSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const isDbLive = await checkDbConnection();

    if (isDbLive) {
      const subscribers = await prisma.subscriber.findMany({
        orderBy: { subscribedAt: 'desc' },
      });
      sendSuccess(res, subscribers);
      return;
    }

    sendSuccess(res, memorySubscribers);
  } catch (error: any) {
    sendError(res, 'Failed to fetch subscribers', 500, error);
  }
};

