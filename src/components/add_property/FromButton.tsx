import CustomButton from "../CustomButton"
import { Spinner } from "../ui/spinner"



export default function FormButton({ loading, title, accountType, documentType, isDocEdited }:
    {
        loading: boolean, title: string, accountType: "ADMIN" | "AGENT"
        documentType: "NEW" | "UPDATE" | "DUPLICATE" | "REVIEW", isDocEdited: boolean
    }
) {

    if (title.trim() && documentType === "NEW") {
        if (accountType === "AGENT") {
            return <CustomButton
                disabled={loading}
            >
                <>{
                    loading ?
                        <>< Spinner /> Submiting Property... </> :
                        "Submit Property"
                }</>
            </CustomButton>
        }
        return <CustomButton
            disabled={loading}
        >
            <>{
                loading ?
                    <>< Spinner /> Adding Property... </> :
                    "Add Property"
            }</>
        </CustomButton>
    } else if (documentType == "UPDATE" && isDocEdited) {
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
    else if (documentType == "REVIEW" && isDocEdited) {
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
