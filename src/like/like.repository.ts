/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { CreateLikeDto, RemoveLikeResponseDto } from "./dto/create-like.dto";
import { Like } from "./entities/like.entity";
import { UserProfile } from "src/auth/tokens.interface";

@Injectable()
export class LikeRepository {
    constructor(private readonly dbService: DbService) {}

    async create(createLikeDto: CreateLikeDto, user: UserProfile): Promise<Like> {
        const { report_id } = createLikeDto;
        const sql = 'INSERT INTO `like` (user_id, report_id) VALUES (?, ?)';
        try {
            await this.dbService.getPool().query(sql, [user.id, report_id]);
            return { user_id: user.id, report_id };
        } catch (error) {
            if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
                throw new ConflictException('You have already liked this report');
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async remove(report_id: number, user: UserProfile): Promise<RemoveLikeResponseDto> {
        const sql = 'DELETE FROM `like` WHERE user_id = ? AND report_id = ?';
        try {
            const [result] = await this.dbService.getPool().query(sql, [user.id, report_id]);
            const deleteResult = result as { affectedRows?: number };
            if (deleteResult.affectedRows === 0) {
                throw new NotFoundException('Like not found');
            }
            return { user_id: user.id, report_id };
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findByUserId(user_id: number): Promise<Like[]> {
        const sql = 'SELECT * FROM `like` WHERE user_id = ?';
        const [rows] = await this.dbService.getPool().query(sql, [user_id]);
        return rows as Like[];
    }

    async findByReportId(report_id: number): Promise<Like[]> {
        const sql = 'SELECT * FROM `like` WHERE report_id = ?';
        const [rows] = await this.dbService.getPool().query(sql, [report_id]);
        return rows as Like[];
    }

    async findOne(user_id: number, report_id: number): Promise<Like> {
        const sql = 'SELECT * FROM `like` WHERE user_id = ? AND report_id = ?';
        const [rows] = await this.dbService.getPool().query(sql, [user_id, report_id]);
        const likes = rows as Like[];
        return likes[0];
    }
}
