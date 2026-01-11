import type { AnyFormApi } from "@tanstack/react-form";
import { CheckCircle, Building2, Mail, Globe, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClubValidationStepProps {
  form: any;
}

export default function ClubValidationStep({ form }: ClubValidationStepProps) {
  const values = form.state.values;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Validation</h2>
        <p className="text-muted-foreground text-sm">
          Vérifiez toutes les informations avant de finaliser la création de votre club
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations du club
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom:</span>
              <span className="font-medium">{values.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">URL:</span>
              <span className="font-medium">{values.slug || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sport:</span>
              <span className="font-medium capitalize">{values.category || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ville:</span>
              <span className="font-medium">{values.city || "-"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email public:</span>
              <span className="font-medium">{values.publicEmail || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Téléphone:</span>
              <span className="font-medium">{values.phoneNumber || "-"}</span>
            </div>
            {values.website && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Site web:</span>
                <span className="font-medium">{values.website}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {values.description && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{values.description}</p>
            </CardContent>
          </Card>
        )}

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Toutes les informations sont correctes ? Validez pour créer votre club.
          </p>
        </div>
      </div>
    </div>
  );
}

