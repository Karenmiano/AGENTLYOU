import React, { useRef, useState, useEffect } from "react";

interface SegmentedControlProps {
  name: string;
  segments: {
    label: string;
    value: string;
    ref: React.RefObject<HTMLDivElement | null>;
  }[];
  callback: (value: string) => void;
  defaultIndex?: number;
  controlRef: React.RefObject<HTMLDivElement | null>;
}

function SegmentedControl({
  name,
  segments,
  callback,
  defaultIndex = 0,
  controlRef,
}: SegmentedControlProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const componentReady = useRef(false);

  useEffect(function () {
    componentReady.current = true;
  }, []);

  useEffect(
    function () {
      const activeSegmentRef = segments[activeIndex].ref;
      const { offsetWidth, offsetLeft } = activeSegmentRef.current!;
      const { style } = controlRef.current!;

      style.setProperty("--highlight-width", `${offsetWidth}px`);
      style.setProperty("--highlight-x-pos", `${offsetLeft}px`);
    },
    [activeIndex, segments, controlRef]
  );

  function onInputChange(value: string, index: number) {
    setActiveIndex(index);
    callback(value);
  }

  return (
    <div ref={controlRef} className="controls-container">
      <div
        className={`controls ${componentReady.current ? "ready" : "loading"}`}
      >
        {segments.map((item, i) => (
          <div
            key={item.value}
            className={`segment ${i === activeIndex ? "active" : "inactive"}`}
            ref={item.ref}
          >
            <input
              type="radio"
              value={item.value}
              id={item.label}
              name={name}
              onChange={() => onInputChange(item.value, i)}
              checked={i === activeIndex}
            />
            <label htmlFor={item.label}>{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SegmentedControl;
