"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginSchema } from "@/schemas/authSchemas";
import { loginAction } from "../../action";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";


// Type of form data based on schema
type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const [isVisible, setIsVisible] = useState<boolean>(false)

    const toggleVisibility = () => setIsVisible((prevState) => !prevState)

    // Initialize React Hook Form with Zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Form submission handler
    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await loginAction(data);

            if (result?.success) {
                console.log("Login successful");
                // optionally redirect or update UI state
                router.push('/');
            } else {
                setErrorMessage(result?.error || "Something went wrong!");
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Apple or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email")}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor={"password"}>Show/hide password input</Label>
                                <div className="relative">
                                    <Input
                                        id={"password"}
                                        className="pe-9"
                                        placeholder="Password"
                                        {...register("password")}
                                        type={isVisible ? "text" : "password"}
                                    />
                                    <button
                                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label={isVisible ? "Hide password" : "Show password"}
                                        aria-pressed={isVisible}
                                        aria-controls="password"
                                    >
                                        {isVisible ? (
                                            <EyeOffIcon size={16} aria-hidden="true" />
                                        ) : (
                                            <EyeIcon size={16} aria-hidden="true" />
                                        )}
                                    </button>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                {errorMessage && (
                    <CardFooter>

                        <div className="text-red-500 text-center text-xs mt-4">{errorMessage}</div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
