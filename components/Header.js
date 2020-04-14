import PropTypes from "prop-types";
import Link from "next/link";

const Header = props => (
  <header id="header">
    <Link href="/">
      <a className="logo">
        <strong>Trakr</strong>
        <span>.tv</span>
      </a>
    </Link>
    <nav>
      <button className="menu-link" onClick={props.onToggleMenu}>
        Menu
      </button>
    </nav>
  </header>
);

Header.propTypes = {
  onToggleMenu: PropTypes.func
};

export default Header;
