
import LogoIcon from '/src/assets/images/logos/logo.svg'
import { Link } from "react-router";

const Logo = ({className = ""}) => {
  return (
   <Link to={'/'}>
      <img src={LogoIcon} alt="logo" className={className}/>
    </Link>
  )
}

export default Logo
