import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validateRequest";
import {
  bulkImportDeviceContactsSchema,
  contactIdParamSchema,
  createContactSchema,
  getContactsSchema,
  importDeviceContactSchema,
  matchContactSchema,
  updateContactSchema,
} from "./contact.validation";
import {
  bulkImportDeviceContacts,
  createContact,
  deleteContact,
  getContactDetail,
  getContactLedger,
  getContacts,
  importDeviceContact,
  matchContact,
  touchContactLastUsed,
  updateContact,
} from "./contact.controller";

const router = Router();

router.use(requireAuth);
router.post("/", validateRequest(createContactSchema), createContact);
router.get("/", validateRequest(getContactsSchema), getContacts);
router.get("/match", validateRequest(matchContactSchema), matchContact);
router.post("/import-device-contact", validateRequest(importDeviceContactSchema), importDeviceContact);
router.post("/bulk-import-device-contacts", validateRequest(bulkImportDeviceContactsSchema), bulkImportDeviceContacts);
router.get("/:contactId/ledger", validateRequest(contactIdParamSchema), getContactLedger);
router.patch("/:contactId/last-used", validateRequest(contactIdParamSchema), touchContactLastUsed);
router.get("/:contactId", validateRequest(contactIdParamSchema), getContactDetail);
router.patch("/:contactId", validateRequest(updateContactSchema), updateContact);
router.delete("/:contactId", validateRequest(contactIdParamSchema), deleteContact);

export default router;
