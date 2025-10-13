/* eslint-disable prettier/prettier */
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';

@ApiTags('Endpoints for file management')
@Controller('file')
export class FileController {

    @Post('upload')
    @ApiResponse({ status: 201, description: 'File uploaded successfully.', example: { filename: '1627384950_myfile.txt', path: 'public/uploads/1627384950_myfile.txt' } })
    @ApiResponse({ status: 500, description: 'Internal server error.', example: { message: 'Could not upload file' } })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: join(__dirname, '..', '..','public','uploads'),
            filename: (req, file, cb) => {
                const name = file.originalname.replace(" ", "_");
                cb(null, `${Date.now()}_${name}`);
            },
        })
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return { filename: file.filename, path: `/public/uploads/${file.filename}` };
    }

}
