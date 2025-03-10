import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addStudents, Student } from "../../../state/slices/studentSlice";
import Loadingbar from "../../loading/Loadingbar";
import FileItem from "./FileItem";
import * as XLSX from "xlsx";
import PrimaryButton from "../../buttons/PrimaryButton";
import { useI18n } from "../../../hooks/useI18n";

interface UploadedFilesProps {
    file: File;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}
const UploadedFiles: React.FC<UploadedFilesProps> = ({ file, setFile, setError }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const t = useI18n();

    const handleSubmit = () => {
        if (!file) {
            setError("Please upload a file to continue.");
            return;
        }

        setError(null);
        setLoading(true);
        handleFileUpload();
    };

    const handleFileUpload = () => {
        if (!file) {
            setError("Please upload a file to continue.");
            setLoading(false);
            return;
        }

        if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
            setError("Please upload a valid Excel file.");
            setLoading(false);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target?.result;
            if (typeof data === "string" || data instanceof ArrayBuffer) {
                try {
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                    const extractedNames = rows
                        .map((row) => row[0])
                        .filter((name) => name);

                    const studentEntities: Student[] = extractedNames.map((name) => ({
                        id: nanoid(),
                        name,
                        isAssigned: false,
                    }));
                    dispatch(addStudents(studentEntities));
                } catch (error) {
                    console.error("Error processing Excel file:", error);
                    setError("There was an error processing the file.");
                    setLoading(false);
                }
            }
        };
        reader.readAsArrayBuffer(file);
    }

    const handleLoadingComplete = () => {
        setLoading(false);
        setFile(null);
    }

    return (
        <ul className="space-y-4">
            <FileItem file={file} setFile={setFile} />

            <div className="flex flex-row justify-end items-center gap-4">
                {loading && <Loadingbar speed={10} onComplete={handleLoadingComplete} />}

                <PrimaryButton onClick={handleSubmit}>
                    {t("common.submit")}
                </PrimaryButton>
            </div>
        </ul>
    );
};
export default UploadedFiles;