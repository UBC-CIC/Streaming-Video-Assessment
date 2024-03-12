import PropTypes from "prop-types";

function DropdownItem({ icon, text, onclick, modal }) {
  return (
    <li onClick={onclick}>
      <a>
        {icon}
        {text}
        {modal}
      </a>
    </li>
  );
}

DropdownItem.propTypes = {
  icon: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  onclick: PropTypes.func.isRequired,
  modal: PropTypes.object,
};

function ButtonDropdown({ buttonIcon, dropdownItems }) {
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-circle m-1 bg-stone-300 btn-lg"
      >
        {buttonIcon}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {dropdownItems.map((item) => (
          <DropdownItem key={item.text} {...item} />
        ))}
      </ul>
    </div>
  );
}

ButtonDropdown.propTypes = {
  buttonIcon: PropTypes.object.isRequired,
  dropdownItems: PropTypes.array.isRequired,
};

export default ButtonDropdown;
