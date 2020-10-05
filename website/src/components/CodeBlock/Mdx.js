import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import dracula from 'prism-react-renderer/themes/github';

export default ({ children, className = 'javascript', language }) => {
  const lang = language ? language : className.replace(/language-/, '');

  return (
    <Highlight
      {...defaultProps}
      theme={dracula}
      code={children}
      language={lang}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            overflowX: 'auto',
            padding: '20px',
            borderRadius: '6px',
            margin: '40px 0 40px 0',
            fontSize: 14,
          }}
        >
          {tokens
            .filter((line) => line.some((l) => l.content))
            .map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
        </pre>
      )}
    </Highlight>
  );
};
