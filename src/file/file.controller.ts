/* eslint-disable prettier/prettier */
import { Controller, Get,  InternalServerErrorException, NotFoundException, Param, Post, Res, StreamableFile, UnprocessableEntityException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiParam, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import express from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Endpoints for file management')
@Controller('file')
export class FileController {

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Upload protected file' })
    @ApiBearerAuth() 
    @ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' })
    @ApiResponse({ status: 201, description: 'File uploaded successfully.', example: { filename: '1627384950_myfile.txt', path: 'public/uploads/1627384950_myfile.txt' } })
    @ApiResponse({ status: 500, description: 'Internal server error.', example: { message: 'Could not upload file' } })
    @ApiResponse({ status: 422, description: 'Unprocessable Entity', example: { statusCode: 422, message: ['file must be a file of type jpg|jpeg|png|gif'], error: 'Unprocessable Entity' } })
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
                const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
                const finalName = file.fieldname + "-" + uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_');
                console.log(file.originalname);
                cb(null, finalName);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(new UnprocessableEntityException(`${file.mimetype} is not a supported type`), false);
            } else {
                cb(null, true);
            }
        },
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return { filename: file.filename, path: `/public/uploads/${file.filename}` };
    }

    @Get('download/:filename')
    @ApiOperation({ summary: 'Download a protected file by its filename' })
    @ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' , example: {
        message: "No token provided",
        error: "Unauthorized",
        statusCode: 401
    }})
    @ApiResponse({ status: 404, description: 'File not found', example: { statusCode: 404, message: 'File with name myfile.png not found', error: 'Not Found' } })
    @ApiResponse({ status: 500, description: 'Internal server error', example: { statusCode: 500, message: 'An error ocurred while trying to send the file', error: 'Internal Server Error' } })
    @ApiResponse({ status: 200, description: 'The file', content: { 'application/octet-stream': { schema: { type: 'string', format: 'binary' } } } })
    @ApiParam({ name: 'filename', required: true, description: 'Name of the file to be downloaded', example: '1627384950_myfile.png' })
    downloadFile(@Param('filename') filename: string, @Res({ passthrough: true}) res: express.Response): StreamableFile {
        
        const filePath = join(process.cwd(),'public','uploads', filename);

        if (!existsSync(filePath)) {
            throw new NotFoundException(`File with name ${filename} not found`);
        }

        try {
            const file = createReadStream(filePath);

            res.set({
                'Content-type': 'application/octet-stream',
            });
            return new StreamableFile(file);

        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('An error ocurred while trying to send the file');
        }
    }

}
