import React from "react";

const Dropdown = ({ onSelect, activeItem, items }) => {
  const [dropdownVisible, setDropdownVisible] = React.useState(false);

  const selectItem = (e, item) => {
    e.preventDefault();
    setDropdownVisible(!dropdownVisible);
    onSelect(item);
  };
  return (
    <>
      <div className="dropdown mr-1">
        <button
          style={{ paddingLeft: 20, paddingRight: 20 }}
          type="button"
          className="btn btn-primary dropdown-toggle"
          id="dropdownMenuOffset"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          data-offset="10,20"
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          {activeItem.label}
        </button>
        <div
          className={`dropdown-menu${dropdownVisible ? "visible" : ""}`}
          aria-labelledby="dropdownMenuOffset"
        >
          {items &&
            items.map((item, i) => (
              <a
                onClick={(e) => selectItem(e, item.value)}
                key={i}
                href="#"
                className={`dropdown-item ${
                  item.value === activeItem.value ? "active" : null
                }`}
              >
                {item.label}
              </a>
            ))}
        </div>
      </div>
    </>
  );
};

export default Dropdown;
