import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input.tsx";
import { z } from "zod";
import FieldInfo from "@/components/ui/FieldInfo.tsx";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  Baby,
  Dribbble,
  Eye,
  EyeOff,
  HeartHandshake,
  LayoutDashboard,
  Lock,
  Mail,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { authClient } from "@/lib/auth-client.ts";
import { getFrenchTranslation } from "@/lib/translation.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { LoaderCircle } from "@/components/animate-ui/icons/loader-circle.tsx";
import {GoogleAuth} from "@/components/ui/auth/GoogleAuth.tsx";
import { FacebookAuth } from "@/components/ui/auth/FacebookAuth";
import { toast } from "sonner";
import {
  MultiStepContent,
  MultiStepNext,
  MultiStepPrev,
  MultiSteps,
  MultiStepsContents,
} from "@/components/animate-ui/components/animate/multiStep.tsx";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import { Alert, AlertTitle } from "@/components/ui/alert.tsx";
import { useAddRoles } from "@/hooks/requests/useAddRoles";

export const Route = createFileRoute("/_auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const register = z
    .object({
      name: z.string(),
      firstName: z.string("Le prénom doit être une chaîne de caractère"),
      lastName: z.string("Le nom doit être une chaîne de caractère"),
      email: z
        .email("le mail est incorrect")
        .min(1, "L'adresse mail est requise"),
      password: z
        .string("Le mot de passe doit être une chaîne de caractère")
        .min(8, "Le mot de passe doit comprendre 8 caractères minimum"),
      confirmPassword: z
        .string("Le mot de passe doit être une chaîne de caractère")
        .min(8, "Le mot de passe doit comprendre 8 caractères minimum"),
      roles: z.array(z.string()).min(1, "Sélectionnez au moins un rôle"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    });

  const { mutate, error} =  useAddRoles();

  const form = useForm({
    defaultValues: {
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      roles: [] as string[],
    },
    onSubmit: async (values) => {
      console.log(values);

      // @ts-ignore
      const { data, error } = await authClient.signUp.email(
        {
          name: values.value.firstName + " " + values.value.lastName,
          first_name: values.value.firstName,
          last_name: values.value.lastName,
          email: values.value.email,
          password: values.value.password,
        },
        {
          redirectTo: "http://localhost:5173/",

          onResponse: async (res) => {
            setIsPending(false);
            console.log(res);
            if(res.response.ok){
                const tempRes = res.response.clone();
                const bodyJson = await tempRes.json();
              mutate({
                userId: bodyJson.user.id,
                roles: values.value.roles
              });
            }

          },
          onRequest: () => {
            setIsPending(true);
          },
          onSuccess: () => {
            toast.success("Votre compte à bien été crée !");
            //navigate({ to: "/login"});
          },
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              toast.error("Veuillez verifier votre adresse mail");
            }
            console.log(ctx.error.code);
            setSignUpError(getFrenchTranslation(ctx.error.code ?? ""));
          },
        },
      );
    },
    validators: {
      onChange: register,
    },
  });

  const validateFields = async (fieldsToValidate: (keyof typeof form.state.values)[]) => {
    const values = form.state.values;
    const result = register.safeParse(values);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      let hasErrors = false;

      fieldsToValidate.forEach((name) => {
        if (errors[name as keyof typeof errors]) {
          hasErrors = true;

          form.setFieldMeta(name as any, (prev) => ({
            ...prev,
            isTouched: true,
            error: errors[name as keyof typeof errors]?.[0]
          }));

          form.validateField(name as any, 'change');
        }
      });

      console.log(form);

      if (hasErrors) {
        toast.error("Veuillez remplir correctement tous les champs.");
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <div
        className={
          "w-full flex-1 grid grid-cols-1 md:grid-cols-7 grid-rows-1 font-base"
        }
      >
        <div
          className={
            "flex flex-col md:col-span-4 xl:col-span-3 p-8 md:p-12 lg:p-14 xl:p-16 justify-center relative z-10"
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={"flex items-center justify-center"}
          >
            <MultiSteps
              defaultValue="step-1"
              steps={["step-1", "step-2"]}
              className="w-full max-w-lg"
            >
              <MultiStepsContents>
                <MultiStepContent value="step-1">
                  <div className={"mb-10"}>
                    <h1
                      className={
                        "font-title text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-light"
                      }
                    >
                      Commencez votre journée
                    </h1>
                    <p className={"text-slate-500 text-md font-base"}>
                      Rejoignez des milliers de clubs qui gèrent leurs activités
                      sportives
                    </p>
                  </div>

                  <div className={"space-y-5 font-base"}>
                    <div className={"grid grid-cols-2 gap-4"}>
                      <form.Field
                        name={"firstName"}
                        children={(field) => (
                          <>
                            <div>
                              <Input
                                placeholder={"Prénom"}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                              <FieldInfo field={field} />
                            </div>
                          </>
                        )}
                      />

                      <form.Field
                        name={"lastName"}
                        children={(field) => (
                          <>
                            <div>
                              <Input
                                placeholder={"Nom"}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                              <FieldInfo field={field} />
                            </div>
                          </>
                        )}
                      />
                    </div>
                    <form.Field
                      name={"email"}
                      children={(field) => (
                        <div>
                          <div className={"relative"}>
                            <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="bg-background pl-9"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Adresse mail"
                              type="email"
                            />
                          </div>
                          <FieldInfo field={field} />
                        </div>
                      )}
                    />

                    <form.Field
                      name={"password"}
                      children={(field) => (
                        <div>
                          <div className="relative">
                            <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="bg-background pl-9"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Mot de passe"
                              type={showPassword ? "text" : "password"}
                            />
                            <Button
                              className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              size="icon"
                              type="button"
                              variant="ghost"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                          <FieldInfo field={field} />
                        </div>
                      )}
                    />

                    <form.Field
                      name={"confirmPassword"}
                      children={(field) => (
                        <div>
                          <div className="relative">
                            <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="bg-background pl-9"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Confirmer votre mot de passe"
                              type={showConfirmPassword ? "text" : "password"}
                            />
                            <Button
                              className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              size="icon"
                              type="button"
                              variant="ghost"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                          <FieldInfo field={field} />
                        </div>
                      )}
                    />
                  </div>
                  <MultiStepNext
                    onClick={async () => {
                      const isValid = await validateFields([
                          "firstName", "lastName", "email", "password", "confirmPassword"
                        ]);
                        if (!isValid) throw new Error("Validation failed");
                    }}
                    className={"w-full py-5 mt-5"}
                  >
                    Continuer
                    <ArrowRightIcon className="h-5 w-5" />
                  </MultiStepNext>
                </MultiStepContent>

                <MultiStepContent value="step-2">
                  <div className={"mb-10"}>
                    <h1
                      className={
                        "font-title text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-light"
                      }
                    >
                      Choisissez vos profils
                    </h1>
                    <p className={"text-slate-500 text-md font-base"}>
                      Sélectionnez vos rôles pour personnaliser votre tableau de
                      bord et accéder aux outils adaptés à votre quotidien.
                    </p>
                  </div>

                  <div className={"space-y-5 font-base"}>
                    <form.Field
                      name={"roles"}
                      children={(field) => {
                        const rolesOptions = [
                          {
                            id: "owner",
                            label: "Propriétaire",
                            value: "owner",
                            icon: LayoutDashboard,
                            description:
                              "Créez et gérez votre structure sportive, les finances et les accès administrateurs.",
                          },
                          {
                            id: "coach",
                            label: "Coach",
                            value: "coach",
                            icon: Trophy,
                            description:
                              "Pilotez vos équipes, planifiez les entraînements et suivez les performances.",
                          },
                          {
                            id: "player",
                            label: "Joueur",
                            value: "player",
                            icon: Dribbble,
                            description:
                              "Consultez votre planning, confirmez votre présence et suivez vos statistiques.",
                          },
                          {
                            id: "parent",
                            label: "Parent",
                            value: "parent",
                            icon: HeartHandshake,
                            description:
                              "Gérez les inscriptions de vos enfants et restez informé des activités du club.",
                          },
                          {
                            id: "child",
                            label: "Enfant",
                            value: "child",
                            icon: Baby,
                            description:
                              "Visualise tes entraînements et tes succès au sein de ton équipe.",
                          },
                          {
                            id: "visitor",
                            label: "Visiteur",
                            value: "visitor",
                            icon: Eye,
                            description:
                              "Suivez les actualités, les résultats et les événements publics du club.",
                          },
                        ];

                        return (
                          <div className={"space-y-4"}>
                            <div
                              className={
                                "grid grid-cols-1 md:grid-cols-2 gap-3 px-1"
                              }
                            >
                              {rolesOptions.map((role) => {
                                const isSelected = field.state.value?.includes(
                                  role.value,
                                );
                                const Icon = role.icon;

                                return (
                                  <Card
                                    key={role.id}
                                    className={cn(
                                      "cursor-pointer shadow-none transition duration-300 py-4 gap-0",
                                      isSelected
                                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                                        : "hover:bg-gray-50 hover:border-gray-300",
                                    )}
                                    onClick={() => {
                                      const currentValue =
                                        field.state.value || [];
                                      if (isSelected) {
                                        field.handleChange(
                                          currentValue.filter(
                                            (v) => v !== role.value,
                                          ),
                                        );
                                      } else {
                                        // @ts-ignore
                                        field.handleChange([
                                          ...currentValue,
                                          role.value,
                                        ]);
                                      }
                                      console.log(field.state.value);
                                    }}
                                  >
                                    <CardHeader
                                      className={
                                        "flex flew-row items-start gap-4 space-y-0 px-4"
                                      }
                                    >
                                      <div className="flex items-start gap-4">
                                        <Icon className={`w-12`} />
                                        <div className="flex-1 min-w-0">
                                          <CardTitle
                                            className={`text-base font-bold ${isSelected ? "text-indigo-900" : "text-slate-900"}`}
                                          >
                                            {role.label}
                                          </CardTitle>
                                          <CardDescription
                                            className={cn(
                                              "text-xs leading-snug break-words",
                                              isSelected
                                                ? "text-indigo-700/80"
                                                : "text-slate-500",
                                            )}
                                          >
                                            {role.description}
                                          </CardDescription>
                                        </div>
                                      </div>
                                    </CardHeader>
                                  </Card>
                                );
                              })}
                            </div>

                            <FieldInfo field={field} />
                          </div>
                        );
                      }}
                    />
                  </div>

                  <div className="flex gap-4 my-5 justify-between">
                    <MultiStepPrev className="py-5">Retour</MultiStepPrev>
                    <Button
                      type="submit"
                      disabled={isPending}
                      onClick={async (e) => {
                        e.preventDefault();
                        const isValid = await validateFields(["roles"]);
                        if (isValid) {
                          form.handleSubmit({ submitAction: "continue" })
                        }
                      }
                      }
                      className={"py-5 px-10 flex gap-2"}
                    >
                      {isPending ? (
                        <LoaderCircle animate={true} />
                      ) : (
                        <>
                          S'inscrire
                          <ArrowRightIcon className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                  {signUpError && (
                    <Alert variant={"destructive"}>
                      <AlertCircleIcon />
                      <AlertTitle>{signUpError}</AlertTitle>
                    </Alert>
                  )}
                </MultiStepContent>
              </MultiStepsContents>
            </MultiSteps>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">
                Ou continuer avec
              </span>
            </div>
          </div>
          <div className={"grid grid-cols-2 gap-3"}>
            <GoogleAuth />
            <FacebookAuth />
          </div>
          <p className={"mt-8 text-center text-sm text-slate-500"}>
            Déja un compte ?{" "}
            <a
              href={"/login"}
              className={
                "font-semibold text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
              }
            >
              Connectez-vous
            </a>
          </p>
        </div>

        <div
          className={
            "hidden md:flex bg-indigo-900 relative overflow-hidden md:col-span-3 xl:col-span-4"
          }
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop')`,
            }}
          ></div>
          <div
            className={
              "absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-blue-900/90"
            }
          ></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

          <div
            className={
              "relative z-10 flex flex-col justify-between md:p-12 lg:p-14 xl:p-16 w-full text-white h-full"
            }
          >
            <div className={"space-y-8 my-auto"}>
              <div className={"space-y-4"}>
                <h2
                  className={
                    "text-3xl xl:text-4xl font-bold leading-tight tracking-light"
                  }
                >
                  Une plateforme pour gérer
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                    tout vos clubs de sport.
                  </span>
                </h2>
                <p className={"text-indigo-200 text-md max-w-md"}>
                  Rejoignez des milliers d'entraîneurs, de parents et d'athlètes
                  qui gèrent leur quotidien sportif avec ClubOS.
                </p>
              </div>
              <div className={"grid grid-cols-2 gap-4"}>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center mb-3 text-indigo-200">
                    <Trophy />
                  </div>
                  <div className="text-2xl font-bold">12+</div>
                  <div className="text-sm text-indigo-200">Sports inclus</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center mb-3 text-blue-200">
                    <Users />
                  </div>
                  <div className="text-2xl font-bold">50k+</div>
                  <div className="text-sm text-indigo-200">Membres actifs</div>
                </div>
              </div>

              <div className={"pt-8 border-t border-white/10"}>
                <div className={"flex items-center gap-4"}>
                  <div className="flex -space-x-2 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:ring-indigo-900 ">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/maxleiter.png"
                        alt="@maxleiter"
                      />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/evilrabbit.png"
                        alt="@evilrabbit"
                      />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <Avatar className={"bg-white"}>
                      <p
                        className={
                          "text-indigo-900 text-xs absolute inset-0 flex items-center justify-center"
                        }
                      >
                        +2k
                      </p>
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                  </div>

                  <div>
                    <div className={"flex gap-0.5 mb-1.5"}>
                      <Star
                        size={15}
                        className="text-yellow-400"
                        fill={"currentColor"}
                      />
                      <Star
                        size={15}
                        className="text-yellow-400"
                        fill={"currentColor"}
                      />
                      <Star
                        size={15}
                        className="text-yellow-400"
                        fill={"currentColor"}
                      />
                      <Star
                        size={15}
                        className="text-yellow-400"
                        fill={"currentColor"}
                      />
                      <Star
                        size={15}
                        className="text-yellow-400"
                        fill={"currentColor"}
                      />
                    </div>
                    <p className={"text-xs text-indigo-200"}>
                      Reconnu par les meilleurs clubs du monde
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
