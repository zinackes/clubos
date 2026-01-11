import type {AnyFieldApi} from "@tanstack/form-core";
import {useEffect} from "react";


export default function FieldInfo({field} : {field: AnyFieldApi}){

    console.log(field.state.meta);

    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                field.state.meta.errors.map(error => (
                        <em className={"text-red-400 text-sm flex gap-2"}>
                            {error.message}
                        </em>
                    ))
            ) : null}
            {field.state.meta.isValidating ? "Validation..." : null}
        </>
    )
}
