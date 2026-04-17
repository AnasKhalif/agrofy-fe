import { useState, useMemo } from 'react';
import { Navbar } from '@/shared/components/theme-ui';
import { IconChevronDown } from '@tabler/icons-react';
import ChildComponent from './ChildComponent';
import { Icon } from "@iconify/react";
import Menuitems from '../../../../../../app/router/TopbarItems';
import { Link, useLocation } from "react-router";
import { usePermission } from '@/shared/hooks';
import type { TopbarMenuItem, TopbarChildItem } from '@/app/router/TopbarItems';

const Navigation = () => {
  const { hasPermission } = usePermission();
  const location = useLocation();
  const pathname = location.pathname;

  // Filter menu items by permissions
  const filteredMenuitems = useMemo<TopbarMenuItem[]>(() => {
    return Menuitems.map(item => ({
      ...item,
      children: item.children?.filter(child => {
        // If no permission required, show the item
        if (!child.permission) return true;
        // Check if user has permission
        return hasPermission(child.permission);
      })
    })).filter(item => item.children && item.children.length > 0);
  }, [hasPermission]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [active, setActive] = useState<string | undefined>(filteredMenuitems[0]?.id);

  const handleDropdownEnter = (itemId: string) => {
    setActiveDropdown(itemId);
    setActive(itemId);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const handleChildClick = (parentId: string) => {
    setActive(parentId);
  };

  const isItemActive = (children: TopbarChildItem[]): boolean => {
    return children.some((child) => {
      if (child.children && child.children.length > 0) {
        return isItemActive(child.children);
      }

      return child.href === pathname;
    });
  };
  return (
    <Navbar fluid={true} rounded={true} className="horizontal-nav bg-transparent dark:bg-transparent sm:px-0 xl:py-4 py-0">
      <Navbar.Collapse className="xl:block">
        <ul className="flex items-center space-x-3">
          {filteredMenuitems.map((item) => {
            const isActive = isItemActive(item.children);
            return (
              <li key={item.id} className="relative group">
              {item.children ? (
                <div
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter(item.id)}
                >
                  <p
                    className={`w-full ${isActive
                      ? 'text-white bg-primary shadow-btnshdw'
                      : 'group-hover:bg-lightprimary group-hover:text-primary'
                      } py-2 px-3 rounded-md flex gap-3 items-center text-ld`}
                  >
                    <Link to={item.href}>
                      <span className="flex gap-2 items-center w-full ">
                        <Icon icon={`${item.icon}`} height={18} />
                        <span>{item.title}</span>
                        {item.children && <IconChevronDown size={18} className='ms-auto' />}
                      </span>
                    </Link>
                  </p>
                  {activeDropdown === item.id && (
                    <div
                      className={`absolute left-0 rtl:right-0 mt-2  bg-white dark:bg-dark rounded-md shadow-lg ${item.column == 4 ? 'w-screen max-w-[800px]' : 'w-52'}`}
                      onMouseEnter={() => handleDropdownEnter(item.id)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <ul className={`p-3 text-sm  gap-2  ${item.column == 4 ? 'two-cols' : 'flex flex-col'} `}>
                        {item.children.map((child) => (
                          <li key={child.id} className={` ${item.column == 4 ? 'mb-2' : ''} `}>
                            <ChildComponent
                              item={child}
                              title={item.title}
                              isActive={activeDropdown === item.id}
                              handleMouseEnter={() => handleDropdownEnter(item.id)}
                              handleMouseLeave={handleDropdownLeave}
                              onClick={() => handleChildClick(item.id)}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link to={item.href}>
                  <p className={`py-2 px-3 rounded-md flex gap-3 items-center ${active === item.id ? 'bg-error text-white' : 'group-hover/nav:bg-primary group-hover/nav:text-primary'}`}>
                    <Icon icon={`${item.icon}`} height={18} />
                    <span>{(`${item.title}`)}</span>
                  </p>
                </Link>
              )}
            </li>
            )
          })}
        </ul>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
