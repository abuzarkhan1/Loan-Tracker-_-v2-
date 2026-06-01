import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Contacts from "expo-contacts/legacy";
import * as Haptics from "expo-haptics";
import { BookUser, CheckCircle2, Plus, Search, UserRound } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../../api/client";
import { Contact, DeviceContactImportPayload } from "../../api/types";
import { AppButton } from "../../components/AppButton";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { Screen } from "../../components/Screen";
import { RootStackParamList } from "../../navigation/types";
import { showAlert } from "../../providers/AlertProvider";
import { useAppTheme } from "../../providers/ThemeProvider";

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type PermissionState = "loading" | "granted" | "denied" | "undetermined";

const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

const getPrimaryPhone = (contact: Contacts.ExistingContact) => contact.phoneNumbers?.[0]?.number || "";

const contactToPayload = (contact: Contacts.ExistingContact): DeviceContactImportPayload => ({
  deviceContactId: contact.id,
  name: contact.name || [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "Unknown Contact",
  phone: getPrimaryPhone(contact),
  emails: contact.emails?.map((email: Contacts.Email) => email.email || "").filter(Boolean),
  source: "DEVICE_CONTACT",
});

export const ContactsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();
  const [search, setSearch] = useState("");
  const [permissionState, setPermissionState] = useState<PermissionState>("loading");
  const [deviceContacts, setDeviceContacts] = useState<Contacts.ExistingContact[]>([]);
  const [contactsError, setContactsError] = useState<string | null>(null);

  const appContactsQuery = useQuery({
    queryKey: ["contacts", search],
    queryFn: () => api.getContacts({ search, limit: 80 }),
  });

  const loadDeviceContacts = useCallback(async () => {
    setContactsError(null);
    const permission = await Contacts.getPermissionsAsync();
    if (permission.status === "granted") {
      setPermissionState("granted");
      const result = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        sort: Contacts.SortTypes.FirstName,
      });
      setDeviceContacts(result.data.filter((contact) => Boolean(contact.name)));
      return;
    }

    setPermissionState(permission.canAskAgain ? "undetermined" : "denied");
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadDeviceContacts().catch(() => {
        setPermissionState("denied");
        setContactsError("Phone contacts load nahi ho sake.");
      });
    }, [loadDeviceContacts]),
  );

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      loadDeviceContacts().catch(() => {
        setPermissionState("denied");
        setContactsError("Phone contacts load nahi ho sake.");
      }),
      appContactsQuery.refetch(),
    ]);
  }, [appContactsQuery, loadDeviceContacts]);

  const requestAccess = async () => {
    const permission = await Contacts.requestPermissionsAsync();
    if (permission.status === "granted") {
      await loadDeviceContacts();
    } else {
      setPermissionState(permission.canAskAgain ? "undetermined" : "denied");
    }
  };

  const importMutation = useMutation({
    mutationFn: (payload: DeviceContactImportPayload) => api.importDeviceContact(payload),
    onSuccess: async (data) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      navigation.navigate("ContactLoanProfile", { contactId: data.contact._id });
    },
    onError: () => {
      showAlert({ title: "Contact import failed", message: "Please try again or add this contact manually." });
    },
  });

  const appContactByPhone = useMemo(() => {
    const map = new Map<string, Contact>();
    (appContactsQuery.data?.contacts || []).forEach((contact) => {
      if (contact.phone) map.set(contact.phone.replace(/\D/g, "").slice(-10), contact);
    });
    return map;
  }, [appContactsQuery.data?.contacts]);

  const filteredDeviceContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return deviceContacts
      .filter((contact) => {
        if (!term) return true;
        return `${contact.name} ${getPrimaryPhone(contact)}`.toLowerCase().includes(term);
      })
      .slice(0, 120);
  }, [deviceContacts, search]);

  const appContacts = appContactsQuery.data?.contacts || [];
  const showPermissionCard = permissionState !== "granted";

  return (
    <Screen className="pt-5" onRefresh={handleRefresh} refreshLabel="Refreshing contacts...">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="text-2xl font-black text-dark">Contacts</Text>
          <Text className="mt-1 text-sm font-medium text-muted">Phone book se hisaab shuru karein.</Text>
        </View>
        <AppButton title="Manual" icon={Plus} onPress={() => navigation.navigate("ContactForm")} />
      </View>

      <View className="mt-5 flex-row items-center gap-3 border border-border px-4" style={{ borderRadius: 18, backgroundColor: theme.input }}>
        <Search color={theme.muted} size={18} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          placeholder="Search contacts"
          placeholderTextColor={theme.placeholder}
          returnKeyType="search"
          className="h-12 flex-1 text-base text-dark"
        />
      </View>

      {showPermissionCard ? (
        <View className="mt-5 rounded-3xl border border-border bg-card p-5" style={theme.shadowSoft}>
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-peach">
            <BookUser color={theme.primaryDark} size={24} />
          </View>
          <Text className="mt-4 text-xl font-black text-dark">Find Contacts Faster</Text>
          <Text className="mt-2 text-sm font-medium leading-6 text-muted">
            Allow contact access so you can select people from your phone book and create loans without manually typing names or phone numbers.
          </Text>
          <View className="mt-5 gap-3">
            <AppButton title="Allow Contacts Access" icon={BookUser} onPress={requestAccess} />
            <AppButton title="Add Manually" icon={Plus} variant="secondary" onPress={() => navigation.navigate("ContactForm")} />
            <AppButton title="Maybe Later" variant="ghost" onPress={() => setPermissionState("denied")} />
          </View>
        </View>
      ) : null}

      <View className="mt-6 gap-3">
        {permissionState === "loading" ? <LoadingState label="Checking contacts permission..." /> : null}
        {contactsError ? <ErrorState message={contactsError} onRetry={loadDeviceContacts} /> : null}
        {permissionState === "granted" && filteredDeviceContacts.length === 0 ? (
          <EmptyState title="No contacts found" subtitle="Search clear karein ya manually contact add karein." />
        ) : null}

        {permissionState === "granted" ? (
          filteredDeviceContacts.map((contact) => {
            const phoneKey = getPrimaryPhone(contact).replace(/\D/g, "").slice(-10);
            const existing = appContactByPhone.get(phoneKey);
            return (
              <TouchableOpacity
                key={contact.id || contact.name}
                activeOpacity={0.88}
                disabled={importMutation.isPending}
                onPress={() => importMutation.mutate(contactToPayload(contact))}
                className="flex-row items-center gap-4 rounded-2xl border border-border bg-card p-4"
                style={theme.shadowSoft}
              >
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-background-soft">
                  <Text className="text-sm font-black text-primary">{initials(contact.name || "U")}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text numberOfLines={1} className="flex-1 text-base font-black text-dark">{contact.name}</Text>
                    {existing ? <CheckCircle2 color={theme.success} size={16} /> : null}
                  </View>
                  <Text numberOfLines={1} className="mt-1 text-sm font-semibold text-muted">{getPrimaryPhone(contact) || "No phone"}</Text>
                  <Text className="mt-2 text-[11px] font-bold text-primary">{existing ? "Open profile" : "Tap to import"}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : null}

        {permissionState !== "granted" ? (
          appContacts.length ? appContacts.map((contact) => (
            <TouchableOpacity
              key={contact._id}
              activeOpacity={0.88}
              onPress={() => navigation.navigate("ContactLoanProfile", { contactId: contact._id })}
              className="flex-row items-center gap-4 rounded-2xl border border-border bg-card p-4"
              style={theme.shadowSoft}
            >
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-background-soft">
                <UserRound color={theme.primary} size={22} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-dark">{contact.name}</Text>
                <Text className="mt-1 text-sm font-medium text-muted">{contact.phone || contact.email || "No phone"}</Text>
              </View>
            </TouchableOpacity>
          )) : (
            <EmptyState title="No saved contacts" subtitle="Phone access allow karein ya manually contact add karein." />
          )
        ) : null}
      </View>
    </Screen>
  );
};
