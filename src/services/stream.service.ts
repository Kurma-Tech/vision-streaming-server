import fs from "fs";
import { Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';

const path = require('path');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

import { StreamStartDto } from "@/dtos/stream.dto";

class StreamService{

    public startStream(streamDeviceData: StreamStartDto, res: Response): void {
        var headersSent = false

            ffmpeg.setFfmpegPath(ffmpegInstaller.path);

            // directory for hls chunks
            const directory = `streams/stream-${streamDeviceData.address}-${streamDeviceData.port}-${streamDeviceData.channel}`;

            if (!fs.existsSync(directory)) {
                // Creating stream directory.
                fs.mkdirSync(directory);
            } else {
                // Empty stream directory for new stream.
                // fs.unlinkSync(`${directory}/output.m3u8`);
                // fs.unlink(path.join(directory, 'output.m3u8'), err => {
                //     if (err) throw err;
                // });
                // fs.readdir(directory, (err, files) => {
                //     if (err) throw err;

                //     for (const file of files) {
                //         fs.unlink(path.join(directory, file), err => {
                //             if (err) throw err;
                //         });
                //     }
                // });
            }

            // ffmpeg service
            ffmpeg(`rtsp://${streamDeviceData.username}:${streamDeviceData.password}@${streamDeviceData.address}:${streamDeviceData.port}/Streaming/Channels/${streamDeviceData.channel}/`, { timeout: 432000 }).addOptions([
                '-profile:v baseline',
                '-s 640x480',
                '-level 3.0',
                '-start_number 0',
                '-hls_time 2',
                // '-hls_list_size 5',
                '-hls_wrap 3',
                '-hls_flags omit_endlist',
                '-hls_flags delete_segments',
                `-hls_segment_filename ${directory}/%05d.ts`,
                '-f hls'
            ])
                .output(`${directory}/output.m3u8`)
                .on('end', () => {
                    console.log('end');
                })
                .on('progress', function (progress) {

                    // check if the file exists
                    fs.access(`${directory}/output.m3u8`, fs.constants.F_OK, function (err) {
                        if (err) {
                            console.log("Processing error")
                            console.log('File not exist');
                        } else {
                            // check to see if headers are sent so as to avoid headers being sent again
                            // headers should be sent once
                            if (headersSent === false) {
                                console.log("Processing success")
                                console.log("File exists")

                                //file exists
                                console.log("==========")
                                console.log("==========m3u8 file detected==========")
                                console.log("==========")

                                headersSent = true

                                // when the .m3u8 file has been created
                                // send a response to your frontend so that the player can be initialised and shown
                                res.status(200).json({
                                    data: {
                                        "streamUrl": `${directory}/output.m3u8`
                                    }, success: true
                                });
                            }
                        }
                    });
                })
                .run();
      }
}

export default StreamService;
