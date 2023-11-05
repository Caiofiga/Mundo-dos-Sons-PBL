import React, { useState, useEffect, ReactNode, ReactElement } from "react";
import { useTransition, animated, useSpringRef } from "react-spring";

type ReactChild = ReactElement | string | number;

const AnimatedPages = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ReactChild[]>(
    React.Children.toArray(children) as ReactChild[]
  );
  const transRef = useSpringRef(); // Removed the type assertion for now

  const transitions = useTransition(items, {
    // Removed the ref property for now to troubleshoot other issues
    keys: (item: ReactChild) =>
      typeof item === "string" || typeof item === "number"
        ? item
        : item.key || null,
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  useEffect(() => {
    setItems(React.Children.toArray(children) as ReactChild[]);
    transRef.start();
  }, [children, transRef]);

  return (
    <div className="flex fill">
      {transitions((style, item) => (
        <animated.div style={style}>{item}</animated.div>
      ))}
    </div>
  );
};

export default AnimatedPages;
