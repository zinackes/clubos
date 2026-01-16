import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  FileText, Plus, X, Building2, type LucideIcon, 
  Mail, Calendar, Type, CloudUpload, Paperclip 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { customFieldType } from "@/shared/types/Club";

interface ClubMembershipStepProps {
  form: any;
}

interface CustomFieldItem {
  id: string; 
  label: string;
  type: customFieldType;
  required: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Type: Type,
  Calendar: Calendar,
  Mail: Mail,
  CloudUpload: CloudUpload,
  Paperclip: Paperclip,
};

export default function ClubMembershipStep({ form }: ClubMembershipStepProps) {
  const requiredFields = [
    { label: 'Nom & Prénom', icon: 'Type' },
    { label: "Date de naissance", icon: 'Calendar' },
    { label: "Email & Telephone", icon: 'Mail' },
    { label: "Photo d'identité", icon: 'CloudUpload' },
    { label: "Certificat Médical", icon: 'Paperclip' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Formulaire d'adhésion</h2>
        <p className="text-muted-foreground text-sm">
          Configurez les champs du formulaire d'adhésion pour votre club
        </p>
      </div>

      <div className="space-y-5 px-2">
        {/* CHAMPS FIXES */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Champs obligatoires</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {requiredFields.map((field, index) => {
              const IconComponent = ICON_MAP[field.icon] || Building2;
              return (
                <div key={index} className="relative">
                  <IconComponent className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                  <Input
                    value={field.label}
                    className="pl-9 bg-muted/50 cursor-not-allowed"
                    readOnly
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <form.Field
          name="customFields"
          children={(field: any) => {
            const currentFields = (field.state.value || []) as CustomFieldItem[];

            const addField = () => {
              const newField: CustomFieldItem = {
                id: `custom-${Date.now()}`,
                label: "",
                type: "text",
                required: false,
              };
              field.handleChange([...currentFields, newField]);
            };

            const removeField = (id: string) => {
              field.handleChange(currentFields.filter((f) => f.id !== id));
            };

            const updateField = (id: string, updates: Partial<CustomFieldItem>) => {
              field.handleChange(
                currentFields.map((f) => (f.id === id ? { ...f, ...updates } : f))
              );
            };

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Champs supplémentaires</h3>
                    <p className="text-sm text-muted-foreground">
                      Ajoutez des infos spécifiques à votre club
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={addField}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un champ
                  </Button>
                </div>

                {currentFields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/30">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">Aucun champ ajouté</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentFields.map((item) => (
                      <Card key={item.id} className="border-border">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-4">
                              <div>
                                <Label>Libellé du champ *</Label>
                                <Input
                                  placeholder="Ex: Taille du maillot"
                                  value={item.label}
                                  onChange={(e) => updateField(item.id, { label: e.target.value })}
                                  className="mt-2"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Type</Label>
                                  <Select
                                    value={item.type}
                                    onValueChange={(val) => updateField(item.id, { type: val as any })}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Texte</SelectItem>
                                      <SelectItem value="email">Email</SelectItem>
                                      <SelectItem value="phone_number">Téléphone</SelectItem>
                                      <SelectItem value="date">Date</SelectItem>
                                      <SelectItem value="integer">Nombre</SelectItem>
                                      <SelectItem value="file">Fichier</SelectItem>
                                      <SelectItem value="boolean">Case à cocher</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex items-end">
                                  <div className="flex items-center space-x-2 h-9">
                                    <input
                                      type="checkbox"
                                      id={`req-${item.id}`}
                                      checked={item.required}
                                      onChange={(e) => updateField(item.id, { required: e.target.checked })}
                                      className="h-4 w-4 rounded border-input"
                                    />
                                    <Label htmlFor={`req-${item.id}`} className="text-sm cursor-pointer">
                                      Obligatoire
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeField(item.id)}
                              className="text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}