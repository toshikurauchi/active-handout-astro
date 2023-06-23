import { useEffect, useRef, useState } from "react";
import MenuButton from "../MenuButton";
import styles from "./styles.module.scss";
import Navigation from "../Navigation";
import { buildNavTree } from "../Navigation/nav-tree-client";
import type { SerializableNavItem } from "../Navigation/types";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderReact({
  title,
  homeUrl,
  navEntries,
}: {
  title: string;
  homeUrl: string;
  navEntries: SerializableNavItem[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navTree = buildNavTree(navEntries);

  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    if (headerRef?.current?.clientHeight) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, [headerRef?.current?.clientHeight]);

  const [navFitsLeft, setNavFitsLeft] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className={styles.mainHeader} ref={headerRef}>
        <MenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <a href={homeUrl} className={styles.homeBtn}>
          {title}
        </a>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {!navFitsLeft && (
              <motion.div
                className={styles.menuOverlay}
                onClick={toggleMenu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
            <Navigation
              navTree={navTree}
              headerHeight={headerHeight}
              navFitsLeft={navFitsLeft}
              setNavFitsLeft={setNavFitsLeft}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
