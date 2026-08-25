import { ColumnStatus } from '@prisma/client';
export class CreateCardDto {
  title: string;
  description?: string;
  boardId: string;
  status?: ColumnStatus; // defaults to TODO if not sent
}
