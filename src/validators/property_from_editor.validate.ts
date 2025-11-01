import { PropertyTypes } from "@/types/property.types";
import { validateEmail } from "@/utils";


const validatePropertyFields = (value: PropertyTypes) => {
        const error = {
                isError: false,
                errorMsg: ""
        };

        if (!value.title.trim() || value.title.split(" ").length < 5) {
                error.errorMsg = "Title is required and should be at least 5 words.";
                error.isError = true;
        }
        else if (!value.seoSlug.trim()) {
                error.errorMsg = "Slug is required and should be at least 5 words.";
                error.isError = true;
        }

        else if (!value.category.trim()) {
                error.errorMsg = "Property Category is required.";
                error.isError = true;
        }

        else if (!value.type.trim()) {
                error.errorMsg = "Property Type is required.";
                error.isError = true;
        }

        else if (!value.status.trim()) {
                error.errorMsg = "Property Status is required.";
                error.isError = true;
        }

        else if (!value.status.trim()) {
                error.errorMsg = "Property Status is required.";
                error.isError = true;
        }

        else if (!value.state.trim()) {
                error.errorMsg = "Property State is required.";
                error.isError = true;
        }

        else if (!value.city.trim()) {
                error.errorMsg = "Property City is required.";
                error.isError = true;
        }

        else if (!value.area.trim()) {
                error.errorMsg = "Property Area is required.";
                error.isError = true;
        }

        else if (!value.price || value.price <= 0) {
                error.errorMsg = "Property Price must be greater than zero.";
                error.isError = true;
        }

        else if (!value.priceFrequency.trim()) {
                error.errorMsg = "Price Frequency is required.";
                error.isError = true;
        }

        else if (!value.agentName.trim()) {
                error.errorMsg = "Agents name is required.";
                error.isError = true;
        }

        else if ((value.agentPhone === null || value.agentPhone === undefined)
                && !value.agentEmail.trim()) {
                error.errorMsg = "Agents contact is required. Add Email or Phone number.";
                error.isError = true;
        }


        else if (value.agentEmail.trim() && !validateEmail(value.agentEmail)) {
                error.errorMsg = "invalid Email!";
                error.isError = true;
        }

        return error;
};


export default validatePropertyFields; 
