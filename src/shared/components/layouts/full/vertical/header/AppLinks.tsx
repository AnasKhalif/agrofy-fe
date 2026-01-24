
import { Icon } from "@iconify/react";

import { useBoolean } from '@/shared/hooks';
import * as AppsData from "./Data";
import { Drawer } from '@/shared/components/theme-ui';
import SimpleBar from "simplebar-react";
import MegamenuImg from "/src/assets/images/backgrounds/mega-dd-bg.jpg";
import { Link } from "react-router";
const AppLinks = () => {
  const drawer = useBoolean();
  const handleClose = () => drawer.setFalse();

  return (
    <>
      <div className="relative group ">
        <span className="h-10 w-10 text-darklink  dark:text-white text-sm hover:text-primary  hover:bg-lightprimary dark:hover:text-primary dark:hover:bg-darkminisidebar  rounded-full flex justify-center items-center cursor-pointer group-hover:bg-lightprimary group-hover:text-primary xl:flex hidden">
          <Icon icon="solar:widget-3-line-duotone" height={20} />
        </span>

        <span
          className="xl:hidden block h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover:bg-lightprimary group-hover:text-primary "
          onClick={drawer.setTrue}
        >
          <Icon icon="solar:widget-3-line-duotone" height={20} />
        </span>

        <div className="sm:w-[860px] w-screen dropdown  invisible  group-hover:visible absolute z-[10]">
          <Drawer
            open={drawer.value}
            onClose={handleClose}
            position="right"
            className="xl:relative xl:transform-none xl:h-auto xl:bg-transparent xl:z-[0] xl:w-[860px] w-64"
          >
            <SimpleBar className="md:h-auto h-[calc(100vh_-_50px)]">
              <div className="grid grid-cols-12 w-full">
                <div className="xl:col-span-8 col-span-12 flex items-stretch p-6">
                  <div className="grid grid-cols-12 gap-3 w-full">
                    {AppsData.appsLink.map((links, index) => (
                      <div
                        className="col-span-12 xl:col-span-6 "
                        key={index}
                      >
                        <Link
                          to={links.href}
                          className="flex gap-3 hover:text-primary group relative items-center"
                        >
                          <span
                            className={`h-12 w-12 flex justify-center items-center rounded-tw ${links.iconbg}`}
                          >
                            <Icon
                              icon={links.icon}
                              height={24}
                              className={`${links.iconcolor}`}
                            />
                          </span>
                          <div>
                            <h6 className="font-semibold text-15 text-ld hover:text-primary ">
                              {links.title}
                            </h6>
                            <p className="text-13 text-bodytext">
                              {links.subtext}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="xl:col-span-4 col-span-12  flex items-strech h-[300px] lg:block hidden">
                  <img
                    src={MegamenuImg}
                    alt="image"
                    className="h-full w-full"
                  />
                </div>
              </div>
            </SimpleBar>
          </Drawer>
        </div>
      </div>
    </>
  );
};

export default AppLinks;
