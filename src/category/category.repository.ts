/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryModel } from "./entities/category.model";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryRepository {
    constructor(private readonly dbService: DbService) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<CategoryModel> {
        const { name, description, icon } = createCategoryDto;
        const sql = 'INSERT INTO category (name, description, icon) VALUES (?, ?, ?)';
        try {
            const [result] = await this.dbService.getPool().query(sql, [name, description, icon]);
            const insertResult = result as { insertId?: number };
            if (!insertResult.insertId) {
                throw new InternalServerErrorException('Failed to create category');
            }
            return this.findById(insertResult.insertId);
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findAll(): Promise<CategoryModel[]> {
        const sql = 'SELECT * FROM category WHERE deleted_at IS NULL';
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as CategoryModel[];
    }

    async findById(id: number): Promise<CategoryModel> {
        const sql = 'SELECT * FROM category WHERE id = ? AND deleted_at IS NULL';
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const categories = rows as CategoryModel[];
        if (categories.length === 0) {
            throw new NotFoundException('Category not found');
        }
        return categories[0];
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryModel> {
        const category = await this.findById(id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if(Number.isNaN(id)) {
            throw new BadRequestException('Invalid category ID');
        }
        const fields: string[] = [];
        const values: (string | number)[] = [];

        if (updateCategoryDto.name) {
            fields.push('name = ?');
            values.push(updateCategoryDto.name);
        }
        if (updateCategoryDto.description) {
            fields.push('description = ?');
            values.push(updateCategoryDto.description);
        }
        if (updateCategoryDto.icon) {
            fields.push('icon = ?');
            values.push(updateCategoryDto.icon);
        }

        if (fields.length === 0) {
            return category;
        }

        values.push(id);
        const sql = `UPDATE category SET ${fields.join(', ')} WHERE id = ?`;

        try {
            await this.dbService.getPool().query(sql, values);
            return this.findById(id);
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async remove(id: number): Promise<{ id: number }> {
        const category = await this.findById(id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        const sql = 'UPDATE category SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
        try {
            const [result] = await this.dbService.getPool().query(sql, [id]);
            const deleteResult = result as { affectedRows?: number };
            if (deleteResult.affectedRows === 0) {
                throw new InternalServerErrorException('Category not found or could not be deleted');
            }
            return { id };
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}