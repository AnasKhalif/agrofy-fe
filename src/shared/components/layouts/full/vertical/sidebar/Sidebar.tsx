import { useContext, useEffect, useMemo } from "react";
import { Sidebar } from "@/shared/components/theme-ui";
import { IconSidebar } from "./IconSidebar";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SimpleBar from "simplebar-react";
import { CustomizerContext } from "@/app/contexts/CustomizerContext";
import { useLocation } from "react-router";
import FullLogo from "../../shared/logo/FullLogo";
import React from "react";
import SidebarContent, { MenuItem } from "@/app/router/SidebarItems";
import { usePermission } from "@/shared/hooks";
import ThemeText from "@/shared/theme/themeText";
import { Typography } from "@mui/material";

const SidebarLayout = () => {
  const customizer = useContext(CustomizerContext);
  const { hasPermission } = usePermission();
  const location = useLocation();
  const pathname = location.pathname;
  const selectedIconId = customizer?.selectedIconId;
  const setSelectedIconId = customizer?.setSelectedIconId;

  // Filter menu items by permissions
  const filteredSidebarContent = useMemo(() => {
    return SidebarContent.map((section) => ({
      ...section,
      items: section.items?.map((item) => ({
        ...item,
        children: item.children?.filter((child) => {
          // If no permission required, show the item
          if (!child.permission) return true;
          // Check if user has permission
          return hasPermission(child.permission);
        }),
      })),
    }));
  }, [hasPermission]);

  const selectedContent = filteredSidebarContent.find(
    (data) => data.id === selectedIconId,
  );

  function findActiveUrl(narray: MenuItem[], targetUrl: string) {
    for (const item of narray) {
      // Check if the `items` array exists in the top-level object
      if (item.items) {
        // Iterate through each item in the `items` array
        for (const section of item.items) {
          // Check if `children` array exists and search through it
          if (section.children) {
            for (const child of section.children) {
              if (child.url === targetUrl) {
                return item.id; // Return the ID of the first-level object
              }
            }
          }
        }
      }
    }
    return null; // URL not found
  }

  useEffect(() => {
    const result = findActiveUrl(filteredSidebarContent, pathname);
    if (result && setSelectedIconId) {
      setSelectedIconId(result);
    }
  }, [pathname, setSelectedIconId, filteredSidebarContent]);

  if (!customizer) {
    return null;
  }

  return (
    <>
      <div className="xl:block hidden">
        <div className="minisidebar-icon border-e border-ld  fixed start-0 z-[1]">
          <IconSidebar />
        </div>
        <Sidebar
          className="fixed menu-sidebar  bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0 "
          aria-label="Sidebar with multi-level dropdown example"
        >
          <div className="px-6 py-4 flex items-center sidebarlogo">
            <FullLogo />
          </div>
          <SimpleBar className="h-[calc(100vh_-_85px)]">
            <Sidebar.Items className="pe-4 rtl:pe-0 rtl:ps-4 px-5 mt-2">
              <Sidebar.ItemGroup className="sidebar-nav hide-menu">
                {selectedContent &&
                  selectedContent.items?.map((item, index) => (
                    <div className="caption" key={item.heading}>
                      <React.Fragment key={index}>
                        <Typography
                          sx={ThemeText.CaptionSmall}
                          className="pb-3 pl-4"
                        >
                          {item.heading}
                        </Typography>
                        {item.children?.map((child, index) => (
                          <React.Fragment key={child.id && index}>
                            {child.children ? (
                              <NavCollapse item={child} />
                            ) : (
                              <NavItems item={child} />
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    </div>
                  ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </SimpleBar>
        </Sidebar>
      </div>
    </>
  );
};

export default SidebarLayout;
