import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { email, symbol, z } from "zod";
import { theme } from "../../../styles/theme";
import * as storage from "@/lib/storage";

const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last Name must be at least 2 characters"),
  email: email("Please Enter a valid email address").trim(),
  studentId: z
    .string()
    .trim()
    .length(9, "StudentId must be exactly 9 characters"),
  phone: z
    .string()
    .refine(
      (val) => val.replace(/D/g, "").length >= 10,
      "Phone must be at least 10 digits ",
    ),
});

type ProfileForm = z.infer<typeof profileSchema>;

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true); // track loading state while we load saved profile data
  const [isEditing, setIsEditing] = useState(false); // track wether we're in edit more or view mode
  const [hasSavedData, setHasSavedData] = useState(false); // track if we have any saved data, to determine if we need to show the ancel button or not

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset, // a function to reset for values when canceling edit
    watch, // a function that tracks form values for enabling, disabl=ing save button
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      studentId: "",
      phone: "",
    },
    mode: "onSubmit",
  });

  const watchedValues = watch();
  // check if all fields have some valus.
  // it will produce an array of all fied values, and it will check if the length is >0
  //eg. ["jane","Smith", "", "A00123456", "4034034031"] -> false because email is empty

  const isFormFilled = Object.values(watchedValues).every((v) => v.length > 0);

  useEffect(() => {
    const loadProfile = async () => {
      const saved = await storage.get<ProfileForm>(
        storage.STORAGE_KEYS.PROFILE,
      );
      if (saved !== null) {
        reset(saved);
        setHasSavedData(true);
      } else {
        setIsEditing(true);
      }
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const onSubmit = async (data: ProfileForm) => {

    await storage.set(storage.STORAGE_KEYS.PROFILE, data)
    setHasSavedData(true)
    setIsEditing(false)
  };

  const handleCancel = async () => {
    const saved = await storage.get<ProfileForm>(storage.STORAGE_KEYS.PROFILE);
    if (saved !== null) {
      reset(saved);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <view style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </view>
    );
  }

  if (!isEditing) {
    const values = watch();
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.h1}>My Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>First Name</Text>
            <Text style={styles.profileValue}>{values.firstName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Last Name</Text>
            <Text style={styles.profileValue}>{values.lastName}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Email</Text>
            <Text style={styles.profileValue}>{values.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Phone Number</Text>
            <Text style={styles.profileValue}>{values.phone}</Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Edit Profile</Text>

      {/* First Name */}
      <Text style={styles.label}>First Name</Text>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="e.g. Jane"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.firstName && (
        <Text style={styles.error}> {errors.firstName.message}</Text>
      )}

      {/* Last Name */}
      <Text style={styles.label}>Last Name</Text>
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="e.g. Doe"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.lastName && (
        <Text style={styles.error}> {errors.lastName.message}</Text>
      )}

      {/* Email */}

      <Text style={styles.label}>Email Address</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="example@example.com"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && (
        <Text style={styles.error}> {errors.email.message}</Text>
      )}

      <Text style={styles.label}>Student Id</Text>
      <Controller
        control={control}
        name="studentId"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.studentId && styles.inputError]}
            placeholder="A00123456"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            autoCapitalize="characters"
          />
        )}
      />
      {errors.studentId && (
        <Text style={styles.error}> {errors.studentId.message}</Text>
      )}

      {/* Phone Number */}

      <Text style={styles.label}>Phone Number</Text>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="(403) 555-0123"
            placeholderTextColor={theme.colors.muted}
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phone && (
        <Text style={styles.error}> {errors.phone.message}</Text>
      )}

      {hasSavedData ? (
        <View style={styles.buttonRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.saveButton, !isFormFilled && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isFormFilled}
          >
            <Text style={styles.buttonText}>Save Profile</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[styles.button, !isFormFilled && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Save Profile</Text>
        </Pressable>
      )}

      {/* Submit Button */}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing.screen,
  },
  h1: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    color: theme.colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
  },
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  profileRow: {
    padding: 16,
  },
  profileLabel: {
    fontSize: 13,
    color: theme.colors.muted,
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    color: theme.colors.muted,
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  cancelButton: {
    flex: 1,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.input,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
