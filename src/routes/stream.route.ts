import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import StreamController from '@/controllers/stream.controller';
import validationMiddleware from '@middlewares/validation.middleware';
import { StreamStartDto } from '@/dtos/stream.dto';


class StreamRoute implements Routes {
  public path = '/test';
  public router = Router();
  public testController = new StreamController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`,validationMiddleware(StreamStartDto, 'body'), this.testController.startStream);
  }
}

export default StreamRoute;
