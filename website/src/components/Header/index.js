import React, { useState } from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { Flex, Box } from 'reflexbox';

import Icon from 'components/Icon';
import Button from 'components/Button';
import Close from 'components/Close';
import { getThemeColor, getThemeSpacePx, device, px } from 'utils/css-utils';
import useMenuHeight from 'hooks/useMenuHeight';

import ReactFlowLogo from 'assets/images/react-flow-logo.svg';

const Centered = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 24px 16px;
`;

const Wrapper = styled.nav`
  flex-shrink: 0;
`;

const NavWrapper = styled(Box)`
  position: absolute;
  display: ${(p) => (p.menuOpen ? 'flex' : 'none')};
  height: ${(p) => px(p.height)};
  top: 0;
  left: 0;
  width: 100%;
  padding: ${getThemeSpacePx(3)};
  z-index: 500;
  background: ${getThemeColor('background')};
  align-items: center;
  flex-direction: column;

  .desktop {
    display: none;
  }

  @media ${device.tablet} {
    display: block;
    height: auto;
    position: relative;
    padding: 0;
    margin-left: auto;
    width: auto;
    background: transparent;
    align-items: unset;
    flex-direction: row;

    .desktop {
      display: inline-block;
    }

    .mobile {
      display: none;
    }
  }
`;

const Nav = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const NavInner = styled.div`
  line-height: 1;
  width: 100%;

  @media ${device.tablet} {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: auto;
  }
`;

const NavItem = styled(Link)`
  text-decoration: none;
  font-size: 30px;
  display: block;
  padding: ${(p) => (p.isButton ? '8px 16px' : '16px 0')};
  text-align: center;
  color: ${getThemeColor('textLight')};

  &:focus,
  &:visited,
  &:active {
    color: ${getThemeColor('textLight')};
  }

  &.active {
    color: ${getThemeColor('text')};
  }

  @media ${device.tablet} {
    margin-left: 50px;
    font-size: 16px;
    display: inline-block;
    padding: ${(p) => (p.isButton ? '8px 16px' : 0)};
    color: ${getThemeColor('textLight')};

    &:focus,
    &:visited {
      color: ${getThemeColor('textLight')};
    }

    &.active,
    &:hover {
      color: ${getThemeColor('text')};
    }
  }
`;

const GithubButton = styled.a`
  font-size: 30px;
  display: block;
  padding: ${(p) => (p.isButton ? '12px 24px' : '16px 0')} !important;
  text-align: center;
  color: ${getThemeColor('textLight')};

  &:focus,
  &:visited,
  &:active {
    color: ${getThemeColor('textLight')};
  }

  @media ${device.tablet} {
    margin-left: 50px;
    font-size: 16px;
    display: inline-block;
    background: ${(p) => p.theme.colors.textDark};

    &&& {
      &:hover {
        background: ${getThemeColor('red')};
      }
    }
  }
`;

const NavButton = styled.div`
  cursor: pointer;

  @media ${device.tablet} {
    display: none;
  }
`;

const Image = styled.img`
  display: block;
  width: 40px;
  margin-right: 12px;
`;

const LogoTitle = styled(Box)`
  font-weight: 900;
  font-size: 24px;
  letter-spacing: 0.5px;
  line-height: 1.2;
  color: ${getThemeColor('violet')};
`;

const LogoSubtitle = styled(Box)`
  font-size: 12px;
  letter-spacing: 0.5px;
  color: ${getThemeColor('silverDarken30')};
  line-height: 1.2;
`;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuHeight = useMenuHeight();

  const toggleMenu = () => {
    const nextMenuOpen = !menuOpen;

    document.body.classList.toggle('noscroll', nextMenuOpen);

    setMenuOpen(nextMenuOpen);
  };

  return (
    <Wrapper>
      <Centered>
        <Flex as={Link} to="/">
          <Image src={ReactFlowLogo} alt="React Flow Logo" />
          <Box>
            <LogoTitle>React Flow</LogoTitle>
            <LogoSubtitle>an open source library by webkid.io</LogoSubtitle>
          </Box>
        </Flex>
        <NavButton onClick={toggleMenu}>
          <Icon name="menu" strokeColor="text" colorizeStroke />
        </NavButton>
        <NavWrapper menuOpen={menuOpen} height={menuHeight}>
          <Nav>
            <NavInner>
              <NavItem to="/" activeClassName="active" className="mobile">
                Home
              </NavItem>
              <NavItem to="/docs/" activeClassName="active" partiallyActive>
                Docs
              </NavItem>
              <NavItem to="/examples/" activeClassName="active" partiallyActive>
                Examples
              </NavItem>

              <Button
                as={GithubButton}
                href="https://github.com/wbkd/react-flow"
                activeClassName="active"
                icon="github_circle"
                className="desktop"
                isButton
                color="textInverted"
              >
                Github
              </Button>

              <GithubButton
                href="https://github.com/wbkd/react-flow"
                activeClassName="active"
                className="mobile"
                isButton
              >
                Github
              </GithubButton>
            </NavInner>
          </Nav>
          <Close onClick={toggleMenu} className="mobile" />
        </NavWrapper>
      </Centered>
    </Wrapper>
  );
};

export default Header;
