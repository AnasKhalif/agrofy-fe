import LogoIcon from "@/assets/images/logos/smartgrowth.png";
import { Link } from "react-router";

const Logo = ({ className = "" }) => {
  return (
    <Link to={"/"}>
      <img src={LogoIcon} alt="logo" className={className} />
    </Link>
  );
};

export default Logo;
