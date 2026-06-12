import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Contacts from "expo-contacts/legacy";
import * as Haptics from "expo-haptics";
import { BookUser, CheckCircle2, ChevronRight, Plus, Search } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../../api/client";
import { Contact, DeviceContactImportPayload } from "../../api/types";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { Screen } from "../../components/Screen";
import { RootStackParamList } from "../../navigation/types";
import { showAlert } from "../../providers/AlertProvider";
import { useAppTheme } from "../../providers/ThemeProvider";
import { formatCurrency } from "../../utils/format";
import { fontFamily } from "../../utils/theme";

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type PermissionState = "loading" | "granted" | "denied" | "undetermined";
type ContactFilter = "ALL" | "RECEIVABLE" | "PAYABLE";
type ContactBalance = {
  contactId: string;
  name?: string;
  contactName?: string;
  netReceivable?: number;
  netPayable?: number;
  overallBalance?: number;
};

const filters: Array<{ label: string; value: ContactFilter }> = [
  { label: "Sab", value: "ALL" },
  { label: "Qarzdar", value: "RECEIVABLE" },
  { label: "Lender", value: "PAYABLE" },
];

const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";

const getPrimaryPhone = (contact: Contacts.ExistingContact) => contact.phoneNumbers?.[0]?.number || "";

const contactToPayload = (contact: Contacts.ExistingContact): DeviceContactImportPayload => ({
  deviceContactId: contact.id,
  name: contact.name || [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "Unknown Contact",
  phone: getPrimaryPhone(contact),
  emails: contact.emails?.map((email: Contacts.Email) => email.email || "").filter(Boolean),
  source: "DEVICE_CONTACT",
});

const balanceValue = (balance?: ContactBalance) => {
  if (!balance) return 0;
  return balance.overallBalance ?? (balance.netReceivable || 0) - (balance.netPayable || 0);
};

const formatSignedCurrency = (value: number) => {
  if (!value) return "Rs 0";
  const sign = value > 0 ? "+" : "-";
  return `Rs ${sign}${Math.abs(value).toLocaleString("en-PK")}`;
};

const FilterChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={{
        minHeight: 34,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: active ? theme.primary : theme.border,
        backgroundColor: active ? theme.primary : theme.pill,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: active ? "#000000" : theme.muted, fontFamily: fontFamily.medium, fontSize: 13 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const ContactRow = ({
  contact,
  balance,
  onPress,
}: {
  contact: Contact;
  balance: number;
  onPress: () => void;
}) => {
  const { theme } = useAppTheme();
  const positive = balance > 0;
  const negative = balance < 0;
  const toneColor = positive ? theme.success : negative ? theme.danger : theme.muted;
  const avatarBackground = positive ? theme.mint : negative ? theme.peach : theme.backgroundSoft;
  const relationLabel = positive ? "Mujhe Lena Hai" : negative ? "Mujhe Dena Hai" : "Settled";

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        {
          minHeight: 80,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 13,
        },
        theme.shadowSoft,
      ]}
    >
      <View
        style={{
          height: 44,
          width: 44,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: avatarBackground,
        }}
      >
        <Text style={{ color: toneColor, fontFamily: fontFamily.bold, fontSize: 15 }}>
          {initials(contact.name)}
        </Text>
      </View>

      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} style={{ color: theme.text, fontFamily: fontFamily.semiBold, fontSize: 16 }}>
          {contact.name}
        </Text>
        <Text numberOfLines={1} style={{ color: theme.muted, fontFamily: fontFamily.regular, fontSize: 13, marginTop: 4 }}>
          {contact.phone || contact.email || "No phone"}
        </Text>
      </View>

      <View className="items-end">
        <Text style={{ color: theme.muted, fontFamily: fontFamily.regular, fontSize: 12 }}>
          {relationLabel}
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.76}
          style={{ color: toneColor, fontFamily: fontFamily.semiBold, fontSize: 19, marginTop: 6, maxWidth: 118 }}
        >
          {formatSignedCurrency(balance)}
        </Text>
      </View>
      <ChevronRight color={theme.muted} size={20} />
    </TouchableOpacity>
  );
};

export const ContactsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ContactFilter>("ALL");
  const [permissionState, setPermissionState] = useState<PermissionState>("loading");
  const [deviceContacts, setDeviceContacts] = useState<Contacts.ExistingContact[]>([]);
  const [contactsError, setContactsError] = useState<string | null>(null);

  const appContactsQuery = useQuery({
    queryKey: ["contacts", search],
    queryFn: () => api.getContacts({ search, limit: 80 }),
  });
  const balancesQuery = useQuery({
    queryKey: ["contacts", "balances"],
    queryFn: () => api.getTopContacts(80) as Promise<ContactBalance[]>,
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
      balancesQuery.refetch(),
    ]);
  }, [appContactsQuery, balancesQuery, loadDeviceContacts]);

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

  const balanceByContact = useMemo(() => {
    const map = new Map<string, number>();
    (balancesQuery.data || []).forEach((balance) => {
      map.set(balance.contactId, balanceValue(balance));
    });
    return map;
  }, [balancesQuery.data]);

  const appContacts = useMemo(() => {
    const contacts = appContactsQuery.data?.contacts || [];
    return contacts.filter((contact) => {
      const value = balanceByContact.get(contact._id) || 0;
      if (filter === "RECEIVABLE") return value > 0;
      if (filter === "PAYABLE") return value < 0;
      return true;
    });
  }, [appContactsQuery.data?.contacts, balanceByContact, filter]);

  const filteredDeviceContacts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return deviceContacts
      .filter((contact) => {
        if (!term) return true;
        return `${contact.name} ${getPrimaryPhone(contact)}`.toLowerCase().includes(term);
      })
      .slice(0, 120);
  }, [deviceContacts, search]);

  const netBalance = appContacts.reduce((total, contact) => total + (balanceByContact.get(contact._id) || 0), 0);
  const showPermissionCard = permissionState !== "granted" && !appContacts.length;

  return (
    <Screen className="pt-1" onRefresh={handleRefresh} refreshLabel="Refreshing contacts...">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text style={{ color: theme.text, fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40 }}>Contacts</Text>
          <Text style={{ color: theme.textSecondary, fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22, marginTop: 2 }}>
            Tamam Contacts
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={() => navigation.navigate("ContactForm")}
          style={{
            height: 40,
            width: 40,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            shadowOpacity: 0.18,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Plus color="#000000" size={22} strokeWidth={2.1} />
        </TouchableOpacity>
      </View>

      <View
        className="mt-6 flex-row items-center gap-3 border px-3"
        style={{
          minHeight: 40,
          borderRadius: 6,
          borderColor: theme.border,
          backgroundColor: theme.surface,
        }}
      >
        <Search color={theme.muted} size={19} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          placeholder="Contact talash karein..."
          placeholderTextColor={theme.placeholder}
          returnKeyType="search"
          style={{ flex: 1, color: theme.text, fontFamily: fontFamily.regular, fontSize: 15, paddingVertical: 0 }}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-5 -mx-6"
        contentContainerStyle={{ gap: 8, paddingHorizontal: 24 }}
      >
        {filters.map((item) => (
          <FilterChip key={item.value} label={item.label} active={filter === item.value} onPress={() => setFilter(item.value)} />
        ))}
      </ScrollView>

      {showPermissionCard ? (
        <View className="mt-5 rounded-3xl border border-border bg-card p-5" style={theme.shadowSoft}>
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-background-soft">
            <BookUser color={theme.primary} size={22} />
          </View>
          <Text className="mt-3 text-lg font-bold text-dark">Find Contacts Faster</Text>
          <Text className="mt-2 text-sm font-medium leading-6 text-muted">
            Phone book access allow karein ya manually contact add karein.
          </Text>
          <View className="mt-4 flex-row gap-3">
            <TouchableOpacity className="flex-1 rounded-lg bg-primary py-3" onPress={requestAccess}>
              <Text className="text-center text-xs font-semibold text-white">Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 rounded-lg bg-background-soft py-3" onPress={() => navigation.navigate("ContactForm")}>
              <Text className="text-center text-xs font-semibold text-primary">Manual</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View className="mt-5 gap-3">
        {appContactsQuery.isLoading ? <LoadingState label="Loading contacts..." /> : null}
        {permissionState === "loading" && !appContacts.length ? <LoadingState label="Checking contacts permission..." /> : null}
        {contactsError ? <ErrorState message={contactsError} onRetry={loadDeviceContacts} /> : null}

        {appContacts.map((contact) => (
          <ContactRow
            key={contact._id}
            contact={contact}
            balance={balanceByContact.get(contact._id) || 0}
            onPress={() => navigation.navigate("ContactLoanProfile", { contactId: contact._id })}
          />
        ))}

        {!appContactsQuery.isLoading && !appContacts.length && permissionState === "granted" ? (
          filteredDeviceContacts.length ? filteredDeviceContacts.map((contact) => {
            const phoneKey = getPrimaryPhone(contact).replace(/\D/g, "").slice(-10);
            const existing = appContactByPhone.get(phoneKey);
            return (
              <TouchableOpacity
                key={contact.id || contact.name}
                activeOpacity={0.88}
                disabled={importMutation.isPending}
                onPress={() => importMutation.mutate(contactToPayload(contact))}
                className="flex-row items-center gap-3 rounded-3xl border border-border bg-card p-4"
                style={theme.shadowSoft}
              >
                <View className="h-11 w-11 items-center justify-center rounded-full bg-background-soft">
                  <Text className="text-sm font-bold text-primary">{initials(contact.name || "U")}</Text>
                </View>
                <View className="flex-1">
                  <Text numberOfLines={1} className="text-base font-semibold text-dark">{contact.name}</Text>
                  <Text numberOfLines={1} className="mt-1 text-xs font-normal text-muted">{getPrimaryPhone(contact) || "No phone"}</Text>
                </View>
                {existing ? <CheckCircle2 color={theme.success} size={17} /> : <Text className="text-xs font-medium text-primary">Import</Text>}
              </TouchableOpacity>
            );
          }) : (
            <EmptyState title="No contacts found" subtitle="Search clear karein ya manually contact add karein." />
          )
        ) : null}

        {!appContactsQuery.isLoading && !appContacts.length && permissionState !== "granted" && !showPermissionCard ? (
          <EmptyState title="No saved contacts" subtitle="Phone access allow karein ya manually contact add karein." />
        ) : null}
      </View>

      {appContacts.length ? (
        <Text className="mt-5 text-center" style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 13 }}>
          {appContacts.length} contacts · {formatCurrency(Math.abs(netBalance)).replace(/\u00a0/g, " ")} {netBalance >= 0 ? "net receivable" : "net payable"}
        </Text>
      ) : null}
    </Screen>
  );
};
