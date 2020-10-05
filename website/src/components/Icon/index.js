import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Flex } from 'reflexbox';
import { isOldIE } from 'utils/browser-utils';

import Mail from 'assets/icons/mail.svg';
import Github from 'assets/icons/github_circle.svg';
import ArrowRight from 'assets/icons/arrow_right.svg';
import Menu from 'assets/icons/menu.svg';
import Code from 'assets/icons/code.svg';

const IconWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;

  svg {
    max-width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;

    path,
    circle,
    rect,
    line,
    polyline {
      stroke: ${(p) =>
        p.colorizeStroke
          ? p.theme.colors[p.strokeColor] || p.theme.colors.text
          : 'none'};
    }

    path.nostroke,
    circle.nostroke,
    rect.nostroke,
    line.nostroke,
    polyline.nostroke {
      stroke: none;
      fill: ${(p) =>
        p.colorizeStroke
          ? p.theme.colors[p.strokeColor] || p.theme.colors.text
          : 'none'};
    }
  }
`;

const preLoaded = {
  mail: Mail,
  arrow_right: ArrowRight,
  menu: Menu,
  github_circle: Github,
  code: Code,
};

const getPreLoadedIcon = (name) =>
  preLoaded[name] ? () => preLoaded[name] : null;

export default ({
  name = 'datavis',
  colorizeStroke = false,
  strokeColor = null,
  ...restProps
}) => {
  const [SVGComponent, setSVGComponent] = useState(getPreLoadedIcon(name));

  useEffect(() => {
    if (!SVGComponent) {
      (async () => {
        try {
          const svgComp = await import(`assets/icons/${name}.svg`);
          setSVGComponent(svgComp);
        } catch (err) {
          console.warn(`error loading icon: ${name}`);
        }
      })();
    }
  }, [SVGComponent, name]);

  if (!SVGComponent) {
    return null;
  }

  const IconComponent = SVGComponent.default
    ? SVGComponent.default
    : SVGComponent;

  if (isOldIE()) {
    return null;
  }

  return (
    <IconWrapper
      className="icon"
      colorizeStroke={colorizeStroke}
      strokeColor={strokeColor}
      height={restProps.width || 'auto'}
      {...restProps}
    >
      <IconComponent />
    </IconWrapper>
  );
};
