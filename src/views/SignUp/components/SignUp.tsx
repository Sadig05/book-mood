import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { ISignUpModel } from "../models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PasswordInput from "@/components/PasswordInput";
// import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/api/queries/authQueries";

function SignUp() {
  const {
    handleSubmit,
    control,
    // watch,
    formState: { errors },
  } = useForm<ISignUpModel>({
    defaultValues: {
      username: "",
      password: "",
      name: "",
      // confirmPassword: "",
      // acceptPrivacyPolicy: false,
    },
  });

  const { registerMutation } = useAuth();


  const onSubmit: SubmitHandler<ISignUpModel> = (data) => {
    console.log(data);
    registerMutation.mutate(data);
  };

  // const password = watch("password", "");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 shadow-md w-1/4">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Username is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your username"
                  className="w-full"
                />
              )}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your name"
                  className="w-full"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  placeholder="Enter your password"
                  className="w-full"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          {/* <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  placeholder="Confirm your password"
                  className="w-full"
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div> */}

          {/* Privacy Policy Checkbox */}
          {/* <div>
            <label className="flex items-center space-x-2 text-sm font-medium">
              <Controller
                name="acceptPrivacyPolicy"
                control={control}
                rules={{
                  required: "You must accept the privacy policy",
                }}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value} 
                    onCheckedChange={(checked) => field.onChange(checked)} 
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                )}
              />
              <span>
                I agree to the{" "}
                <Link
                  to="/terms" // Replace with your actual route path
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptPrivacyPolicy && (
              <p className="text-red-500 text-sm mt-1">
                {errors.acceptPrivacyPolicy.message}
              </p>
            )}
          </div> */}

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Sign Up
          </Button>

          <p className="text-sm text-center mt-4">
            have an account?{" "}
            <Link
              to="/login" // Replace with the actual path to your signup page
              className="text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default SignUp;
