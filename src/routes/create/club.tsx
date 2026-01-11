import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { clubValidator } from '@/shared/types/Club'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { Quote, Building2, Palette, CheckCircle, LayoutPanelTop, FileText, Calendar, ArrowRightIcon } from 'lucide-react'
import type z from 'zod'
import Stepper, { type StepType } from '@/components/ui/stepper'
import { useState } from 'react'
import { validateFormFields } from '@/lib/utils'
import { 
  MultiSteps, 
  MultiStepContent, 
  MultiStepsContents, 
  MultiStepNext, 
  MultiStepPrev 
} from '@/components/animate-ui/components/animate/multiStep'
import { Button } from '@/components/ui/button'
import ClubInfoStep from '@/components/club-form/ClubInfoStep'
import ClubShowcaseStep from '@/components/club-form/ClubShowcaseStep'
import ClubMembershipStep from '@/components/club-form/ClubMembershipStep'
import ClubSeasonStep from '@/components/club-form/ClubSeasonStep'
import ClubValidationStep from '@/components/club-form/ClubValidationStep'
import { toast } from 'sonner'


export const Route = createFileRoute('/create/club')({
  component: RouteComponent,
})

function RouteComponent() {
  type ClubFormValues = z.infer<typeof clubValidator>;
  
  const steps: StepType[] = [
    {
      name: "Informations",
      description: "Détails du club",
      icon: Building2,
    },
    {
      name: "Vitrine",
      description: "Vitrine du club",
      icon: LayoutPanelTop,
    },
    {
      name: "Adhésions",
      description: "Formulaire d'adhésions",
      icon: FileText,
    },
    {
      name: "Saison",
      description: "Gestion de la saison",
      icon: Calendar,
    },
    {
      name: "Validation",
      description: "Vérification finale",
      icon: CheckCircle,
    },
  ];
  
  const stepKeys = ["step-1", "step-2", "step-3", "step-4", "step-5"];
  const [currentStep, setCurrentStep] = useState(stepKeys[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      directorId: "",
      category: "" as any,
      federation: null,
      description: null,
      isPublic: true,
      publicEmail: "",
      privateEmail: null,
      city: "",
      phoneNumber: "",
      website: "",
      headquarters_address: null,
      logo_url: "",
      seasonName: "",
      seasonStartDate: "",
      seasonEndDate: "",
    } as ClubFormValues & {
      seasonName?: string;
      seasonStartDate?: string;
      seasonEndDate?: string;
    },
    onSubmit: async (values) => {
      console.log("Form submitted:", values);
      toast.success("Club créé avec succès !");
    },
    validators: {
      onChange: clubValidator,
    },
  });

  const validateStep = async (stepKey: string): Promise<boolean> => {
    switch (stepKey) {
      case "step-1":
        return await validateFormFields(
          form,
          ["name", "slug", "category"]
        );
      case "step-2":
        return await validateFormFields(
          form,
          ["city", "phoneNumber", "publicEmail", "isPublic"]
        );
      case "step-3":
        // Pas de validation obligatoire pour la personnalisation
        return true;
      case "step-4":
        // Pas de validation pour les adhésions (placeholder)
        return true;
      case "step-5":
        const allFields: (keyof ClubFormValues)[] = [
          "name", "slug", "category", "city", "phoneNumber", "publicEmail"
        ];
        return await validateFormFields(form, allFields);
      default:
        return true;
    }
  };

  const handleStepChange = async (newStep: string) => {
    const newIndex = stepKeys.indexOf(newStep);
    const currentIndex = stepKeys.indexOf(currentStep);
    
    if (newIndex > currentIndex) {
      const isValid = await validateStep(currentStep);
      if (!isValid) {
        return; 
      }
    }
    
    setCurrentStep(newStep);
    setCurrentStepIndex(newIndex + 1);
  };

  React.useEffect(() => {
    const index = stepKeys.indexOf(currentStep);
    if (index >= 0) {
      setCurrentStepIndex(index + 1);
    }
  }, [currentStep]);
  
  return (
    
  <SidebarProvider style={{
    "--sidebar-width": "30rem",
    "--sidebar-width-mobile": "20rem",
  } as React.CSSProperties}>
    <Sidebar variant='inset' collapsible='offcanvas' classNameSidebar='!hidden md:!hidden xl:!flex border-r-0' className='font-base p-0!'>
      <SidebarContent className="flex bg-gray-900 relative flex-col justify-end p-12 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-40 mix-blend-overlay" src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"/>
          <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-indigo-950/80'></div>
        </div>
        <div className='relative z-10 max-w-md'>
            <div className="mb-6">
                <Quote className='w-10 h-10 text-indigo-400/80 mb-4'/>
                <h2 className='text-2xl font-extrabold text-white leading-tight mb-4'>
                  ClubOS
                  Simplifiez la gestion de votre club pour vous concentrer sur le jeu.
                </h2>
                <p className='text-gray-400 text-md leading-relaxed'>
                  Rejoignez plus de 2,000 clubs qui utilisent ClubOS pour gérer leurs adhésions, leurs finances et leur communication.
                </p>
            </div>
            <div className='flex items-center space-x-4 mt-8 pt-8 border-t border-white/10'>
              <Avatar className="border-2 border-indigo-400 size-10">
                <AvatarImage
                  className=""
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-white font-bold text-sm'>
                  Mathys S.
                </p>
                <p className='text-indigo-400 text-xs text-[11px] font-bold uppercase'>
                  Président et Ceo ClubOs
                </p>
              </div>
            </div>
        </div>
      </SidebarContent>
    </Sidebar>

    <SidebarInset>
      <main className='bg-muted/40 flex flex-1 flex-col font-base p-6 min-h-screen'>
        <SidebarTrigger className="-ml-1 !hidden md:!hidden xl:!flex" />
        <div className='flex-1 overflow-y-auto px-2 lg:px-4 py-4 flex align-center justify-center'>
            <div className='xl:max-w-3xl max-w-4xl flex flex-col h-full justify-center'>
              <div className='mb-10'>
                <Stepper step={currentStepIndex} stepsList={steps} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="w-full mb-auto"
              >
                <MultiSteps
                  value={currentStep}
                  onValueChange={handleStepChange}
                  steps={stepKeys}
                  className="w-full"
                >
                  <MultiStepsContents>
                    <MultiStepContent value="step-1">
                      <ClubInfoStep form={form} />
                      <MultiStepNext
                        className="w-full py-5 mt-8"
                      >
                        Continuer
                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                      </MultiStepNext>
                    </MultiStepContent>

                    <MultiStepContent value="step-2">
                      <ClubShowcaseStep form={form} />
                      <div className="flex gap-4 mt-8">
                        <MultiStepPrev className="py-5 flex-1">Retour</MultiStepPrev>
                        <MultiStepNext
                          className="py-5 flex-1"
                        >
                          Continuer
                          <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </MultiStepNext>
                      </div>
                    </MultiStepContent>

                    <MultiStepContent value="step-3">
                      <ClubMembershipStep form={form} />
                      <div className="flex gap-4 mt-8">
                        <MultiStepPrev className="py-5 flex-1">Retour</MultiStepPrev>
                        <MultiStepNext
                          className="py-5 flex-1"
                        >
                          Continuer
                          <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </MultiStepNext>
                      </div>
                    </MultiStepContent>

                    <MultiStepContent value="step-4">
                      <ClubSeasonStep form={form} />
                      <div className="flex gap-4 mt-8">
                        <MultiStepPrev className="py-5 flex-1">Retour</MultiStepPrev>
                        <MultiStepNext
                          className="py-5 flex-1"
                        >
                          Continuer
                          <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </MultiStepNext>
                      </div>
                    </MultiStepContent>

                    <MultiStepContent value="step-5">
                      <ClubValidationStep form={form} />
                      <div className="flex gap-4 mt-8">
                        <MultiStepPrev className="py-5 flex-1">Retour</MultiStepPrev>
                        <Button
  onClick={async (e) => {
    console.log("--- DEBUG SUBMIT ---");
    console.log("Valeurs actuelles :", form.state.values);

    try {
      // 1. On teste manuellement le schéma Zod pour voir s'il bloque
      // Remplace 'clubValidator' par le nom de ton schéma importé
      const result = clubValidator.safeParse(form.state.values);
      
      if (!result.success) {
        console.error("❌ ZOD REJETTE LE FORMULAIRE :", result.error.format());
        toast.error("Zod bloque la soumission. Regarde la console.");
      } else {
        console.log("✅ ZOD EST OK. Le problème vient du handleSubmit de TanStack.");
      }

      // 2. On tente le handleSubmit
      await form.handleSubmit();
      
      // 3. On inspecte les erreurs enregistrées dans le state du form
      console.log("État des erreurs TanStack :", form.state.fieldMeta);

    } catch (err) {
      console.error("🔥 CRASH DURANT LE SUBMIT :", err);
    }
  }}
  type="submit"
  className="py-5 flex-1"
>
  Créer le club
</Button>
                      </div>
                    </MultiStepContent>
                  </MultiStepsContents>
                </MultiSteps>
              </form>
            </div>
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
  )
}
