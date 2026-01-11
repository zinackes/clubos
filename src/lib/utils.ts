import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AnyFormApi } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Valide des champs spécifiques d'un formulaire TanStack avec un schéma Zod
 */

export const validateFormFields = async <TData>(
  form: AnyFormApi,
  fieldsToValidate: (keyof TData)[]
): Promise<boolean> => {
  
  await Promise.all(
    fieldsToValidate.map((fieldName) => 
      form.validateField(fieldName as any, 'change')
    )
  );

  fieldsToValidate.forEach((fieldName) => {
    form.setFieldMeta(fieldName as any, (prev) => ({
      ...prev,
      isTouched: true,
    }));
  });

  const hasErrors = fieldsToValidate.some((fieldName) => {
    const meta = form.getFieldMeta(fieldName as any);
    return meta.errors && meta.errors.length > 0;
  });

  if (hasErrors) {
    toast.error("Veuillez corriger les erreurs avant de continuer.");
    return false;
  }

  return true;
};
