import mongoose, { Schema, Document } from 'mongoose';

// Define the Address interface
interface Address {
  zip: string;
  city: string;
  addr1: string | null;
  addr2: string | null;
  state: string;
  status: string;
  lastName: string;
  firstName: string;
  countryCode: string;
  countryName: string;
  custCompName: string | null;
}

// Define the UserInfo interface
interface UserInfo {
  ext: string | null;
  fax: string | null;
  fbId: string | null;
  phone: string;
  bdDate: string | null;
  gender: string;
  mobile: string | null;
  status: string;
  userId: number;
  bdMonth: string | null;
  orgName: string | null;
  AnnivDay: string;
  custName: string;
  googleId: string | null;
  showCity: string;
  AnnivDate: string;
  loginCode: string;
  loginName: string;
  resaleNum: string;
  resellReq: number;
  subScribe: string;
  AnnivMonth: string | null;
  isReseller: number;
  custLastName: string;
}

// Define the main User interface
interface User extends Document {
  userId: string;
  billAddr: Address[];
  insertBy: string;
  insertTs: string;
  shipAddr: Address[];
  updateBy: string;
  updateTs: string;
  userInfo: UserInfo[];
  creditUnit: string | null;
  userCoupon: string | null;
}

// Create Address schema
const AddressSchema: Schema = new Schema({
  zip: { type: String, required: true },
  city: { type: String, required: true },
  addr1: { type: String, default: null },
  addr2: { type: String, default: null },
  state: { type: String, required: true },
  status: { type: String, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  countryCode: { type: String, required: true },
  countryName: { type: String, required: true },
  custCompName: { type: String, default: null },
});

// Create UserInfo schema
const UserInfoSchema: Schema = new Schema({
  ext: { type: String, default: null },
  fax: { type: String, default: null },
  fbId: { type: String, default: null },
  phone: { type: String, required: true },
  bdDate: { type: String, default: null },
  gender: { type: String, required: true },
  mobile: { type: String, default: null },
  status: { type: String, required: true },
  userId: { type: Number, required: true },
  bdMonth: { type: String, default: null },
  orgName: { type: String, default: null },
  AnnivDay: { type: String, default: '' },
  custName: { type: String, required: true },
  googleId: { type: String, default: null },
  showCity: { type: String, required: true },
  AnnivDate: { type: String, required: true },
  loginCode: { type: String, required: true },
  loginName: { type: String, default: '' },
  resaleNum: { type: String, default: '' },
  resellReq: { type: Number, required: true },
  subScribe: { type: String, required: true },
  AnnivMonth: { type: String, default: null },
  isReseller: { type: Number, required: true },
  custLastName: { type: String, required: true },
});

// Create User schema
const UserSchema: Schema = new Schema({
  userId: { type: String, required: true },
  billAddr: { type: [AddressSchema], required: true },
  insertBy: { type: String, required: true },
  insertTs: { type: String, required: true },
  shipAddr: { type: [AddressSchema], required: true },
  updateBy: { type: String, required: true },
  updateTs: { type: String, required: true },
  userInfo: { type: [UserInfoSchema], required: true },
  creditUnit: { type: String, default: null },
  userCoupon: { type: String, default: null },
});

// Create the model
const UserModel = mongoose.model<User>('UserNew', UserSchema);

export default UserModel;
