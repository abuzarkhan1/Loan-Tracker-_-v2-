import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  ChevronRight,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Plus,
  Smartphone,
  Users2,
} from "lucide-react";
import useContacts from "../../hooks/useContacts";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Input from "../../components/common/Input";
import LoadingState from "../../components/common/LoadingState";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import { ROUTES } from "../../config/routes.config";
import useDebounce from "../../hooks/useDebounce";

const contactSchema = zod.object({
  name: zod.string().min(1, "Name is required").max(80, "Name must be under 80 characters"),
  phone: zod.string().optional(),
  email: zod.string().email("Invalid email").optional().or(zod.literal("")),
  note: zod.string().optional(),
});

type ContactFormInputs = zod.infer<typeof contactSchema>;

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "C";

export const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addOpen, setAddOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { contacts, createContact, isCreating, isLoading, error, refetch } = useContacts(undefined, {
    search: debouncedSearch,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "", note: "" },
  });

  const allContacts = contacts?.contacts || [];

  const onSubmit = async (data: ContactFormInputs) => {
    setFormError(null);
    try {
      await createContact({
        name: data.name,
        phone: data.phone || undefined,
        email: data.email || undefined,
        note: data.note || undefined,
      });
      setAddOpen(false);
      reset();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to create contact.");
    }
  };

  if (isLoading && !contacts) {
    return <LoadingState message="Loading contacts..." type="spinner" />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} message="Could not fetch contacts." />;
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="People"
        title="Contacts"
        description="Keep every person’s loan profile, payment history, and ledger organized in one place."
        icon={<Users2 className="h-6 w-6" />}
        actions={
          <Button
            variant="primary"
            onClick={() => setAddOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Manually
          </Button>
        }
      />

      <Card variant="bordered" className="border-appBorder/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name, phone, or email..."
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-appBgSoft p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-2 transition-colors ${
                viewMode === "grid" ? "bg-appCard text-appPrimary shadow-sm" : "text-appMuted hover:text-appText"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-2 transition-colors ${
                viewMode === "list" ? "bg-appCard text-appPrimary shadow-sm" : "text-appMuted hover:text-appText"
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {allContacts.length === 0 ? (
        <EmptyState
          title="No contacts yet"
          description="Add a manual contact here, or use the mobile app to import from your phone book."
          actionText="Add Contact"
          onAction={() => setAddOpen(true)}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {allContacts.map((contact) => {
            const id = contact._id;
            const isPhoneContact = contact.source === "DEVICE_CONTACT";
            return (
              <Card
                key={id}
                variant="bordered"
                hoverable
                onClick={() => navigate(ROUTES.CONTACT_DETAIL.replace(":id", id))}
                className="border-appBorder/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-appPrimary/10 text-sm font-semibold text-appPrimary">
                      {getInitials(contact.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-appText">{contact.name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-normal text-appMuted">
                        {contact.phone ? <Phone className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
                        <span className="truncate">{contact.phone || contact.email || "No contact detail"}</span>
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-appMuted" />
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-appBorder/40 pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-appBorder bg-appBgSoft px-2.5 py-1 text-xs font-medium text-appMuted">
                    {isPhoneContact && <Smartphone className="h-3 w-3" />}
                    {isPhoneContact ? "Phone Contact" : "Manual"}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="bordered" padding="none" className="overflow-hidden border-appBorder/50">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-appBorder bg-appBgSoft/60 text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-appBorder/40">
                {allContacts.map((contact) => (
                  <tr
                    key={contact._id}
                    onClick={() => navigate(ROUTES.CONTACT_DETAIL.replace(":id", contact._id))}
                    className="cursor-pointer transition-colors hover:bg-appBgSoft/40"
                  >
                    <td className="px-6 py-4 font-medium text-appText">{contact.name}</td>
                    <td className="px-6 py-4 text-appMuted">{contact.phone || "-"}</td>
                    <td className="px-6 py-4 text-appMuted">{contact.email || "-"}</td>
                    <td className="px-6 py-4 text-appMuted">
                      {contact.source === "DEVICE_CONTACT" ? "Phone Contact" : "Manual"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Contact">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div className="rounded-lg border border-appDanger/25 bg-appDanger/10 p-3 text-sm font-medium text-appDanger">
              {formError}
            </div>
          )}
          <Input
            id="name"
            type="text"
            label="Full Name"
            placeholder="Ali Khan"
            error={errors.name?.message}
            disabled={isCreating}
            {...register("name")}
          />
          <Input
            id="phone"
            type="text"
            label="Phone Number"
            placeholder="+92 300 1234567"
            error={errors.phone?.message}
            disabled={isCreating}
            {...register("phone")}
          />
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="ali@example.com"
            error={errors.email?.message}
            disabled={isCreating}
            {...register("email")}
          />
          <Input
            id="note"
            type="text"
            label="Note"
            placeholder="Office, family, customer..."
            error={errors.note?.message}
            disabled={isCreating}
            {...register("note")}
          />
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setAddOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isCreating}>
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Contacts;
