import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

const SimpleNav = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">ML Examples</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {/* <NavItem>s
              <NavLink href="/components/">Components</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
            </NavItem> */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Image Classification
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                    <NavItem>
                    <NavLink href="/autoClassification">Classification</NavLink>
                    </NavItem>
                </DropdownItem>

                <DropdownItem>
                    <NavItem>
                    <NavLink href="/classificationUploader/">Image Uploader</NavLink>
                    </NavItem>
                </DropdownItem>
            
                <DropdownItem>
                    <NavItem>
                    <NavLink href="/classificationDemo/">Simple Demo</NavLink>
                    </NavItem>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/* <NavbarText>Simple Text</NavbarText> */}
        </Collapse>
      </Navbar>
    </div>
  );
}

export default SimpleNav;