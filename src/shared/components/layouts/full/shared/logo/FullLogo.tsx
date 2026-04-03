import Logo from "@/assets/images/logos/smartgrowth.png";
import { Link } from "react-router";
const FullLogo = () => {
  return (
    <Link to={"/"}>
      <img src={Logo} alt="logo" className="block w-32" />
    </Link>
  );
};

export default FullLogo;
