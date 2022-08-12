import { NextFunction, Request, Response } from 'express';

import { StreamStartDto } from 'dtos/stream.dto';
import StreamService from "@/services/stream.service";


class StreamController {
    public streamService = new StreamService();

    public startStream = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const streamDeviceData: StreamStartDto = req.body;
            this.streamService.startStream(streamDeviceData, res);
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
}

export default StreamController;
