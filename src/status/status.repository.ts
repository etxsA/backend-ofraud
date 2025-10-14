/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { CreateStatusDto } from "./dto/create-status.dto";
import { Status } from "./entities/status.entity";
import { UpdateStatusDto } from "./dto/update-status.dto";

@Injectable()
export class StatusRepository {
    constructor(private readonly dbService: DbService) {}

    async create(createStatusDto: CreateStatusDto): Promise<Status> {
        const { name } = createStatusDto;
        const sql = 'INSERT INTO status (name) VALUES (?)';
        try {
            const [result] = await this.dbService.getPool().query(sql, [name]);
            const insertResult = result as { insertId?: number };
            if (!insertResult.insertId) {
                throw new InternalServerErrorException('Failed to create status');
            }
            return this.findById(insertResult.insertId);
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findAll(): Promise<Status[]> {
        const sql = 'SELECT * FROM status';
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as Status[];
    }

    async findById(id: number): Promise<Status> {
        const sql = 'SELECT * FROM status WHERE id = ?';
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const statuses = rows as Status[];
        if (statuses.length === 0) {
            throw new NotFoundException('Status not found');
        }
        return statuses[0];
    }

    async update(id: number, updateStatusDto: UpdateStatusDto): Promise<Status> {
        const status = await this.findById(id);
        if (!status) {
            throw new NotFoundException('Status not found');
        }

        if(Number.isNaN(id)) {
            throw new BadRequestException('Invalid status ID');
        }
        const fields: string[] = [];
        const values: (string | number)[] = [];

        if (updateStatusDto.name) {
            fields.push('name = ?');
            values.push(updateStatusDto.name);
        }

        if (fields.length === 0) {
            return status;
        }

        values.push(id);
        const sql = `UPDATE status SET ${fields.join(', ')} WHERE id = ?`;

        try {
            await this.dbService.getPool().query(sql, values);
            return this.findById(id);
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async remove(id: number): Promise<{ id: number }> {
        const status = await this.findById(id);
        if (!status) {
            throw new NotFoundException('Status not found');
        }
        const sql = 'DELETE FROM status WHERE id = ?';
        try {
            const [result] = await this.dbService.getPool().query(sql, [id]);
            const deleteResult = result as { affectedRows?: number };
            if (deleteResult.affectedRows === 0) {
                throw new InternalServerErrorException('Status not found or could not be deleted');
            }
            return { id };
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}
