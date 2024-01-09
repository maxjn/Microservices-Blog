import { Request, Response, NextFunction } from "express";
import { Channel, ConsumeMessage  } from 'amqplib/callback_api';

// Controllers & Middlewares
export interface ControllerFunction {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface AuthMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<object | void>;
}

export interface PostControllerFunction {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}


// RabbitMQ

export type DestinationType = 'queue' | 'exchange';

export type ExchangeType = 'direct' | 'fanout' | 'topic' | 'headers';


// Publisher
export type PublishOptionsType = {
  ch: Channel;
  destination: string; // Queue or Exchange name
  routingKey: string;
  content: Buffer;
  destinationType: DestinationType;
  exchangeType?: ExchangeType;
  exchangeOptions?: any;
};


export type OfflinePubQueueType = Array<[string, string, Buffer, DestinationType,ExchangeType,any]>


// Worker''

export type ProcessCallbackType = (msg: ConsumeMessage) => Promise<boolean>;

export type WorkerOptionsType = {
  channel: Channel;
  destination: string; // Queue or Exchange name
  destinationType: DestinationType;
  exchangeType?: ExchangeType; 
  exchangeOptions?: any;
  processCallback: ProcessCallbackType;
};