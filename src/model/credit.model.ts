import { Schema, model, Document } from 'mongoose';
import { Status } from '../enums/coupon.enum';

export interface ICredit extends Document {
  creditAmount: number;
  startDate?: Date;
  endDate?: Date;
  remarks: string;
  whenUsed?: Date;
  timesUse?: number;
  status: Status;
  user: string | string[];
  usedAmount?: number;
}

const creditSchema = new Schema<ICredit>(
  {
    creditAmount: { type: Number, required: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    remarks: { type: String, required: false },
    whenUsed: { type: Date, required: false },
    timesUse: { type: Number, required: false, default: 1 },
    status: { type: String, enum: Status, required: true },
    user: { type: String, ref: 'User', required: true },
    usedAmount: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

export const Credit = model<ICredit>('credit', creditSchema);
