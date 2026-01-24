
import { Modal, TextInput } from '@/shared/components/theme-ui';
import { Icon } from "@iconify/react";
import { useBoolean } from '@/shared/hooks';
import * as SearchData from "./Data";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Link } from "react-router";

const Search = () => {
  const modal = useBoolean();
  return (
    <div>
      <button
        onClick={modal.setTrue}
        className="h-10 w-10 text-darklink  dark:text-white text-sm hover:text-primary  hover:bg-lightprimary dark:hover:text-primary dark:hover:bg-darkminisidebar  rounded-full flex justify-center items-center cursor-pointer"
      >
        <Icon icon="solar:magnifer-line-duotone" height={20} />
      </button>

      <Modal dismissible show={modal.value} onClose={modal.setFalse}>
        <div className="p-6 border-b border-ld">
          <TextInput placeholder="Search here" className="form-control" sizing="md" required />
        </div>
        <Modal.Body className="pt-0 "  >
          <SimpleBar className="max-h-72">
            <h5 className="text-lg pt-5">Quick Page Links</h5>
            {SearchData.SearchLinks.map((links, index) => (
              <Link to={links.href} className="py-1 px-3  group relative" key={index}>
                <h6 className="group-hover:text-primary mb-1 font-medium text-sm">
                  {links.title}
                </h6>
                <p className="text-xs text-bodytext">
                  {links.href}
                </p>
              </Link>
            ))}
          </SimpleBar>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Search;
