import { Prisma } from '@prisma/client';

export class ICar {
  id: string;
  year: number;
  EUR: number;
  USD: number;
  UAH: number;
  currency: string;
  engine: number;
  cityLocative: string;
  description: string;
  ownerId: string;
  eurRate: Prisma.JsonValue;
  usdRate: Prisma.JsonValue;
  modelId: string;
  markaId: string;
  model: { model: string };
  marka: { marka: string };
}
