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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Enpoints for category management')
@Controller('category')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been created.',
    example: {
      id: 1,
      name: 'Phishing',
      description: 'Reports related to phishing attempts.',
      icon: 'phishing-icon.png',
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
    example: [
      {
        id: 1,
        name: 'Phishing',
        description: 'Reports related to phishing attempts.',
        icon: 'phishing-icon.png',
      },
    ],
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({
    status: 200,
    description: 'Return category by id.',
    example: {
      id: 1,
      name: 'Phishing',
      description: 'Reports related to phishing attempts.',
      icon: 'phishing-icon.png',
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category by id' })
  @ApiResponse({
    status: 200,
    description: 'The category has been updated.',
    example: {
      id: 1,
      name: 'Phishing',
      description: 'Reports related to phishing attempts.',
      icon: 'phishing-icon.png',
    },
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiResponse({
    status: 200,
    description: 'The category has been deleted.',
    example: { id: 1 },
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
