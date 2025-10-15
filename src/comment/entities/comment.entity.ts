/* eslint-disable prettier/prettier */
export class Comment {
    id: number;
    content: string;
    user_id: number;
    report_id: number;
    parent_comment_id?: number;
    creation_date: Date;
    deleted_at?: Date;
}
