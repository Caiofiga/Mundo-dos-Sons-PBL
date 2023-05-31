import React, { useState, useEffect } from "react";
import { useTransition, animated, useSpringRef } from "react-spring";

const AnimatedPages = ({ children }) => {
  const [items, setItems] = useState(React.Children.toArray(children));
  const transRef = useSpringRef();
  const transitions = useTransition(items, {
    ref: transRef,
    keys: (item) => item.key,
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  useEffect(() => {
    setItems(React.Children.toArray(children));
    transRef.start();
  }, [children]);

  return (
    <div className={`flex fill`}>
      {transitions((style, item) => (
        <animated.div style={{ ...style }}>{item}</animated.div>
      ))}
    </div>
  );
};

export default AnimatedPages;
