import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldInfo from "@/components/ui/FieldInfo";
import { Calendar, CalendarDays } from "lucide-react";

interface ClubSeasonStepProps {
  form: any;
}

export default function ClubSeasonStep({ form }: ClubSeasonStepProps) {
  const values = form.state.values;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configuration de la saison</h2>
        <p className="text-muted-foreground text-sm">
          Définissez les informations de base de votre saison
        </p>
      </div>

      <div className="space-y-5 px-2">
        <form.Field
          name="seasonName"
          children={(field: any) => (
            <div>
              <Label htmlFor="seasonName">
                Nom de la saison <span className="text-muted-foreground">(optionnel)</span>
              </Label>
              <div className="relative mt-1">
                <CalendarDays className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="seasonName"
                  placeholder="Ex: Saison 2024-2025"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="pl-9"
                />
              </div>
              <FieldInfo field={field} />
              <p className="text-xs text-muted-foreground mt-1">
                Si non renseigné, le nom sera généré automatiquement à partir des dates
              </p>
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="seasonStartDate"
            children={(field: any) => (
              <div>
                <Label htmlFor="seasonStartDate">Date de début *</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                  <Input
                    id="seasonStartDate"
                    type="date"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.handleChange(value);
                    }}
                    className="pl-9"
                    required
                  />
                </div>
                <FieldInfo field={field} />
                <p className="text-xs text-muted-foreground mt-1">
                  Date de début de la saison
                </p>
              </div>
            )}
          />

          <form.Field
            name="seasonEndDate"
            children={(field: any) => {
              const startDate = form.state.values.seasonStartDate || "";
              const endDate = field.state.value || "";
              
              return (
                <div>
                  <Label htmlFor="seasonEndDate">Date de fin *</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                    <Input
                      id="seasonEndDate"
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Réinitialiser si la date de début est postérieure
                        if (startDate && value && startDate > value) {
                          field.handleChange("");
                        } else {
                          field.handleChange(value);
                        }
                      }}
                      className="pl-9"
                      required
                    />
                  </div>
                  <FieldInfo field={field} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Date de fin de la saison (doit être après la date de début)
                  </p>
                  {startDate && endDate && startDate > endDate && (
                    <p className="text-xs text-destructive mt-1">
                      La date de fin doit être postérieure à la date de début
                    </p>
                  )}
                </div>
              );
            }}
          />
        </div>

        {values.seasonStartDate && values.seasonEndDate && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
              <Calendar className="h-4 w-4" />
              Durée de la saison
            </div>
            <p className="text-sm text-muted-foreground">
              Du {new Date(values.seasonStartDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })} au{" "}
              {new Date(values.seasonEndDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {values.seasonStartDate > values.seasonEndDate && (
              <p className="text-sm text-destructive mt-2">
                La date de fin doit être postérieure à la date de début
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

