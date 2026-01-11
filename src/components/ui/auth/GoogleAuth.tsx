import {Button} from "@/components/ui/button.tsx";
import {authClient} from "@/lib/auth-client.ts";
import {LoaderCircle} from "@/components/animate-ui/icons/loader-circle.tsx";
import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";


export function GoogleAuth() {

    const [isPending, setIsPending] = React.useState(false);
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        const data = await authClient.signIn.social({
            provider: "google",
            callbackURL: "http://localhost:5173/dashboard"
        }, {
          onResponse: () => {
            setIsPending(true);
          },
          onRequest: () => {
            setIsPending(false);
          },
          onSuccess: () => {

          },
          onError: () => {
            toast.error("Erreur lors de la connexion avec google");
          }
        })

        console.log(data);

    }

    return (
        <Button variant={"outline"} className={"py-5 rounded-md"} onClick={signInWithGoogle}>
            {isPending ? <LoaderCircle animate={true} /> : (
                <>
                    <img className={"max-w-5"} src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt=""/>
                    Google
                </>
            )}
        </Button>
    )
}
