import CustomButton from "../CustomButton"
import { Spinner } from "../ui/spinner"



export default function FormButton({ loading, title, accountType, documentType, isFormDirty }:
    {
        loading: boolean, title: string, accountType: "ADMIN" | "AGENT"
        documentType: "NEW" | "UPDATE" | "DUPLICATE" | "DRAFT" | "REVIEW",
        isFormDirty: boolean
    }
) {

    if (title.trim() && documentType === "NEW") {
        if (accountType === "AGENT") {
            return <CustomButton
                disabled={loading}
            >
                <>{
                    loading ?
                        <>< Spinner /> Submiting... </> :
                        "Submit Property"
                }</>
            </CustomButton>
        }
        return <CustomButton
            disabled={loading}
        >
            <>{
                loading ?
                    <>< Spinner /> Adding... </> :
                    "List Property"
            }</>
        </CustomButton>
    } else if (documentType == "UPDATE" && isFormDirty) {
        return <CustomButton
            disabled={loading}
        >
            <>{
                loading ?
                    <>< Spinner /> Saving Changes... </> :
                    "Save changes"
            }</>
        </CustomButton>

    }
    else if (documentType == "REVIEW" && isFormDirty) {
        return <CustomButton
            disabled={loading}
        >
            <>{
                loading ?
                    <>
                        <Spinner /> Updating... </>
                    :
                    "Update"
            }</>
        </CustomButton>
    }

    return null;

};
