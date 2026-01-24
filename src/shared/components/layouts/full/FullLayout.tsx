import { FC, useContext } from 'react';
import { Outlet } from "react-router";
import { Customizer } from './shared/customizer/Customizer';
import { CustomizerContext } from '@/app/providers/CustomizerProvider';
import Sidebar from './vertical/sidebar/Sidebar';
import Header from './vertical/header/Header';
import ScrollToTop from 'src/shared/components/theme-ui/ScrollToTop';
import TopProgressBar from '@/shared/components/common/TopProgressBar';
import { useProgress } from '@/shared/hooks/useProgress';



const FullLayout: FC = () => {
  const { activeLayout, isLayout } = useContext(CustomizerContext);
  const isLoading = useProgress();

  return (
      <>
    <TopProgressBar isLoading={isLoading} />
    <div className="flex w-full min-h-screen dark:bg-darkgray">
      <div className="page-wrapper flex w-full  ">
        {/* Header/sidebar */}

        {activeLayout == "vertical" ? <Sidebar /> : null}
        <div className="page-wrapper-sub flex flex-col w-full dark:bg-darkgray">
          {/* Top Header  */}
          {activeLayout == "horizontal" ? (
            <Header layoutType="horizontal" />
          ) : (
            <Header layoutType="vertical" />
          )}

          <div
            className={`bg-lightgray dark:bg-dark  h-full ${
              activeLayout != "horizontal" ? "rounded-bb" : "rounded-none"
            } `}
          >
            {/* Body Content  */}
            <div
              className={` ${
                isLayout == "full"
                  ? ""
                  : "container mx-auto  py-30"
              } ${activeLayout == "horizontal" ? "xl:mt-3" : ""}
              `}
            >
              <ScrollToTop>
              <Outlet/>
              </ScrollToTop>
            </div>
            <Customizer />
          </div>
        </div>
      </div>
    </div>
      </>
  );
};

export default FullLayout;
