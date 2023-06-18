import React, { useState, useEffect, ReactNode, ReactElement, Key } from "react";
import { useTransition, animated, useSpringRef } from "react-spring";

type ReactChild = ReactElement | string | number;

const AnimatedPages = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ReactChild[]>(React.Children.toArray(children) as ReactChild[]);
  const transRef = useSpringRef();
  const transitions = useTransition(items, {
    ref: transRef,
    keys: (item: ReactChild) => (React.isValidElement(item) ? item.key : 'item-' + item.toString()) as Key,
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  useEffect(() => {
    setItems(React.Children.toArray(children) as ReactChild[]);
    transRef.start();
  }, [children, transRef]);

  return (
    <div className={`flex fill`}>
      {transitions((style: any, item: any) => (
        <animated.div style={{ ...style }}>{item}</animated.div>
      ))}
    </div>
  );
};

export default AnimatedPages;
