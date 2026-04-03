import { Outlet } from "react-router";
import ScrollToTop from "@/shared/components/theme-ui/ScrollToTop";
import TopProgressBar from "@/shared/components/common/TopProgressBar";
import { useProgress } from "@/shared/hooks/useProgress";

const BlankLayout = () => {
  const isLoading = useProgress();

  return (
    <>
      <TopProgressBar isLoading={isLoading} />
      <ScrollToTop>
        <Outlet />
      </ScrollToTop>
    </>
  );
};

export default BlankLayout;
