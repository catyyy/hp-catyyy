"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Oomph } from '@/utils/Oomph';

const Navbar = () => {
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const currentChapterIndex = useRef(0);
  const [isOnDarkBg, setIsOnDarkBg] = useState(true);

  useEffect(() => {
    // 检查当前路径并设置初始高亮状态
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      updateNavHighlight(0);
    } else if (currentPath === '/about') {
      updateNavHighlight(1);
    } else if (currentPath === '/projects') {
      updateNavHighlight(2);
    }

    // 初始化字母动画效果
    navLinksRef.current.forEach((link, index) => {
      if (link) {
        const oomph = new Oomph(link, {
          scramble: true,
          animationStartDelay: 500 * index
        });
        oomph.init();
      }
    });

    // 检测当前section的背景色并更新导航栏样式
    const checkBackground = () => {
      // 首先检查当前页面路径
      const currentPath = window.location.pathname;
      if (currentPath === '/about') {
        const aboutSection = document.getElementById('about');
        if (aboutSection?.classList.contains('bg-black')) {
          setIsOnDarkBg(true);
          updateNavHighlight(1);
          return;
        }
      }

      const sections = [
        'home',
        'about',
        'projects'
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 60 && rect.bottom >= 60) { // 导航栏高度是60px
            const isBlackBg = element.classList.contains('bg-black');
            setIsOnDarkBg(isBlackBg);
            updateNavHighlight(sections.indexOf(section));
            break;
          }
        }
      }
    };

    const handleScroll = () => {
      checkBackground();
    };

    // 初始检查和滚动监听
    checkBackground();
    window.addEventListener('scroll', handleScroll);
    // 添加路由变化后的检查
    window.addEventListener('popstate', checkBackground);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', checkBackground);
    };
  }, []);

  const updateNavHighlight = (index: number) => {
    currentChapterIndex.current = index;
    
    navLinksRef.current.forEach((link, i) => {
      if (link) {
        link.parentElement?.classList.toggle('active', i === index);
      }
    });
  };

  return (
    <header 
      id="header" 
      className={isOnDarkBg ? 'on-dark' : 'on-light'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '60px',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
    >
      <h1 className="logo">
        <Link href="/">
          .Nexus();
        </Link>
      </h1>
      <nav>
        <ul>
          <li>
            <span></span>
            <Link 
              href="/"
              className="bel"
              ref={el => { if(el) navLinksRef.current[0] = el }}
              data-chapter-index="0"
            >
              Home
            </Link>
          </li>
          <li>
            <span></span>
            <Link 
              href="/about"
              className="dis"
              ref={el => { if(el) navLinksRef.current[1] = el }}
              data-chapter-index="1"
            >
              About
            </Link>
          </li>
          <li>
            <span></span>
            <Link 
              href="/projects"
              className="ima"
              ref={el => { if(el) navLinksRef.current[2] = el }}
              data-chapter-index="2"
            >
              Projects
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;