import { createFileRoute } from '@tanstack/react-router'
import {useForm} from "@tanstack/react-form";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import FieldInfo from "@/components/ui/FieldInfo.tsx";
import {AlertCircleIcon, ArrowRightIcon, Eye, EyeOff, Lock, Mail, Star, Trophy, Users} from "lucide-react";
import { useState } from 'react';
import {Button} from "@/components/ui/button.tsx";
import {authClient} from "@/lib/auth-client.ts";
import {getFrenchTranslation} from "@/lib/translation.ts";
import {Alert, AlertTitle} from "@/components/ui/alert.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {LoaderCircle} from "@/components/animate-ui/icons/loader-circle.tsx";
import {GoogleAuth} from "@/components/ui/GoogleAuth.tsx";
import {FacebookAuth} from "@/components/ui/FacebookAuth.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Label} from "@/components/ui/label.tsx";

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent
})

function RouteComponent() {
    const [showPassword, setShowPassword] = useState(false);
    const [signInError, setSignInError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const register = z.object({
        email: z.email("le mail est incorrect"),
        password: z.string("Le mot de passe doit être une chaîne de caractère").min(8, "Le mot de passe doit comprendre 8 caractères minimum"),
        rememberMe: z.boolean("Se souvenir de moi doit être un booléen")
    })

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        onSubmit: async (values) => {
            console.log(values);

            setIsPending(true);
            const {data, error} = await authClient.signIn.email({
                email: values.value.email,
                password: values.value.password,
                rememberMe: values.value.rememberMe,
            })
            setIsPending(false);

            console.log(data);
            console.log(error);
            if(error){
                setSignInError(getFrenchTranslation(error.code ?? ""))
            }

        },
        validators: {
            onBlur: register
        }
    })

  return (
    <>
        <div className={"w-full flex-1 grid grid-cols-2 grid-rows-1 font-base"}>
            <div className={"flex flex-col p-8 md:p-12 lg:p-16 justify-center relative z-10"}>
                <div className={"mb-10"}>
                    <h1 className={"font-title text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-light"}>Bon retour</h1>
                    <p className={"text-slate-500 text-md font-base"}>Entrez vos informations pour accéder à votre tableau de bord.</p>
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }} className={"space-y-5 font-base"}>
                    <form.Field
                        name={"email"}
                        children={(field) => (
                            <div >
                                <div className={"relative"}>
                                    <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="bg-background pl-9"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
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
                            <div >
                                <div className="relative">
                                    <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="bg-background pl-9"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
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
                        name={"rememberMe"}
                        children={(field) => (
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="rememberMe"
                                    checked={field.state.value}
                                    onBlur={field.handleBlur}
                                    onCheckedChange={(checked) =>
                                        field.handleChange(!!checked)
                                    }
                                />
                                <Label htmlFor="rememberMe">Se souvenir de moi</Label>

                                <FieldInfo field={field} />
                            </div>
                        )}
                    />

                    <Button
                        type={"submit"}
                        className={"w-full py-5"}
                        onClick={() =>form.handleSubmit({ submitAction: "continue"})}
                    >
                        {isPending ? <LoaderCircle animate={true} /> : (
                            <>
                                Se connecter
                                <ArrowRightIcon className="h-5 w-5" />
                            </>
                        )
                        }

                    </Button>
                    {signInError && (
                        <Alert variant={"destructive"}>
                            <AlertCircleIcon/>
                            <AlertTitle>
                                {signInError}
                            </AlertTitle>
                        </Alert>
                    )}
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm"><span
                        className="px-4 bg-white text-slate-400">Ou continuer avec</span></div>
                </div>
                <div className={"grid grid-cols-2 gap-3"}>
                    <GoogleAuth/>
                    <FacebookAuth/>
                </div>
                <p className={"mt-8 text-center text-sm text-slate-500"}>
                    Pas de compte ?
                    {" "}
                    <a href={"/signup"} className={"font-semibold text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"}>
                        Se créer un compte</a>
                </p>
            </div>

            <div className={"hidden lg:flex bg-indigo-900 relative overflow-hidden"}>
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                     style={{backgroundImage: `url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop')`}}>
                </div>
                <div className={"absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-blue-900/90"}></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

                <div className={"relative z-10 flex flex-col justify-between md:p-12 lg:p-14 xl:p-16 w-full text-white h-full"}>
                    <div className={"space-y-8 my-auto"}>
                        <div className={"space-y-4"}>
                            <h2 className={"text-3xl xl:text-4xl font-bold leading-tight tracking-light"}>
                                Une plateforme pour gérer
                                <br/>
                                <span  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">tout vos clubs de sport.</span>
                            </h2>
                            <p className={"text-indigo-200 text-md max-w-md"}>
                                Rejoignez des milliers d'entraîneurs, de parents et d'athlètes qui gèrent leur quotidien sportif avec ClubOS.
                            </p>
                        </div>
                        <div className={"grid grid-cols-2 gap-4"}>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <div
                                    className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center mb-3 text-indigo-200">
                                    <Trophy/>
                                </div>
                                <div className="text-2xl font-bold">12+</div>
                                <div className="text-sm text-indigo-200">Sports inclus</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <div
                                    className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center mb-3 text-blue-200">
                                    <Users/>
                                </div>
                                <div className="text-2xl font-bold">50k+</div>
                                <div className="text-sm text-indigo-200">Membres actifs</div>
                            </div>
                        </div>

                        <div className={"pt-8 border-t border-white/10"}>
                            <div className={"flex items-center gap-4"}>
                                <div className="flex -space-x-2 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:ring-indigo-900 ">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
                                        <p className={"text-indigo-900 text-xs absolute inset-0 flex items-center justify-center"}>+2k</p>
                                        <AvatarFallback>ER</AvatarFallback>
                                    </Avatar>
                                </div>

                                <div>
                                    <div className={"flex gap-0.5 mb-1.5"}>
                                        <Star size={15} className="text-yellow-400" fill={"currentColor"} />
                                        <Star size={15} className="text-yellow-400" fill={"currentColor"} />
                                        <Star size={15} className="text-yellow-400" fill={"currentColor"} />
                                        <Star size={15} className="text-yellow-400" fill={"currentColor"} />
                                        <Star size={15} className="text-yellow-400" fill={"currentColor"} />
                                    </div>
                                    <p className={"text-xs text-indigo-200"}>Reconnu par les meilleurs clubs du monde</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>

  )
}
