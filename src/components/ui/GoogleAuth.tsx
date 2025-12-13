import {Button} from "@/components/ui/button.tsx";
import {authClient} from "@/lib/auth-client.ts";
import {LoaderCircle} from "@/components/animate-ui/icons/loader-circle.tsx";
import * as React from "react";


export function GoogleAuth() {

    const [isPending, setIsPending] = React.useState(false);

    const signInWithGoogle = async () => {
        setIsPending(true);
        const data = await authClient.signIn.social({
            provider: "google",
            callbackURL: "http://localhost:5173"
        })

        setIsPending(false);

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