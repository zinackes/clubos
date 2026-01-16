import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldInfo from "@/components/ui/FieldInfo";
import { Mail, Phone, MapPin, Link as LinkIcon, TextAlignStart } from "lucide-react";

interface ClubShowcaseStepProps {
  form: any;
}

export default function ClubShowcaseStep({ form }: ClubShowcaseStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Vitrine du club</h2>
        <p className="text-muted-foreground text-sm">
          Informations de contact affichées publiquement
        </p>
      </div>

    
      <div className="space-y-5 px-2">


      <form.Field
          name="logo_file"
          children={(field: any) => (
            <div>
              <Label htmlFor="logo_file">Logo</Label>
              <div className="relative mt-2">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="logo_file"
                  type="file"
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const file = e.target.files?.[0]; 
                    if (file) {
                      field.setValue(file);
                    }
                  }}
                  className="pl-9"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="description"
          children={(field: any) => (
            <div>
              <Label htmlFor="description">Description du club</Label>
              <div className="relative mt-2">
                <TextAlignStart className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="description"
                  placeholder="Décrivez l'histoire et les valeurs de votre club..."
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="pl-9 min-h-[120px] resize-none"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="publicEmail"
          children={(field: any) => (
            <div>
              <Label htmlFor="publicEmail">Email public *</Label>
              <div className="relative mt-2">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="publicEmail"
                  type="email"
                  placeholder="contact@club.fr"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);

                    if (field.state.meta.errors.length > 0) {
                      field.setMeta((prev : any) => ({
                        ...prev,
                        errors: [],
                        errorMap: {
                          ...prev.errorMap,
                          onChange: undefined,
                        },
                      }));
                    }
                  }}
                  className="pl-9"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="phoneNumber"
          children={(field: any) => (
            <div>
              <Label htmlFor="phoneNumber">Téléphone *</Label>
              <div className="relative mt-2">
                <Phone className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="phoneNumber"
                  placeholder="01 23 45 67 89"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    
                    if (field.state.meta.errors.length > 0) {
                      field.setMeta((prev : any) => ({
                        ...prev,
                        errors: [],
                        errorMap: {
                          ...prev.errorMap,
                          onChange: undefined,
                        },
                      }));
                    }
                  }}
                  className="pl-9"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="city"
          children={(field: any) => (
            <div>
              <Label htmlFor="city">Ville *</Label>
              <div className="relative mt-2">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="city"
                  placeholder="Ex: Paris"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="pl-9"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="address"
          children={(field: any) => (
            <div>
              <Label htmlFor="address">Adresse du club</Label>
              <div className="relative mt-2">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="address"
                  placeholder="Ex: 123 Rue de la République, 75001 Paris"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value || null)}
                  className="pl-9"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="website"
          children={(field: any) => (
            <div>
              <Label htmlFor="website">Site web</Label>
              <div className="relative mt-2">
                <LinkIcon className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.votreclub.fr"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value || null)}
                  className="pl-9"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />
      </div>
    </div>
  );
}

