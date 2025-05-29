
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import UserMenu from "../UserMenu";
import LanguageSelector from "../common/LanguageSelector";

const DesktopNav = () => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <NavLinks />
      <UserMenu />
      <LanguageSelector />
    </div>
  );
};

export default DesktopNav;
