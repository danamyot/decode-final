import PropTypes from "prop-types";
import Link from "next/link";

const Header = props => (
  <header id="header" className="alt">
    <Link href="/">
      <a className="logo">
        <strong>Forty</strong> <span>by HTML5 UP</span>
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
