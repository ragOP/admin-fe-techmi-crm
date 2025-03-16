import React from "react";
import Typography from "../typography";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CloudUpload, PlusIcon } from "lucide-react";
import { singularize } from "@/utils/singularizing_word";
import { capitalize } from "@/utils/captilize";

const CustomActionMenu = ({
  title,
  total,
  onAdd,
  handleSearch,
  disableAdd = false,
  disableBulkUpload = true,
  searchText,
  setOpenDialog,
}) => {
  return (
    <div className="flex items-center justify-between w-full my-3">
      <div>
        <Typography variant="p">
          Showing {total} {title}
        </Typography>
      </div>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search"
          className="w-100"
          value={searchText}
          onChange={handleSearch}
        />
        {!disableBulkUpload && (
          <Button
            onClick={() => setOpenDialog(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <CloudUpload />
            <span>Bulk Upload</span>
          </Button>
        )}
        {!disableAdd && (
          <Button
            onClick={onAdd}
            className="flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon />
            <span>Add {capitalize(singularize(title))}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomActionMenu;
