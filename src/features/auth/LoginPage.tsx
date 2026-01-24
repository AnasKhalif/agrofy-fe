import Logo from "@/shared/components/layouts/full/shared/logo/Logo";
import { Link } from "react-router-dom";
import AuthLogin from "./components/forms/AuthLogin";
import LeftSidebarPart from "./components/LeftSidebarPart";
import Bgimg from "@/assets/images/backgrounds/auth-bg.png";

const LoginPage = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div
          className="grid grid-cols-12 gap-3 h-full"
          style={{
            backgroundImage: `url(${Bgimg})`,
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
                <div className="flex justify-center items-center w-xl">
                  <Logo className="w-20 h-20" />
                </div>
                <h3 className="flex justify-center items-center text-2xl font-bold my-3 mt-5">
                  Log in into your account
                </h3>
                <p className="flex justify-center items-center text-base font-medium opacity-90">
                  Welcome back! please enter your details
                </p>
                {/* <SocialButtons title="or sign in with" /> */}
                <AuthLogin />
                <div className="flex gap-2 text-base opacity-90 mt-6 items-center justify-center">
                  <p>New to Nexhealth?</p>
                  <Link
                    to={"/auth/register"}
                    className="text-primary text-sm font-medium"
                  >
                    Create an account
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

export default LoginPage;
