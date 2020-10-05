import React, { Fragment } from 'react';
import Link from 'gatsby-link';
import styled from '@emotion/styled';

import { getThemeColor, getThemeSpacePx } from 'utils/css-utils';

const Aside = styled.aside`
  width: 30%;
  max-width: 300px;
  padding: 16px;
  border-right: 1px solid ${getThemeColor('silverLighten30')};
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
  return (
    <Aside>
      <SideBarParts items={menu} level={0} />
    </Aside>
  );
};

export default Sidebar;
