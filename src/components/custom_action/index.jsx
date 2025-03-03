import React from "react";
import Typography from "../typography";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { singularize } from "@/utils/singularizing_word";
import { capitalize } from "@/utils/captilize";

const CustomActionMenu = ({ title, total }) => {  
  return (
    <div className="flex items-center justify-between w-full my-3">
      <div>
        <Typography variant="p">Showing {total} {" "} {title}</Typography>
      </div>
      <div className="flex items-center gap-4">
        <Input placeholder="Search" />
        <Button className="flex items-center gap-2 cursor-pointer"> 
          <PlusIcon /> 
          <span>Add {capitalize(singularize(title))}</span></Button>
      </div>
    </div>
  );
};

export default CustomActionMenu;
