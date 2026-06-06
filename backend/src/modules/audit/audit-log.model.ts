import mongoose, { Document, Schema, Types } from "mongoose";

export const AUDIT_ACTIONS = [
  "CONTACT_CREATED",
  "CONTACT_IMPORTED",
  "CONTACT_UPDATED",
  "CONTACT_DELETED",
  "LOAN_CREATED",
  "LOAN_UPDATED",
  "LOAN_DELETED",
  "PAYMENT_CREATED",
  "PAYMENT_UPDATED",
  "PAYMENT_DELETED",
  "CATEGORY_CREATED",
  "CATEGORY_UPDATED",
  "CATEGORY_DELETED",
  "TRANSACTION_CREATED",
  "TRANSACTION_UPDATED",
  "TRANSACTION_DELETED",
  "AUTO_TRANSACTION_CREATED",
  "AUTO_TRANSACTION_UPDATED",
  "AUTO_TRANSACTION_DELETED",
  "GOAL_CREATED",
  "GOAL_UPDATED",
  "GOAL_DELETED",
  "GOAL_CONTRIBUTION_CREATED",
  "GOAL_CONTRIBUTION_UPDATED",
  "GOAL_CONTRIBUTION_DELETED",
] as const;

export const AUDIT_ENTITY_TYPES = [
  "CONTACT",
  "LOAN",
  "PAYMENT",
  "CATEGORY",
  "TRANSACTION",
  "GOAL",
  "GOAL_CONTRIBUTION",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];
export type AuditEntityType = (typeof AUDIT_ENTITY_TYPES)[number];

export interface IAuditLog extends Document {
  userId: Types.ObjectId;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: Types.ObjectId;
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: AUDIT_ACTIONS,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: AUDIT_ENTITY_TYPES,
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    oldValue: {
      type: Schema.Types.Mixed,
    },
    newValue: {
      type: Schema.Types.Mixed,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    ip: {
      type: String,
      maxlength: 120,
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, entityType: 1, createdAt: -1 });

export const AuditLogModel = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
