import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Oomph } from '@/utils/Oomph';

interface CardInfo {
  title: string;
  position: { top: string; left: string };
}

interface FloatingCardsProps {
  points?: { x: number; y: number }[];
}

const cards: CardInfo[] = [
  {
    title: "Property",
    position: { top: '27%', left: '25%' }
  },
  {
    title: "Contact",
    position: { top: '30%', left: '64%' }
  },
  {
    title: "Skills",
    position: { top: '60%', left: '65%' }
  },
  {
    title: "Profile",
    position: { top: '56%', left: '28%' }
  }
];

export default function FloatingCards({ points = [] }: FloatingCardsProps) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [typedIndexes, setTypedIndexes] = useState<number[]>([]);
  const typingInterval = useRef<NodeJS.Timeout | null>(null);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const oomphInstances = useRef<(Oomph | null)[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const propertyLabels = [
    'Name',
    'Handle',
    'Age',
    'Location',
    'Affiliation'
  ];
  const propertyContents = [
    'Cat_yyy',
    '御影(Mikage)',
    '24',
    'Tokyo',
    'Institute of Science Tokyo',
  ];

  // 技能图标数据
  const skillIcons = [
    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cplusplus.svg', alt: 'C++' },
    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg', alt: 'Python' },
    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/c.svg', alt: 'C' },
    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typescript.svg', alt: 'TypeScript' },
    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg', alt: 'Docker' },
    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nextdotjs.svg', alt: 'Next.js' },
    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg', alt: 'AWS' },
    { src: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/git.svg', alt: 'Git' },
  ];
  const [skillShowCount, setSkillShowCount] = useState(0);
  const skillInterval = useRef<NodeJS.Timeout | null>(null);

  // Profile打字机内容
  const profileText = `Tech enthusiast since childhood, able to install OS in elementary school.\nComputer science major with interests in media, society, psychology.\nExcel at cross-disciplinary problem solving through creative knowledge integration.`;
  const [profileTyped, setProfileTyped] = useState('');
  const profileInterval = useRef<NodeJS.Timeout | null>(null);

  // 漂浮动画状态
  const [floatOffsets, setFloatOffsets] = useState<{x: number, y: number}[]>(() => cards.map(() => ({x: 0, y: 0})));
  const floatFrame = useRef<number | null>(null);

  // 卡片内容ref
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // 每个卡片的实际宽高
  const [cardSizes, setCardSizes] = useState<{width: number, height: number}[]>(() => cards.map(() => ({width: 200, height: 100})));

  // 跟踪窗口尺寸，避免初始渲染偏移
  const getInitWindowSize = () => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1200, height: 800 };
  };
  const [windowSize, setWindowSize] = useState(getInitWindowSize);
  const [ready, setReady] = useState(false);

  // 展开时动态测量卡片内容尺寸（内容未加载完时锁定为最终值）
  useLayoutEffect(() => {
    const sizes = cards.map((_, i) => {
      // Profile内容未加载完时，锁定为较大预估高度
      if (i === 3 && activeCard === 3 && profileTyped.length < profileText.length) {
        return { width: 400, height: 320 };
      }
      // Profile内容未加载时（即activeCard不是3），也用预估高度
      if (i === 3 && profileTyped.length === 0) {
        return { width: 400, height: 320 };
      }
      // Skills内容未加载完时，锁定为较大预估高度
      if (i === 2 && activeCard === 2 && skillShowCount < skillIcons.length) {
        return { width: 320, height: 180 };
      }
      // Skills内容未加载时
      if (i === 2 && skillShowCount === 0) {
        return { width: 320, height: 180 };
      }
      // 其它情况正常测量
      const el = cardRefs.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }
      return { width: 200, height: 100 };
    });
    setCardSizes(sizes);
  }, [activeCard, profileTyped, skillShowCount, typedIndexes]);

  useEffect(() => {
    cards.forEach((_, index) => {
      if (titleRefs.current[index] && !oomphInstances.current[index]) {
        oomphInstances.current[index] = new Oomph(titleRefs.current[index]!, {
          scramble: true,
          animationStartDelay: 0
        });
      }
    });
    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
    };
  }, []);

  useEffect(() => {
    if (activeCard === 0) {
      setTypedIndexes(propertyContents.map(() => 0));
      let line = 0;
      typingInterval.current = setInterval(() => {
        setTypedIndexes(prev => {
          const next = [...prev];
          while (line < propertyContents.length && next[line] >= propertyContents[line].length) {
            line++;
          }
          if (line < propertyContents.length) {
            next[line] = next[line] + 1;
          }
          return next;
        });
        if (line >= propertyContents.length) {
          if (typingInterval.current) clearInterval(typingInterval.current);
        }
      }, 30);
    } else {
      setTypedIndexes([]);
      if (typingInterval.current) clearInterval(typingInterval.current);
    }
  }, [activeCard]);

  useEffect(() => {
    if (activeCard === 2) {
      setSkillShowCount(0);
      let idx = 0;
      skillInterval.current = setInterval(() => {
        idx++;
        setSkillShowCount(idx);
        if (idx >= skillIcons.length) {
          if (skillInterval.current) clearInterval(skillInterval.current);
        }
      }, 80);
    } else {
      setSkillShowCount(0);
      if (skillInterval.current) clearInterval(skillInterval.current);
    }
  }, [activeCard]);

  useEffect(() => {
    if (activeCard === 3) {
      setProfileTyped('');
      let idx = 0;
      profileInterval.current = setInterval(() => {
        idx++;
        setProfileTyped(profileText.slice(0, idx));
        if (idx >= profileText.length) {
          if (profileInterval.current) clearInterval(profileInterval.current);
        }
      }, 18);
    } else {
      setProfileTyped('');
      if (profileInterval.current) clearInterval(profileInterval.current);
    }
  }, [activeCard]);

  // 轻微漂浮动画
  useEffect(() => {
    let t = 0;
    let running = true;
    function animate() {
      t += 0.028;
      setFloatOffsets(cards.map((_, i) => {
        // 增加漂浮幅度
        const ampX = 18;
        const ampY = 14;
        return {
          x: ampX * Math.sin(t + i),
          y: ampY * Math.cos(t + i * 1.3)
        };
      }));
      if (running) requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, []);

  useEffect(() => {
    function update() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setReady(true);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleCardEnter = (index: number) => {
    setActiveCard(index);
    if (oomphInstances.current[index]) {
      oomphInstances.current[index]?.scrambleText(800, false);
    }
  };

  const handleCardLeave = (index: number) => {
    setActiveCard(null);
    setTypedIndexes([]);
    if (typingInterval.current) clearInterval(typingInterval.current);
    if (oomphInstances.current[index]) {
      oomphInstances.current[index]?.unscrambleText();
    }
  };

  return (
    <div className="absolute inset-0">
      {ready && (
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          width={windowSize.width}
          height={windowSize.height}
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 5 }}
        >
          {cards.map((card, index) => {
            const el = cardRefs.current[index];
            if (!el || points.length === 0) return null;
            if (activeCard !== index) return null;
            const rect = el.getBoundingClientRect();
            const svgRect = svgRef.current?.getBoundingClientRect();
            // 检查当前scale
            let scale = 1;
            const className = el.className || '';
            if (className.includes('scale-95')) scale = 0.95;
            // 视觉左上角修正
            const cardX = (svgRect ? rect.left - svgRect.left : rect.left) + (1 - scale) * rect.width / 2;
            const cardY = (svgRect ? rect.top - svgRect.top : rect.top) + (1 - scale) * rect.height / 2;
            // 找到最近的点
            let minDist = Infinity;
            let nearest = null;
            for (const p of points) {
              const d = (p.x - cardX) ** 2 + (p.y - cardY) ** 2;
              if (d < minDist) {
                minDist = d;
                nearest = p;
              }
            }
            if (!nearest) return null;
            return (
              <line
                key={index}
                x1={cardX}
                y1={cardY}
                x2={nearest.x}
                y2={nearest.y}
                stroke="#32c8f4"
                strokeWidth={2}
                opacity={0.85}
              />
            );
          })}
        </svg>
      )}
      {ready && cards.map((card, index) => {
        // 计算卡片宽高
        const isActive = activeCard === index;
        const cardWidth = isActive ? 260 : 130;
        const cardHeight = isActive ? (index === 3 ? window.innerHeight * 0.5 : 220) : 80;
        // 以左上角为基准定位
        const left = windowSize.width * parseFloat(card.position.left) / 100;
        const top = windowSize.height * parseFloat(card.position.top) / 100;
        // 加上漂浮偏移
        let leftPos = left + (floatOffsets[index]?.x || 0);
        let topPos = top + (floatOffsets[index]?.y || 0);
        return (
          <div
            key={index}
            ref={el => { cardRefs.current[index] = el; }}
            className="absolute transition-all duration-300"
            style={{
              left: leftPos,
              top: topPos,
              zIndex: isActive ? 20 : 10,
              transformOrigin: 'left top',
            }}
          >
            <div
              className={`group relative transition-all duration-300 ${
                activeCard === index
                  ? 'scale-100 opacity-100'
                  : 'scale-95 opacity-90 hover:scale-105 hover:opacity-100'
              }`}
              onMouseEnter={() => handleCardEnter(index)}
              onMouseLeave={() => handleCardLeave(index)}
            >
              <div
                style={
                  index === 0 && activeCard === 0
                    ? {
                        minWidth: `${120 + Math.min(120, (propertyContents.reduce((sum, str, i) => sum + (typedIndexes[i] || 0), 0)) * 4)}px`,
                        transition: 'min-width 0.3s cubic-bezier(0.4,0,0.2,1)'
                      }
                    : undefined
                }
                className={`relative bg-black/80 backdrop-blur-sm p-4 transition-all duration-300 ${
                  index === 0
                    ? (activeCard === 0 ? '' : 'min-w-[120px]')
                    : (activeCard === index ? 'min-w-[240px]' : 'min-w-[120px]')
                }`}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#32c8f4] opacity-70 group-hover:opacity-100 group-hover:h-[3px] transition-all"></div>

                <h3 
                  ref={(el: HTMLHeadingElement | null) => {
                    titleRefs.current[index] = el;
                  }}
                  className={`relative text-xl font-bold mb-2 transition-colors duration-300 ${
                    activeCard === index ? 'text-[#32c8f4]' : 'text-white'
                  }`}
                >
                  {card.title}
                </h3>

                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeCard === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-gray-300 animate-fadeIn space-y-2">
                    {index === 0 && activeCard === 0 && (
                      <div className="fade-in">
                        {propertyLabels.map((label, i) => (
                          <p key={i}>
                            <span className="font-bold bg-[#32c8f4] px-1 text-white">{label}:</span>{' '}
                            <span className="text-gray-300">{propertyContents[i].slice(0, typedIndexes[i] || 0)}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    {index === 1 && activeCard === 1 && (
                      <div className="fade-in flex gap-4 items-center">
                        {/* Github 图标 */}
                        <a href="https://github.com/catyyy" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="block">
                          <div style={{width:44, height:44, background:'#fff', borderRadius:0, borderBottom:'4px solid #ffe600', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.12)'}}>
                            <img src="/github-mark.svg" alt="GitHub" width={36} height={36} style={{width:36, height:36, objectFit:'contain', display:'block'}} />
                          </div>
                        </a>
                        {/* X 图标 */}
                        <a href="https://x.com/cat_yyy" target="_blank" rel="noopener noreferrer" aria-label="X" className="block">
                          <div style={{width:44, height:44, background:'#fff', borderRadius:0, borderBottom:'4px solid #ffe600', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.12)'}}>
                            <img src="/X-mark.svg" alt="X" width={36} height={36} style={{width:36, height:36, objectFit:'contain', display:'block'}} />
                          </div>
                        </a>
                        {/* 邮件图标 */}
                        <a href="mailto:zongyejian@hotmail.com" aria-label="Email" className="block">
                          <div style={{width:44, height:44, background:'#fff', borderRadius:0, borderBottom:'4px solid #ffe600', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.12)'}}>
                            <img src="/email-mark.svg" alt="Email" width={36} height={36} style={{width:36, height:36, objectFit:'contain', display:'block'}} />
                          </div>
                        </a>
                      </div>
                    )}
                    {index === 2 && activeCard === 2 && (
                      <div className="fade-in grid grid-cols-4 gap-4">
                        {skillIcons.slice(0, skillShowCount).map((icon, i) => (
                          <div key={icon.alt} style={{width:44, height:44, background:'#fff', borderRadius:0, borderBottom:'4px solid #ffe600', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.12)'}}>
                            <img src={icon.src} alt={icon.alt} width={36} height={36} style={{width:36, height:36, objectFit:'contain', display:'block'}} />
                          </div>
                        ))}
                      </div>
                    )}
                    {index === 3 && activeCard === 3 && (
                      <div className="fade-in text-base leading-relaxed whitespace-pre-line overflow-auto" style={{maxHeight: '50vh', wordBreak: 'break-word'}}>
                        {profileTyped}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}