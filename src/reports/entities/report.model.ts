/* eslint-disable prettier/prettier */

export class ReportModel {
    id: number;
    title: string;
    description: string;
    report_pic_url: string;
    category_id?: number;
    user_id: number;
    reference_url: string;
    creation_date: Date;
    status_id: number;
    deleted_at?: Date;

    constructor(
        id: number,
        title: string,
        description: string,
        reportPicUrl: string,
        userId: number,
        referenceUrl: string,
        creationDate: Date,
        statusId: number
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.report_pic_url = reportPicUrl;
        this.user_id = userId;
        this.reference_url = referenceUrl;
        this.creation_date = creationDate;
        this.status_id = statusId;
    }
}