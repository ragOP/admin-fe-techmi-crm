import { fetchAdmins } from "@/pages/admin/helpers/fetchAdmins";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AdminsDropdown = ({ currentAdmin, setCurrentAdmin, isDisabled }) => {
  const params = {
    page: 1,
    per_page: 100,
    search: "",
  };

  const {
    data: admins = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admins", params],
    queryFn: () => fetchAdmins({ params }),
    select: (data) => data?.data,
  });

  const onChangeValue = (value) => {
    if (!value) return;
    setCurrentAdmin(value);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-white mb-1">
        Select Admin
      </label>
      <Select
        value={currentAdmin}
        onValueChange={onChangeValue}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Admin" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {admins.map((admin) => (
            <SelectItem key={admin._id} value={admin._id}>
              {admin.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AdminsDropdown;
