import type {AnyFieldApi} from "@tanstack/form-core";


export default function FieldInfo({field} : {field: AnyFieldApi}){

    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em className={"text-red-400 text-sm"}>{field.state.meta.errors.map(error => (
                    error.message
                ))}</em>
            ) : null}
            {field.state.meta.isValidating ? "Validation..." : null}
        </>
    )
}