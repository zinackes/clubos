import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldInfo from "@/components/ui/FieldInfo";
import { Building2, Mail, Phone, MapPin, Link as Lock, Globe, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ClubInfoStepProps {
  form: any;
}

export default function ClubInfoStep({ form }: ClubInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Informations du club</h2>
        <p className="text-muted-foreground text-sm">
          Renseignez les informations de base de votre club
        </p>
      </div>

      <div className="space-y-5 px-2">
        <form.Field
          name="name"
          children={(field: any) => (
            <div>
              <Label htmlFor="name">Nom du club *</Label>
              <div className="relative mt-2">
                <Building2 className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="name"
                  placeholder="Ex: Club de Football de Paris"
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
          name="slug"
          children={(field: any) => (
            <div>
              <Label htmlFor="slug">Identifiant unique du club *</Label>
              <div className="relative mt-2 flex items-center">
                <Input
                  id="slug"
                  placeholder="nom-de-votre-club"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>{
                    field.handleChange(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")
                    )

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
                  }
                    
                  }
                  className="pr-[90px] font-medium"
                />
                
                <div className="absolute right-3 flex items-center pointer-events-none select-none border-l pl-3 h-5 border-border">
                  <span className="text-sm font-semibold text-muted-foreground">
                    .clubos.fr
                  </span>
                </div>
              </div>

              <FieldInfo field={field} />
              
              <p className="text-[11px] text-muted-foreground mt-2 italic">
                Votre espace sera accessible sur : <span className="text-indigo-500 font-mono">https://{field.state.value || "..."}.clubos.fr</span>
              </p>
            </div>
          )}
        />

        
        <form.Field
          name="privateEmail"
          children={(field: any) => (
            <div>
              <Label htmlFor="privateEmail">Email privé *</Label>
              <div className="relative mt-2">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="privateEmail"
                  type="email"
                  placeholder="personnel@gmail.com"
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
              <p className="text-[11px] text-muted-foreground mt-2 italic">
                Le mail qui sera utilisé pour vous communiquez les informations du club, pas visible au public.
              </p>
            </div>
          )}
        />

        <div className="flex w-full gap-4">
          <form.Field
            name="category"
            children={(field: any) => (
              <div className="flex-1">
                <Label htmlFor="category">Sport *</Label>
                <div className="relative mt-2">
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as any)}
                  >
                    <SelectTrigger 
                      id="category"
                      onBlur={field.handleBlur}
                      className={`w-full ${field.state.meta.errors.length > 0 && field.state.meta.isToucheds ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Sélectionnez un sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FieldInfo field={field} />
              </div>
            )}
          />

          <form.Field
            name="federation"
            children={(field: any) => (
              <div className="flex-1">
                <Label htmlFor="federation">Fédération</Label>
                <Input
                  className="mt-2"
                  id="federation"
                  placeholder="Ex: FFF (optionnel)"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value || null)}
                />
                <FieldInfo field={field} />
              </div>
            )}
          />
        </div>

        <form.Field
          name="isPublic"
          children={(field: any) => (
            <div className="space-y-3">
              <Label htmlFor="isPublic">Visibilité <span className="text-red-500">*</span></Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => field.handleChange(true)}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group outline-none ${
                    field.state.value === true
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      field.state.value === true ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}>
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className={`font-bold text-sm ${field.state.value === true ? 'text-gray-900' : 'text-gray-600'}`}>
                      Club Public
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Votre club est visible dans la recherche globale. Idéal pour recruter.
                  </p>
                  {field.state.value === true && (
                    <div className="absolute top-3 right-3 animate-fade-in">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => field.handleChange(false)}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group outline-none ${
                    field.state.value === false
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      field.state.value === false ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}>
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className={`font-bold text-sm ${field.state.value === false ? 'text-gray-900' : 'text-gray-600'}`}>
                      Club Privé
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Accessible uniquement via invitation ou code secret.
                  </p>
                  {field.state.value === false && (
                    <div className="absolute top-3 right-3 animate-fade-in">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </button>
              </div>

              <FieldInfo field={field} />
            </div>
          )}
        />
      </div>
    </div>
  );
}

