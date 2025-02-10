// import { useRouter } from "@tanstack/react-router";
// import { isAuthenticated, signOut, signIn } from "../../../utils/auth";

// function Login() {
//   const router = useRouter();

//   return (
//     <>
//       {isAuthenticated() ? (
//         <>
//           <p>Hello user!</p>
//           <button
//             className="text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded"
//             onClick={async () => {
//               signOut();
//               router.invalidate();
//             }}
//           >
//             Sign out
//           </button>
//         </>
//       ) : (
//         <button
//           className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded"
//           onClick={async () => {
//             signIn();
//             router.invalidate();
//           }}
//         >
//           Sign in
//         </button>
//       )}
//     </>
//   );
// }

// export default Login

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import PasswordInput from "@/components/PasswordInput";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { useAuth } from "@/api/queries/authQueries";

interface ILoginModel {
  username: string;
  password: string;
}

function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILoginModel>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();
  const navigate = useNavigate();

  const { loginMutation } = useAuth();

  const onSubmit: SubmitHandler<ILoginModel> = async (data) => {
    // Trigger login mutation.
    loginMutation.mutate(data, {
      onSuccess: () => {
        // onSuccess is already handling fetching current user,
        // storing the token, and marking authentication.
        router.invalidate(); // Invalidate routes if necessary
        navigate({ to: "/" }); // Redirect to home page
      },
      onError: (error) => {
        console.error("Login error:", error);
      },
    });
  };

  // useEffect(() => {
  //   const audio = new Audio("../../../../public/a_dungeon_ambience_loop-79423.mp3");
  //   audio.loop = true;
  //   audio.volume = 0.9; // Lower volume for less intrusive background sound

  //   const playAudio = () => {
  //     audio.play().catch(error => {
  //       console.log("Autoplay was prevented", error);
  //     });
  //   };

  //   // Attempt to play on component mount
  //   playAudio();

  //   // Optional: Add user interaction to enable audio
  //   const handleUserInteraction = () => {
  //     playAudio();
  //     // Remove event listeners after first interaction
  //     document.removeEventListener('click', handleUserInteraction);
  //     document.removeEventListener('keydown', handleUserInteraction);
  //   };

  //   document.addEventListener('click', handleUserInteraction);
  //   document.addEventListener('keydown', handleUserInteraction);

  //   // Cleanup
  //   return () => {
  //     audio.pause();
  //     audio.currentTime = 0;
  //     document.removeEventListener('click', handleUserInteraction);
  //     document.removeEventListener('keydown', handleUserInteraction);
  //   };
  // }, []);

  return (
    <div className="flex min-h-screen">
      {/* <audio autoPlay loop hidden>
        <source src="../../../../public/a_dungeon_ambience_loop-79423.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio> */}

      {/* Left Section */}
      <div className="w-2/5 bg-primary text-white flex flex-col items-center justify-center relative overflow-hidden">
        <h1 className="text-4xl font-bold mb-4 z-10">Welcome Back!</h1>
        <p className="text-lg text-center max-w-md z-10">Book Mood</p>
        {/* Grid Pattern */}

        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
          ]}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
            "absolute inset-0 h-full w-full skew-y-12"
          )}
        />
      </div>

      {/* Right Section */}
      <div className="w-3/5 flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* username Field */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isLoading}
              className="w-full"
            >
              {loginMutation.isLoading ? "Loading..." : "Login"}
            </Button>

            {/* Signup Link */}
            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <Link
                to="/signup" // Replace with the actual path to your signup page
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Login;
