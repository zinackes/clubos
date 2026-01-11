import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Plus, X, Building2, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClubMembershipStepProps {
  form: any;
}

interface CustomField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "date" | "number";
  required: boolean;
}

export default function ClubMembershipStep({ form }: ClubMembershipStepProps) {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const values = form.state.values;

  const addCustomField = () => {
    const newField: CustomField = {
      id: `custom-${Date.now()}`,
      label: "",
      type: "text",
      required: false,
    };
    setCustomFields([...customFields, newField]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Formulaire d'adhésion</h2>
        <p className="text-muted-foreground text-sm">
          Configurez les champs du formulaire d'adhésion pour votre club
        </p>
      </div>

      <div className="space-y-5 px-2">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Champs obligatoires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name-readonly">Nom du club</Label>
              <div className="relative mt-1">
                <Building2 className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="name-readonly"
                  value={values.name || ""}
                  className="pl-9 bg-muted/50 cursor-not-allowed"
                  readOnly
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ce champ sera toujours présent dans le formulaire d'adhésion
              </p>
            </div>

            <div>
              <Label htmlFor="slug-readonly">URL du club</Label>
              <div className="relative mt-1">
                <LinkIcon className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="slug-readonly"
                  value={values.slug || ""}
                  className="pl-9 bg-muted/50 cursor-not-allowed"
                  readOnly
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ce champ sera toujours présent dans le formulaire d'adhésion
              </p>
            </div>

            <div>
              <Label htmlFor="category-readonly">Sport</Label>
              <Input
                id="category-readonly"
                value={values.category ? values.category.charAt(0).toUpperCase() + values.category.slice(1) : ""}
                className="bg-muted/50 cursor-not-allowed capitalize"
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ce champ sera toujours présent dans le formulaire d'adhésion
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Champs supplémentaires</h3>
              <p className="text-sm text-muted-foreground">
                Ajoutez des champs personnalisés au formulaire d'adhésion
              </p>
            </div>
            <Button
              type="button"
              onClick={addCustomField}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un champ
            </Button>
          </div>

          {customFields.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/30">
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Aucun champ supplémentaire ajouté
              </p>
              <p className="text-xs text-muted-foreground/70 text-center mt-1">
                Cliquez sur "Ajouter un champ" pour commencer
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {customFields.map((field) => (
                <Card key={field.id} className="border-border">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <div>
                            <Label htmlFor={`custom-label-${field.id}`}>
                              Libellé du champ *
                            </Label>
                            <Input
                              id={`custom-label-${field.id}`}
                              placeholder="Ex: Date de naissance"
                              value={field.label}
                              onChange={(e) =>
                                updateCustomField(field.id, {
                                  label: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`custom-type-${field.id}`}>
                                Type de champ
                              </Label>
                              <select
                                id={`custom-type-${field.id}`}
                                value={field.type}
                                onChange={(e) =>
                                  updateCustomField(field.id, {
                                    type: e.target.value as CustomField["type"],
                                  })
                                }
                                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] mt-1"
                              >
                                <option value="text">Texte</option>
                                <option value="email">Email</option>
                                <option value="tel">Téléphone</option>
                                <option value="date">Date</option>
                                <option value="number">Nombre</option>
                              </select>
                            </div>

                            <div className="flex items-end">
                              <div className="flex items-center space-x-2 h-9">
                                <input
                                  type="checkbox"
                                  id={`custom-required-${field.id}`}
                                  checked={field.required}
                                  onChange={(e) =>
                                    updateCustomField(field.id, {
                                      required: e.target.checked,
                                    })
                                  }
                                  className="h-4 w-4 rounded border-input"
                                />
                                <Label
                                  htmlFor={`custom-required-${field.id}`}
                                  className="cursor-pointer text-sm"
                                >
                                  Champ obligatoire
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomField(field.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

