import { 
  CheckCircle, Building2, Mail, Globe, Lock, Phone, MapPin, 
  Link as LinkIcon, Calendar, FileText, ShieldCheck, Info,
  Trophy, Image as ImageIcon, AlignLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ClubValidationStepProps {
  form: any;
}

export default function ClubValidationStep({ form }: ClubValidationStepProps) {
  const values = form.state.values;

  // Formater l'affichage des dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const SummaryItem = ({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) => (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground text-right ml-4">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Validation finale</h2>
        <p className="text-muted-foreground text-sm">
          Veuillez relire les informations ci-dessous avant de confirmer la création du club.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        <Card className="overflow-hidden border-primary/20">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-md flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Identité & Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-1">
            <SummaryItem label="Nom du club" value={values.name} icon={Building2} />
            <SummaryItem 
              label="Identifiant URL" 
              value={<span className="text-primary font-mono text-xs">{values.slug}.clubos.fr</span>} 
              icon={LinkIcon} 
            />
            <SummaryItem 
              label="Sport" 
              value={<Badge variant="secondary" className="capitalize">{values.category}</Badge>} 
              icon={Trophy} 
            />
            <SummaryItem label="Fédération" value={values.federation} />
            <SummaryItem 
              label="Visibilité" 
              value={
                values.isPublic ? (
                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-green-200 gap-1">
                    <Globe className="h-3 w-3" /> Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" /> Privé
                  </Badge>
                )
              } 
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Emails de gestion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <SummaryItem label="Email Privé" value={values.privateEmail} />
              <SummaryItem label="Email Public" value={values.publicEmail} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <SummaryItem label="Ville" value={values.city} />
              <SummaryItem label="Téléphone" value={values.phoneNumber} icon={Phone} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2 text-indigo-500">
              <ImageIcon className="h-5 w-5" />
              Présentation publique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SummaryItem 
                label="Logo sélectionné" 
                value={values.logo_file ? <span className="text-xs truncate max-w-[150px]">{values.logo_file.name}</span> : "Aucun"} 
              />
              <SummaryItem label="Site Web" value={values.website} />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlignLeft className="h-4 w-4" />
                <span>Description :</span>
              </div>
              <p className="text-sm p-3 bg-muted/30 rounded-lg italic">
                {values.description || "Aucune description renseignée."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/20">
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2 text-amber-600">
              <Calendar className="h-5 w-5" />
              Première Saison
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryItem label="Nom" value={values.seasonName || "Auto-généré"} />
            <SummaryItem label="Début" value={formatDate(values.seasonStartDate)} />
            <SummaryItem label="Fin" value={formatDate(values.seasonEndDate)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Champs d'adhésion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Nom complet</Badge>
              <Badge variant="outline">Date de naissance</Badge>
              <Badge variant="outline">Certificat Médical</Badge>
              {values.customFields?.map((f: any, i: number) => (
                <Badge key={i} className="bg-blue-50 text-blue-600 border-blue-200">
                  {f.label} ({f.type})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
          <div className="mt-0.5">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-green-800">Prêt pour le lancement ?</p>
            <p className="text-xs text-green-700/80 leading-relaxed">
              En cliquant sur "Créer le club", vous allez générer votre espace dédié, 
              votre première saison et préparer vos formulaires d'adhésion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}