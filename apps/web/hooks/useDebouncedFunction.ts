import { useCallback, useEffect, useEffectEvent, useRef } from "react";

export function useDebouncedFunction<Args extends unknown[], Return = void>(
  callback: (...args: Args) => Return,
  delay = 500,
) {
  const onInvoke = useEffectEvent(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const debouncedFn = useCallback(
    (...args: Args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        onInvoke(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [delay, onInvoke],
  );

  return [debouncedFn, cancel] as const;
}
