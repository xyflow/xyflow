import React, { Fragment, useState } from 'react';
import Link from 'gatsby-link';
import styled from '@emotion/styled';
import { Flex } from 'reflexbox';

import Icon from 'components/Icon';
import Close from 'components/Close';
import useMenuHeight from 'hooks/useMenuHeight';
import { getThemeColor, getThemeSpacePx, device, px } from 'utils/css-utils';

const Aside = styled.aside`
  display: ${(p) => (p.isOpen ? 'block' : 'none')};
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: ${(p) => px(p.height)};
  overflow-y: auto;
  background: white;
  z-index: 400;
  padding: 20px 10px;

  @media ${device.tablet} {
    width: 30%;
    max-width: 300px;
    padding: 16px;
    border-right: 1px solid ${getThemeColor('silverLighten30')};
    display: block;
    position: relative;
    height: auto;

    .mobile {
      display: none;
    }
  }
`;

const AsideInner = styled.div``;

const MobileButton = styled(Flex)`
  z-index: 10;
  background: ${getThemeColor('violetLighten5')};
  position: fixed;
  right: 16px;
  bottom: 16px;
  color: white;
  border-radius: 100%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  justify-content: center;
  align-items: center;

  @media ${device.tablet} {
    display: none;
  }
`;

const MenuLink = styled(Link)`
  display: block;
  padding: ${getThemeSpacePx(1)} ${getThemeSpacePx(2)};
  margin-left: ${(p) => (p.marginLeft ? `${p.marginLeft}px` : 0)};

  &.active,
  &:hover {
    background: ${getThemeColor('silverLighten30')};
  }
`;

const GroupLabel = styled.div`
  padding: ${getThemeSpacePx(1)} ${getThemeSpacePx(2)};
  color: ${getThemeColor('silverDarken60')};
  margin-left: ${(p) => (p.marginLeft ? `${p.marginLeft}px` : 0)};
`;

const MenuItem = ({ title, slug, marginLeft }) => {
  return (
    <MenuLink to={slug} marginLeft={marginLeft} activeClassName="active">
      {title}
    </MenuLink>
  );
};

const SideBarParts = ({ items, level }) =>
  items.map((menuItem) => {
    if (menuItem.title) {
      return (
        <MenuItem key={menuItem.slug} marginLeft={level * 16} {...menuItem} />
      );
    }

    return (
      <Fragment key={menuItem.group}>
        <GroupLabel marginLeft={level * 16}>{menuItem.group}</GroupLabel>
        <SideBarParts items={menuItem.items} level={level + 1} />
      </Fragment>
    );
  });

const Sidebar = ({ menu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuHeight = useMenuHeight();

  const toggleSidebar = () => {
    const nextMenuOpen = !isOpen;

    document.body.classList.toggle('noscroll', nextMenuOpen);

    setIsOpen(nextMenuOpen);
  };

  return (
    <>
      <MobileButton onClick={toggleSidebar}>
        <Icon
          name="menu"
          width="24px"
          colorizeStroke
          strokeColor="silverLighten60"
        />
      </MobileButton>
      <Aside isOpen={isOpen} height={menuHeight}>
        <AsideInner>
          <SideBarParts items={menu} level={0} />
          <Close className="mobile" onClick={toggleSidebar} />
        </AsideInner>
      </Aside>
    </>
  );
};

export default Sidebar;
