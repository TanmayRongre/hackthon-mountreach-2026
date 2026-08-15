import { useEffect, useRef, useState } from 'react';

/**
 * useInView — fires once when element enters the viewport.
 * @param {Object} options - IntersectionObserver options
 * @returns {{ ref, inView }}
 */
export default function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el); // fire once
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
