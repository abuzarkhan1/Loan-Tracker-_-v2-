import { apiClient, unwrap } from "./axios";
import {
  BulkDeviceContactImportResult,
  Contact,
  ContactDetail,
  ContactLedger,
  ContactMatchResult,
  DeviceContactImportPayload,
  DeviceContactImportResult,
  PaginatedContacts,
} from "../types";

export const contactsApi = {
  getContacts: (params?: { search?: string; page?: number; limit?: number }) =>
    unwrap<PaginatedContacts>(apiClient.get("/contacts", { params })),

  importDeviceContact: (payload: DeviceContactImportPayload) =>
    unwrap<DeviceContactImportResult>(apiClient.post("/contacts/import-device-contact", payload)),

  bulkImportDeviceContacts: (contacts: DeviceContactImportPayload[]) =>
    unwrap<BulkDeviceContactImportResult>(apiClient.post("/contacts/bulk-import-device-contacts", { contacts })),

  matchContact: (params: { phone?: string; name?: string; deviceContactId?: string }) =>
    unwrap<ContactMatchResult>(apiClient.get("/contacts/match", { params })),

  touchContactLastUsed: (contactId: string) =>
    unwrap<Contact>(apiClient.patch(`/contacts/${contactId}/last-used`)),

  getContact: (contactId: string) => unwrap<ContactDetail>(apiClient.get(`/contacts/${contactId}`)),

  getContactLedger: (contactId: string) => unwrap<ContactLedger>(apiClient.get(`/contacts/${contactId}/ledger`)),

  createContact: (payload: Partial<Contact>) => unwrap<Contact>(apiClient.post("/contacts", payload)),

  updateContact: (contactId: string, payload: Partial<Contact>) =>
    unwrap<Contact>(apiClient.patch(`/contacts/${contactId}`, payload)),

  deleteContact: (contactId: string) => unwrap<{ id: string }>(apiClient.delete(`/contacts/${contactId}`)),
};
