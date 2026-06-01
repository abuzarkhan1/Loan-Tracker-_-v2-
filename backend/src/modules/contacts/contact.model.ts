import mongoose, { Document, Schema, Types } from "mongoose";

export const CONTACT_SOURCES = ["MANUAL", "DEVICE_CONTACT"] as const;
export type ContactSource = (typeof CONTACT_SOURCES)[number];

export interface IContact extends Document {
  userId: Types.ObjectId;
  name: string;
  phone?: string;
  email?: string;
  note?: string;
  source: ContactSource;
  deviceContactId?: string;
  normalizedPhone?: string;
  lastUsedAt?: Date;
  avatarColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    source: {
      type: String,
      enum: CONTACT_SOURCES,
      default: "MANUAL",
      required: true,
      index: true,
    },
    deviceContactId: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    normalizedPhone: {
      type: String,
      trim: true,
      maxlength: 40,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      index: true,
    },
    avatarColor: {
      type: String,
      trim: true,
      maxlength: 20,
    },
  },
  { timestamps: true },
);

contactSchema.index({ userId: 1, name: 1 });
contactSchema.index({ userId: 1, normalizedPhone: 1 });
contactSchema.index({ userId: 1, deviceContactId: 1 });

export const ContactModel = mongoose.model<IContact>("Contact", contactSchema);
