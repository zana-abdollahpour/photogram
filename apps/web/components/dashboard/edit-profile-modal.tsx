import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/lib/trpc/client";
import {
  UpdateProfileInput,
  updateProfileSchema,
  UserProfile,
} from "@repo/trpc/schemas";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditProfileModalProps {
  open: boolean;
  profile: UserProfile;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({
  open,
  profile,
  onOpenChange,
}: EditProfileModalProps) {
  const utils = trpc.useUtils();

  const updateProfileMutation = trpc.usersRouter.updateProfile.useMutation({
    onSuccess: () => {
      utils.usersRouter.getUserProfile.invalidate({ userId: profile.id });
    },
  });

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name,
      bio: profile.bio || "",
      website: profile.website || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: profile.name,
      bio: profile.bio || "",
      website: profile.website || "",
    });
  }, [profile, form]);

  const isSubmitting = form.formState.isSubmitting;
  const bio = form.watch("bio");

  const handleSubmit = (data: UpdateProfileInput) => {
    updateProfileMutation.mutate(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 py-4"
          noValidate
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Your name"
                  maxLength={50}
                  disabled={isSubmitting}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="bio"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Tell people about yourself..."
                  rows={4}
                  maxLength={150}
                  disabled={isSubmitting}
                  aria-invalid={fieldState.invalid}
                />
                <div className="text-muted-foreground mt-1 text-sm">
                  {bio?.length || 0}/150 characters
                </div>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="website"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Website</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="url"
                  placeholder="https://example.com"
                  disabled={isSubmitting}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
