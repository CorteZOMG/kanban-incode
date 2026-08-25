import { ColumnStatus } from '@prisma/client';

export class MoveCardDTO {
  status: ColumnStatus;
  order: number;
}
