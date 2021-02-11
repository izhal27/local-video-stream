import { Controller, Get, Param, ParseIntPipe, Req, Res, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import fs from 'fs';
import { join } from 'path';

@Controller('play')
export class PlayController {
  @Get('/:slug/:eps')
  playMovie(
    @Req() req: Request,
    @Res() res: Response,
    @Param('slug', ValidationPipe) slug: string,
    @Param('eps', ParseIntPipe) eps: number,
  ) {
    const path = join(__dirname, '..', '..', '/public/videos/', slug) + `/${eps}.mkv`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res
          .status(416)
          .send(
            'Requested range not satisfiable\n' + start + ' >= ' + fileSize,
          );
        return;
      }

      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  }
}
