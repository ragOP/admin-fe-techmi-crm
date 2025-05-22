import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/helpers/loginUser";
import { useNavigate } from "react-router";
import { setItem } from "@/utils/local_storage";
import { setCredentials } from "@/redux/admin/adminSlice";
import { useDispatch } from "react-redux";

export function LoginForm({ className, ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(formData);

      if (response?.response?.success) {
        const data = response?.response?.data;
        const tokenData = data?.token;
        const userId = data?.id;

        if (tokenData) {
          const localStoragePayload = {
            token: tokenData,
            userId: userId,
          };
          setItem(localStoragePayload);

          dispatch(
            setCredentials({
              token: tokenData,
              id: userId,
              name: data.name,
              email: data.email,
              role: data.role,
              is_super_admin: data.is_super_admin,
              services: data.services || [],
            })
          );
        }

        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(response?.response?.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}
      <div className="text-center text-sm">
        Forgot your password?{" "}
        <a href="/forgot-password" className="underline underline-offset-4">
          Reset password
        </a>
      </div>
    </form>
  );
}
