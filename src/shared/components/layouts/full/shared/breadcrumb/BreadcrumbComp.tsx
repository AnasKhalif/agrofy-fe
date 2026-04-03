
import { Badge, Breadcrumb } from '@/shared/components/theme-ui';
import { Icon } from "@iconify/react";
import CardBox from "@/shared/components/common/CardBox";
import { ReactNode } from 'react';

interface BreadCrumbType {
  subtitle?: string;
  items?: any[];
  title: string;
  children?: ReactNode;
}

const BreadcrumbComp = ({ items, title }: BreadCrumbType) => {
  return (
    <>
      <CardBox className={`mb-[30px] py-4`}>
        <Breadcrumb className="flex justify-between">
          <h6 className="text-base">{title}</h6>
          <div className="flex items-center gap-3">
            {items
              ? items.map((item) => (
                  <div key={item.title}>
                    {item.to ? (
                      <Breadcrumb.Item href={item.to}>
                        <Icon
                          icon="solar:home-2-line-duotone"
                          height={20}
                        ></Icon>{" "}
                      </Breadcrumb.Item>
                    ) : (
                      <Badge color={"lightprimary"}>{item.title}</Badge>
                    )}
                  </div>
                ))
              : ""}
          </div>
        </Breadcrumb>
      </CardBox>
    </>
  );
};

export default BreadcrumbComp;
