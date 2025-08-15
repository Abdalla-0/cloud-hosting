import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const token = (await cookies()).get("token")?.value || "";
  if (token) redirect("/");
  return (
    <section className="fix-height container px-7 flex items-center justify-center">
      <div className="bg-white mt-7 rounded-lg p-5 w-full md:w-2/3">
        <h1 className="text-3xl font-bold text-gray-800 mb-5">Log In</h1>
        <LoginForm />
      </div>
    </section>
  );
};

export default LoginPage;
