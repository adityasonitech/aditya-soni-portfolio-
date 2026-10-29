"use client";

/** Infinite horizontal marquee. Items are duplicated so the loop is seamless. */
export default function Marquee({ items = [], speed = 32, className = "" }) {
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div className={`marquee ${className}`} aria-label={items.join(", ")}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }} aria-hidden="true">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            {item}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
