import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { UserProfile } from 'src/auth/tokens.interface';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentRepository {
  constructor(private readonly dbService: DbService) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: UserProfile,
  ): Promise<Comment> {
    const { content, report_id, parent_comment_id } = createCommentDto;
    const sql =
      'INSERT INTO `comment` (content, user_id, report_id, parent_comment_id, creation_date) VALUES (?, ?, ?, ?, ?)';
    try {
      const [result] = await this.dbService
        .getPool()
        .query(sql, [
          content,
          user.id,
          report_id,
          parent_comment_id,
          new Date(),
        ]);
      const insertResult = result as { insertId?: number };
      if (!insertResult.insertId) {
        throw new InternalServerErrorException('Failed to create comment');
      }
      return this.findById(insertResult.insertId);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async findById(id: number): Promise<Comment> {
    const sql = 'SELECT * FROM `comment` WHERE id = ? AND deleted_at IS NULL';
    const [rows] = await this.dbService.getPool().query(sql, [id]);
    const comments = rows as Comment[];
    if (comments.length === 0) {
      throw new NotFoundException('Comment not found');
    }
    return comments[0];
  }

  async findByReportIdWithLikes(
    report_id: number,
  ): Promise<CommentResponseDto[]> {
    const sql = `
            SELECT c.*, COUNT(cl.user_id) as likes
            FROM \`comment\` c
            LEFT JOIN \`comment_like\` cl ON c.id = cl.comment_id
            WHERE c.report_id = ? AND c.deleted_at IS NULL
            GROUP BY c.id
        `;
    const [rows] = await this.dbService.getPool().query(sql, [report_id]);
    return rows as CommentResponseDto[];
  }

  async findThreadsByReportId(
    report_id: number,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.findByReportIdWithLikes(report_id);
    const commentMap = new Map<number, CommentResponseDto>();
    comments.forEach((comment) => {
      comment.children = [];
      commentMap.set(comment.id, comment);
    });

    const rootComments: CommentResponseDto[] = [];
    comments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(comment);
        } else {
          rootComments.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }

  async findRootCommentsByReportId(
    report_id: number,
  ): Promise<CommentResponseDto[]> {
    const sql = `
        SELECT c.*, COUNT(cl.user_id) as likes
        FROM \`comment\` c
        LEFT JOIN \`comment_like\` cl ON c.id = cl.comment_id
        WHERE c.report_id = ? AND c.parent_comment_id IS NULL AND c.deleted_at IS NULL
        GROUP BY c.id
    `;
    const [rows] = await this.dbService.getPool().query(sql, [report_id]);
    return rows as CommentResponseDto[];
  }

  async findChildrenByCommentId(
    comment_id: number,
  ): Promise<CommentResponseDto[]> {
    const sql = `
        SELECT c.*, COUNT(cl.user_id) as likes
        FROM \`comment\` c
        LEFT JOIN \`comment_like\` cl ON c.id = cl.comment_id
        WHERE c.parent_comment_id = ? AND c.deleted_at IS NULL
        GROUP BY c.id
    `;
    const [rows] = await this.dbService.getPool().query(sql, [comment_id]);
    return rows as CommentResponseDto[];
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user: UserProfile,
  ): Promise<Comment> {
    const comment = await this.findById(id);
    if (comment.user_id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to update this comment',
      );
    }

    const { content } = updateCommentDto;
    const sql = 'UPDATE `comment` SET content = ? WHERE id = ?';
    try {
      await this.dbService.getPool().query(sql, [content, id]);
      return this.findById(id);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async remove(id: number, user: UserProfile): Promise<{ id: number }> {
    const comment = await this.findById(id);
    if (comment.user_id !== user.id && !user.admin) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    const sql = 'UPDATE `comment` SET deleted_at = ? WHERE id = ?';
    try {
      const [result] = await this.dbService
        .getPool()
        .query(sql, [new Date(), id]);
      const deleteResult = result as { affectedRows?: number };
      if (deleteResult.affectedRows === 0) {
        throw new InternalServerErrorException(
          'Comment not found or could not be deleted',
        );
      }
      return { id };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
