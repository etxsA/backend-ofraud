import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards/admin.guard';

@ApiTags('Endpoints for status management, only accessible by admins')
@Controller('status')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @ApiOperation({ summary: 'Create status' })
  @ApiResponse({
    status: 201,
    description: 'The status has been created.',
    example: { id: 1, name: 'In Progress' },
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all statuses' })
  @ApiResponse({
    status: 200,
    description: 'Return all statuses.',
    example: [{ id: 1, name: 'In Progress' }],
  })
  findAll() {
    return this.statusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get status by id' })
  @ApiResponse({
    status: 200,
    description: 'Return status by id.',
    example: { id: 1, name: 'In Progress' },
  })
  @ApiResponse({ status: 404, description: 'Status not found.' })
  findOne(@Param('id') id: string) {
    return this.statusService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update status by id' })
  @ApiResponse({
    status: 200,
    description: 'The status has been updated.',
    example: { id: 1, name: 'Completed' },
  })
  @ApiResponse({ status: 404, description: 'Status not found.' })
  @ApiResponse({ status: 400, description: 'Invalid status ID.' })
  update(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.statusService.update(+id, updateStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete status by id' })
  @ApiResponse({
    status: 200,
    description: 'The status has been deleted.',
    example: { id: 1 },
  })
  @ApiResponse({ status: 404, description: 'Status not found.' })
  remove(@Param('id') id: string) {
    return this.statusService.remove(+id);
  }
}
