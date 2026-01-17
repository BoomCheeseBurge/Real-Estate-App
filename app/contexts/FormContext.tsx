import { AppwriteParamValue } from '@/hook/useAppwrite';
import { ImagePickerAsset } from 'expo-image-picker';
import React, { createContext, useContext, useState } from 'react';

export interface FormData {
	propertyName: string;
	propertyType: string;
    description: string;
	beds: string;
	bathrooms: string;
	areaSize: string;
    images: ImagePickerAsset[];
    facilities: string[];
    price: string;
    paymentPeriod: string;
    terms: boolean;
    [key: string]: AppwriteParamValue;
}

interface FormContextType {
    page: number;
    formData: FormData;
    setPage: (page: number | ((prev: number) => number)) => void;
    updateFormData: (newData: Partial<FormData>) => void;
    nextPage: () => void;
    prevPage: () => void;
    resetForm: () => void;
}

const initialFormData: FormData = {
    propertyName: "",
    propertyType: "",
    description: "",
    beds: "",
    bathrooms: "",
    areaSize: "",
    images: [],
    facilities: [],
    price: "",
    paymentPeriod: "Monthly",
    terms: false,
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {

    const [page, setPage] = useState(1);

    const [formData, setFormData] = useState<FormData>({
        propertyName: "",
        propertyType: "",
        description: "",
        beds: "",
        bathrooms: "",
        areaSize: "",
        images: [],
        facilities: [],
        price: "",
        paymentPeriod: "Monthly", // Default value
        terms: false,
    });

    const updateFormData = (newData: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setPage(1); // Usually you want to go back to the first step too
    };

    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => Math.max(1, prev - 1));

    return (
        <FormContext.Provider value={{ page, formData, setPage, updateFormData, nextPage, prevPage, resetForm }}>
            {children}
        </FormContext.Provider>
    );
};

// Context access helper
export const useFormContext = () => {

    const context = useContext(FormContext);

    if (!context) throw new Error("useFormContext must be used within a FormProvider");

    return context;
};