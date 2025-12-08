import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';

interface IProps {
  children: React.ReactNode;
  open: boolean;
}

export default function Collapse({ children, open }: IProps) {
  return (
    <LazyMotion features={domAnimation}>
      <div aria-expanded={open}>
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
