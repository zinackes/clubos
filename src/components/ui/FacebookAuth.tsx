import {Button} from "@/components/ui/button.tsx";
import {authClient} from "@/lib/auth-client.ts";
import {LoaderCircle} from "@/components/animate-ui/icons/loader-circle.tsx";
import * as React from "react";


export function FacebookAuth() {

    const [isPending, setIsPending] = React.useState(false);

    const signInWithFacebook = async () => {
        setIsPending(true);
        const data = await authClient.signIn.social({
            provider: "facebook",
            callbackURL: "http://localhost:5173"
        })

        setIsPending(false);

        console.log(data);

    }

    return (
        <Button variant={"outline"} className={"py-5 rounded-md"} onClick={signInWithFacebook}>
            {isPending ? <LoaderCircle animate={true} /> : (
                <>
                    <img className={"max-w-5 rounded"} src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Facebook_icon_2013.svg/500px-Facebook_icon_2013.svg.png?20161223201621" alt=""/>
                    Facebook
                </>
            )}
        </Button>
    )
}