/**
 * Reactstrap 8 function components rely on defaultProps for `tag` (and similar).
 * React 19 does not apply defaultProps to function components, which breaks rendering.
 * These thin wrappers restore the same defaults while re-exporting the rest unchanged.
 */
import React from "react";
import * as RS from "reactstrap";

const COL_WIDTHS = ["xs", "sm", "md", "lg", "xl"];

export const Navbar = (p) => (
  <RS.Navbar {...p} tag={p.tag ?? "nav"} expand={p.expand ?? false} />
);
export const Container = (p) => <RS.Container {...p} tag={p.tag ?? "div"} />;
export const Row = (p) => (
  <RS.Row {...p} tag={p.tag ?? "div"} widths={p.widths ?? COL_WIDTHS} />
);
export const Col = (p) => (
  <RS.Col {...p} tag={p.tag ?? "div"} widths={p.widths ?? COL_WIDTHS} />
);
export const Nav = (p) => (
  <RS.Nav {...p} tag={p.tag ?? "ul"} vertical={p.vertical ?? false} />
);
export const NavItem = (p) => <RS.NavItem {...p} tag={p.tag ?? "li"} />;
export const NavbarBrand = (p) => <RS.NavbarBrand {...p} tag={p.tag ?? "a"} />;
export const Card = (p) => <RS.Card {...p} tag={p.tag ?? "div"} />;
export const CardHeader = (p) => <RS.CardHeader {...p} tag={p.tag ?? "div"} />;
export const CardBody = (p) => <RS.CardBody {...p} tag={p.tag ?? "div"} />;
export const CardFooter = (p) => <RS.CardFooter {...p} tag={p.tag ?? "div"} />;
export const CardTitle = (p) => <RS.CardTitle {...p} tag={p.tag ?? "div"} />;
export const InputGroup = (p) => <RS.InputGroup {...p} tag={p.tag ?? "div"} />;
export const InputGroupAddon = (p) => (
  <RS.InputGroupAddon {...p} tag={p.tag ?? "div"} />
);
export const InputGroupText = (p) => (
  <RS.InputGroupText {...p} tag={p.tag ?? "span"} />
);
export const TabPane = (p) => <RS.TabPane {...p} tag={p.tag ?? "div"} />;

export const Button = RS.Button;
export const Collapse = RS.Collapse;
export const NavLink = RS.NavLink;
export const Form = RS.Form;
export const Input = RS.Input;
export const TabContent = RS.TabContent;
export const UncontrolledCarousel = RS.UncontrolledCarousel;
export const UncontrolledTooltip = RS.UncontrolledTooltip;
