import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldInfo from "@/components/ui/FieldInfo";
import { Palette, Type, Circle } from "lucide-react";

interface ClubCustomizationStepProps {
  form: any;
}

export default function ClubCustomizationStep({ form }: ClubCustomizationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personnalisation</h2>
        <p className="text-muted-foreground text-sm">
          Personnalisez l'apparence de votre club
        </p>
      </div>

      <div className="space-y-5 px-2">
        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="main_color"
            children={(field: any) => (
              <div>
                <Label htmlFor="main_color">Couleur principale</Label>
                <div className="relative mt-1">
                  <Palette className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                  <div className="flex gap-2">
                    <Input
                      id="main_color"
                      type="color"
                      value={field.state.value || "#000000"}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-9 w-16 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      placeholder="#000000"
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <FieldInfo field={field} />
              </div>
            )}
          />

          <form.Field
            name="secondary_color"
            children={(field: any) => (
              <div>
                <Label htmlFor="secondary_color">Couleur secondaire</Label>
                <div className="relative mt-1">
                  <Circle className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={field.state.value || "#ffffff"}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-9 w-16 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      placeholder="#ffffff"
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <FieldInfo field={field} />
              </div>
            )}
          />
        </div>

        <form.Field
          name="typography"
          children={(field: any) => (
            <div>
              <Label htmlFor="typography">Typographie</Label>
              <div className="relative mt-1">
                <Type className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <select
                  id="typography"
                  value={field.state.value || "Inter"}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="button_radius"
          children={(field: any) => (
            <div>
              <Label htmlFor="button_radius">Rayon des boutons</Label>
              <div className="relative mt-1">
                <Input
                  id="button_radius"
                  placeholder="0.5rem"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
              <FieldInfo field={field} />
              <p className="text-xs text-muted-foreground mt-1">
                Exemples: 0 (carré), 0.25rem, 0.5rem (arrondi), 9999px (complet)
              </p>
            </div>
          )}
        />

        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm font-medium mb-2">Aperçu</p>
          <div 
            className="p-4 rounded-lg text-white"
            style={{
              backgroundColor: form.state.values.main_color || "#000000",
            }}
          >
            <p style={{ color: form.state.values.secondary_color || "#ffffff" }}>
              Exemple de texte avec vos couleurs
            </p>
            <button
              className="mt-3 px-4 py-2 rounded text-sm font-medium"
              style={{
                backgroundColor: form.state.values.secondary_color || "#ffffff",
                color: form.state.values.main_color || "#000000",
                borderRadius: form.state.values.button_radius || "0.5rem",
              }}
            >
              Bouton exemple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

