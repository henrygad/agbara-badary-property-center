"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera } from "lucide-react";
import DisplayImage from "@/components/gallery/DisplayImage";
import { showError, showSuccess } from "@/components/ui/toasts";
import { Spinner } from "@/components/ui/spinner";
import PhotoEditor from "@/components/gallery/PhotoEditor";
import { useUserStore } from "@/store/useUserStore";
import { uploadImageToCloud } from "@/lib/cloudinary/services";
import { updateAgentDb } from "@/lib/firebase/agent_service";
import ReturnBack from "@/components/ReturnBack";
import ImageLoader from "@/components/loaders/ImageLoader";


// Zod schema for validation
const profileSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  phone: z
    .string()
    .regex(/^[0-9]{11}$/, "Enter a valid 11-digit phone number"),
  company: z.string().optional(),
  bio: z.string().max(250, "Bio cannot exceed 250 characters").optional(),
  email: z.email(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function AdminProfilePage() {
  const { user, loading, updateUser } = useUserStore();

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [initialFile, setInitialFile] = useState<File | null>(null);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      gender: user?.gender,
      phone: user?.phone,
      email: user?.email,
      company: user?.company,
      bio: user?.bio,
    },
  });

  useEffect(() => {
    form.setValue("firstName", user?.firstName ?? "");
    form.setValue("lastName", user?.lastName ?? "");
    form.setValue("gender", user?.gender);
    form.setValue("phone", user?.phone ?? "");
    form.setValue("email", user?.email ?? "");
    form.setValue("company", user?.company ?? "");
    form.setValue("bio", user?.bio ?? "");
  }, [user, form]);


  if (loading || !user) return <div>Loading profile...</div>;


  // Handle image upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setInitialFile(file);
    setOpenEditor(true);
  }

  const handleCroppedImage = async (blob: Blob | null) => {
    if (!blob) return;
    const file = new File([blob], initialFile?.name || "image.png", { type: blob.type });
    // Upload cropped image to db
    handleUploadToDb(file);
  }

  // Sumbut image to server/db
  const handleUploadToDb = async (file: File) => {
    const MAX_SIZE_MB = 5;
    setIsUploading(true)
    try {

      if (file.size > MAX_SIZE_MB * (1024 * 1024)) {
        throw new Error(`Failed to submit", "Image size must be 5 MB or less`)
      }

      if (user.profileImage?.publicId) {
        // Delete the previous image from Cloudinary
        await fetch("/api/files/delete", {
          method: "DELETE",
          body: JSON.stringify({ public_ids: [user.profileImage.publicId] }),
        }
        );
      }

      // Add the new image to Cloudinary
      const addedImage = await uploadImageToCloud(file);
      if (!user?.id) return

      // Update user data in Db
      const updatedAdminResult = await updateAgentDb(user.id, { profileImage: { url: addedImage.url, publicId: addedImage.publicId } });

      if (updatedAdminResult) {
        // Update user profile image locally
        updateUser(updatedAdminResult);
        showSuccess("Profile image updated!");        
      }

    } catch (err) {
      const errorMsg = err as { message: string };
      console.error(err);
      showError("Failed to submit", errorMsg.message);
    } finally {
      setIsUploading(false);
    }
  }

  // Handle form submit
  async function handleProfileSubmit(values: ProfileForm) {
    setIsSubmitting(true);
    try {

      if (!user?.id) return;

      // Update profile data in db
      const updatedAdminResult = await updateAgentDb(user.id, { ...values });
      if (updatedAdminResult) {
        // Update user profile image locally
        updateUser(updatedAdminResult);

        showSuccess("Profile updated successfully!");

      }

    } catch (err) {
      console.error(err);
      showError("Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* return back */}
      <menu className="my-3">
        <ReturnBack />
      </menu>
      {/* Profile Header */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden">
          {!isUploading ? <>
            <DisplayImage
              src={user.profileImage?.url || "avata.png"}
              alt="Admin profile"
              type="Profile"
              useRemove={false}
              className="w-20 h-20 rounded-full border-2 border-primary"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 cursor-pointer transition">
              <Camera className="text-white w-6 h-6" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </> :
            <ImageLoader
              className="w-20 h-20 rounded-full"
            />
          }

        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Admin Profile</h2>
          <p className="text-sm text-gray-400 text-wrap">Update your personal info and profile image</p>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={form.handleSubmit(handleProfileSubmit)}
        className="space-y-6 p-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <Label className="text-sm font-medium mb-2">First Name</Label>
            <Input
              className="text-sm font-normal"
              {...form.register("firstName")}
              placeholder="John"
            />
            {form.formState.errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label className="text-sm font-medium mb-2">Last Name</Label>
            <Input
              className="text-sm font-normal"
              {...form.register("lastName")}
              placeholder="Doe"
            />
            {form.formState.errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.lastName.message}</p>
            )}
          </div>

          {/* Gender */}
          <div className="w-full">
            <Label className="text-sm font-medium mb-2">Gender</Label>
            <Select
              defaultValue={form.getValues("gender")}
              onValueChange={(v) => form.setValue("gender", v as "Male" | "Female" | "Other" | undefined)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone Number */}
          <div>
            <Label className="text-sm font-medium mb-2">Phone Number</Label>
            <Input
              className="text-sm font-normal"
              {...form.register("phone")}
              placeholder="08012345678"
            />
            {form.formState.errors.phone && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>
            )}
          </div>

          {/* Email (auth email) */}
          <div>
            <Label className="text-sm font-medium mb-2">Email (Auth)</Label>
            <div
              className="text-sm text-blue-400 cursor-pointer hover:underline"
              onClick={() => window.location.href = "/admin/change-email"}
            >
              {form.getValues("email")}
            </div>
          </div>

          {/* Company */}
          <div>
            <Label className="text-sm font-medium mb-2">Company</Label>
            <Input
              className="text-sm font-normal"
              {...form.register("company")}
              placeholder="RealPro Agency"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <Label className="text-sm font-medium mb-2">Bio</Label>
          <Textarea
            {...form.register("bio")}
            rows={3}
            placeholder="Tell us something about yourself..."
            className="resize-none min-h-20 text-sm font-normal"
          />
          {form.formState.errors.bio && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.bio.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center sticky bottom-0">
          <Button
            type="submit"
            disabled={isUploading || isSubmitting}
            className="flex-1 bg-red-700 hover:bg-red-800 text-white cursor-pointer"
          >
            {isSubmitting ? <> <Spinner /> Saving...</> : "Save Changes"}
          </Button>
        </div>
      </form>


      <PhotoEditor
        open={openEditor}
        imageSrc={initialFile ? URL.createObjectURL(initialFile) : null}
        onClose={() => setOpenEditor(false)}
        onCropComplete={handleCroppedImage}
        outputType={initialFile?.type || "image/jpeg"}
      />
    </div>
  );
};