import {useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileCheck, X, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { extractDataFromExcel } from "@/utils/excel_reader";
import { generateExcel } from "@/utils/excel_generate";
import { productBulkUpload } from "../helpers/bulkUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ExcelUploadDialog({ openDialog, setOpenDialog }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const bulkUploadMutation = useMutation({
    mutationFn: (excelData) => productBulkUpload({payload: excelData}),
    onSuccess: (data) => {
      if(data?.data?.failed?.length === 0){
        toast.success("Products uploaded successfully!");
        setFile(null);
        setOpenDialog(false);
      }else{
        toast.error(`${data?.data?.failed?.length} failed to upload. Try again.`)
      }
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  })

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    validateFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const selectedFile = event.dataTransfer.files[0];
    validateFile(selectedFile);
  };

  const validateFile = (selectedFile) => {
    if (
      selectedFile &&
      (selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel")
    ) {
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid .xls or .xlsx format");
    }
  };

  const handleUploadBulk = async () => {
    if (!file) {
      toast.error("Upload a file to proceed");
    } else {
      const excelData = await extractDataFromExcel(file);
      console.log(excelData, ">>>>>>>>Excel dta")
      bulkUploadMutation.mutate(excelData);
    }
  };

  const handleDownloadTemplate = () => {
    setIsGenerating(true);
    const columns = [["ID", "Name", "Email", "Phone", "Address"]];
    generateExcel(columns);
    setIsGenerating(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="p-6 rounded-xl shadow-lg bg-white border border-gray-400">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Upload Excel File
          </DialogTitle>
        </DialogHeader>
        <div
          className={`border-2 border-dashed p-6 text-center rounded-lg transition-colors flex flex-col items-center justify-center ${
            dragOver ? "bg-gray-200 border-gray-600" : "border-gray-400"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <UploadCloud className="text-gray-700 mb-2" size={50} />
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-700">
              Drag & drop an Excel file here
            </p>
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-sm text-gray-700 underline"
            >
              or select a file
            </label>
          </div>
          <div className="mt-4 text-center">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
          </div>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between bg-gray-200 text-gray-900 p-3 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <FileCheck size={20} className="text-gray-800" />
              <p className="text-sm font-medium">{file.name}</p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <Button
          className={`${
            isGenerating ? "pointer-events-none bg-gray-700" : ""
          } w-full transition cursor-pointer`}
          onClick={handleDownloadTemplate}
        >
          <Download size={18} />{" "}
          {isGenerating ? "Downloading..." : "Download Excel Template"}
        </Button>
        <Button
          className={`${
            bulkUploadMutation.isLoading ? "pointer-events-none bg-gray-700" : ""
          } w-full transition cursor-pointer`}
          onClick={handleUploadBulk}
        >
          <Upload size={18} /> {bulkUploadMutation.isLoading ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
