import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import type { NavTreeItem } from "./types";

export default function Navigation({
  navTree,
  headerHeight,
  navFitsLeft,
  setNavFitsLeft,
}: {
  navTree: NavTreeItem[];
  headerHeight: number;
  navFitsLeft: boolean;
  setNavFitsLeft: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navRef?.current && headerHeight) {
      navRef.current.style.setProperty("--header-height", `${headerHeight}px`);
    }
  }, [navRef?.current, headerHeight]);

  useEffect(() => {
    if (navRef?.current?.clientWidth) {
      const mainContent = document.querySelector(".main-content");
      if (!mainContent) return;

      const mainContentWidth = mainContent.clientWidth;
      const navWidth = navRef.current.clientWidth;
      const windowWidth = window.innerWidth;
      const navFitsLeft = (windowWidth - mainContentWidth) / 2 >= navWidth;
      setNavFitsLeft(navFitsLeft);
    }
  }, [navRef?.current?.clientWidth]);

  return (
    <motion.nav
      className={`${styles.navigation} ${navFitsLeft ? styles.noOverlap : ""}`}
      ref={navRef}
      initial={{ x: -500 }}
      animate={{ x: 0 }}
      exit={{ x: -500 }}
      transition={{ ease: "easeInOut", delayChildren: 0.2, duration: 0.3 }}
    >
      <ul>
        {navTree.map((entry, idx) => (
          <NavItem entry={entry} key={`navitem--${idx}`} />
        ))}
      </ul>
    </motion.nav>
  );
}

function NavItem({ entry }: { entry: NavTreeItem }) {
  const liVariants = {
    hidden: {
      x: -100,
    },
    visible: {
      x: 0,
    },
  };

  return (
    <motion.li
      variants={liVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{
        ease: "easeInOut",
        staggerChildren: 0.1,
        duration: 0.2,
      }}
    >
      <a href={entry.url} className={entry.isCurrent ? styles.current : ""}>
        {entry.title}
      </a>
      {entry.children &&
        entry.children.map((child, idx) => (
          <ul key={`navchild--${idx}`}>
            <NavItem entry={child} />
          </ul>
        ))}
    </motion.li>
  );
}
