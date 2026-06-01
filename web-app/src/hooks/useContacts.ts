import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactsApi } from "../api/contacts.api";
import { QUERY_KEYS } from "../constants/queryKeys";
import { Contact } from "../types";

export const useContacts = (contactId?: string, listParams?: Record<string, any>) => {
  const queryClient = useQueryClient();

  const contactsQuery = useQuery({
    queryKey: [QUERY_KEYS.CONTACTS, listParams],
    queryFn: () => contactsApi.getContacts(listParams),
    enabled: !contactId,
  });

  const contactDetailQuery = useQuery({
    queryKey: [QUERY_KEYS.CONTACT_DETAIL, contactId],
    queryFn: () => contactsApi.getContact(contactId!),
    enabled: Boolean(contactId),
  });

  const ledgerQuery = useQuery({
    queryKey: [QUERY_KEYS.CONTACT_LEDGER, contactId],
    queryFn: () => contactsApi.getContactLedger(contactId!),
    enabled: Boolean(contactId),
  });

  const createContactMutation = useMutation({
    mutationFn: contactsApi.createContact,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Contact> }) =>
      contactsApi.updateContact(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACT_DETAIL, variables.id] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: contactsApi.deleteContact,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACTS] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY] });
    },
  });

  return {
    contacts: contactsQuery.data,
    contactDetail: contactDetailQuery.data,
    ledger: ledgerQuery.data,
    isLoading: contactsQuery.isLoading || contactDetailQuery.isLoading,
    error: contactsQuery.error || contactDetailQuery.error,
    refetch: contactsQuery.refetch,
    createContact: createContactMutation.mutateAsync,
    isCreating: createContactMutation.isPending,
    updateContact: updateContactMutation.mutateAsync,
    isUpdating: updateContactMutation.isPending,
    deleteContact: deleteContactMutation.mutateAsync,
    isDeleting: deleteContactMutation.isPending,
  };
};

export default useContacts;
