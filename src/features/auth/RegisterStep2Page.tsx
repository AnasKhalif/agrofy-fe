import { Link } from "react-router";
import AuthRegister2 from "./components/forms/AuthRegister2";
import LeftSidebarPart from "./components/LeftSidebarPart";
import { useRotatingBackground } from "./hooks/useRotatingBackground";

const RegisterStep2Page = () => {
  const bg = useRotatingBackground();
  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div
          className="grid grid-cols-12 gap-3 h-full transition-[background-image] duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="xl:col-span-8 lg:col-span-6 col-span-12 dark:bg-dark lg:block hidden relative overflow-hidden">
            <LeftSidebarPart />
          </div>
          <div className="xl:col-span-4 lg:col-span-6 col-span-12 sm:px-12 lg:px-6 xl:px-3 py-3">
            <div className="flex h-full w-full items-center px-3 lg:justify-start justify-center rounded-lg bg-white">
              <div className="max-w-md w-full mx-auto">
                <h3 className="flex justify-center items-center text-2xl font-bold my-3 mt-5">
                  Create your account
                </h3>
                <p className="flex justify-center items-center text-base font-medium opacity-90">
                  Lengkapi data akun langkah 2
                </p>
                <AuthRegister2 />
                <div className="flex gap-2 text-base opacity-90 mt-6 items-center justify-center">
                  <p>Already have an Account?</p>
                  <Link
                    to="/auth/login"
                    className="text-primary text-sm font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterStep2Page;
