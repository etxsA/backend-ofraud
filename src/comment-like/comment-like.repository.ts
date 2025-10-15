/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, ConflictException, NotFoundException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { CreateCommentLikeDto } from "./dto/create-comment-like.dto";
import { CommentLike } from "./entities/comment-like.entity";
import { UserProfile } from "src/auth/tokens.interface";

@Injectable()
export class CommentLikeRepository {
    constructor(private readonly dbService: DbService) {}

    async create(createCommentLikeDto: CreateCommentLikeDto, user: UserProfile): Promise<CommentLike> {
        const { comment_id } = createCommentLikeDto;
        const checkSql = 'SELECT 1 FROM `comment_like` WHERE user_id = ? AND comment_id = ? LIMIT 1';
        const insertSql = 'INSERT INTO `comment_like` (user_id, comment_id, creation_date) VALUES (?, ?, ?)';
        try {
            const [rows] = await this.dbService.getPool().query(checkSql, [user.id, comment_id]);
            if ((rows as any[]).length > 0) {
                throw new ConflictException('You have already liked this comment');
            }
            const creation_date = new Date();
            await this.dbService.getPool().query(insertSql, [user.id, comment_id, creation_date]);
            return { user_id: user.id, comment_id, creation_date };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async remove(comment_id: number, user: UserProfile): Promise<{ user_id: number, comment_id: number }> {
        const sql = 'DELETE FROM `comment_like` WHERE user_id = ? AND comment_id = ?';
        try {
            const [result] = await this.dbService.getPool().query(sql, [user.id, comment_id]);
            const deleteResult = result as { affectedRows?: number };
            if (deleteResult.affectedRows === 0) {
                throw new NotFoundException('Like not found');
            }
            return { user_id: user.id, comment_id };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}
