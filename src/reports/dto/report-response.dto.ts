/* eslint-disable prettier/prettier */

import { ReportModel } from "../entities/report.model";

export class ReportResponseDto extends ReportModel {}
export class UpdateReportResponseDto extends ReportModel {}
export class DeleteReportResponseDto {
    id: number;
}
