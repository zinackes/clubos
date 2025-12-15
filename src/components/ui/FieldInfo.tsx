import type {AnyFieldApi} from "@tanstack/form-core";
import {useEffect} from "react";


export default function FieldInfo({field} : {field: AnyFieldApi}){

    useEffect(() => {
        console.log("field field.state.meta", field.state.meta.isBlurred);
    }, [field.state.meta.isBlurred]);

    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid && field.state.meta.isBlurred ? (
                <em className={"text-red-400 text-sm"}>{field.state.meta.errors.map(error => (
                    error.message
                ))}</em>
            ) : null}
            {field.state.meta.isValidating ? "Validation..." : null}
        </>
    )
}