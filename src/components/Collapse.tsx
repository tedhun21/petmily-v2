import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';

export default function Collapse({ children, open, rest }: any) {
  return (
    <LazyMotion features={domAnimation}>
      <div aria-expanded={open} {...rest}>
        <AnimatePresence>
          {open && (
            <m.div
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {children}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
