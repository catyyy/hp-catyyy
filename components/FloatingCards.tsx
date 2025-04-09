import { useState, useRef, useEffect } from 'react';
import { Oomph } from '@/utils/Oomph';

interface CardInfo {
  title: string;
  content: React.ReactNode;
  position: { top: string; left: string };
}

const cards: CardInfo[] = [
  {
    title: "Property",
    content: (
      <div className="space-y-2">
        <p><span className="font-bold bg-[#32c8f4] px-1 text-white">Name:</span> <span className="text-gray-300">Cat_yyy</span></p>
        <p><span className="font-bold bg-[#32c8f4] px-1 text-white">Handle:</span> <span className="text-gray-300">御影(Mikage)</span></p>
        <p><span className="font-bold bg-[#32c8f4] px-1 text-white">Age:</span> <span className="text-gray-300">24</span></p>
        <p><span className="font-bold bg-[#32c8f4] px-1 text-white">Location:</span> <span className="text-gray-300">Tokyo</span></p>
        <p><span className="font-bold bg-[#32c8f4] px-1 text-white">Affiliation:</span> <span className="text-gray-300">Institute of Science Tokyo</span></p>
      </div>
    ),
    position: { top: '20%', left: '20%' }
  },
  {
    title: "Contact",
    content: (
      <div className="space-y-2">
        <p>Email: xxx@example.com</p>
        <p>GitHub: @username</p>
        <p>WeChat: xxx</p>
      </div>
    ),
    position: { top: '30%', left: '60%' }
  },
  {
    title: "Skills",
    content: (
      <div className="space-y-2">
        <p>前端：React, Next.js, TypeScript</p>
        <p>UI：Tailwind CSS, Material-UI</p>
        <p>工具：Git, Webpack, Vite</p>
      </div>
    ),
    position: { top: '60%', left: '25%' }
  },
  {
    title: "Profile",
    content: (
      <div className="space-y-2">
        <p>热爱技术，热爱开源</p>
        <p>专注于Web前端开发</p>
        <p>持续学习，不断进步</p>
      </div>
    ),
    position: { top: '70%', left: '70%' }
  }
];

export default function FloatingCards() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const oomphInstances = useRef<(Oomph | null)[]>([]);

  useEffect(() => {
    // 初始化所有卡片标题的 Oomph 实例
    cards.forEach((_, index) => {
      if (titleRefs.current[index] && !oomphInstances.current[index]) {
        oomphInstances.current[index] = new Oomph(titleRefs.current[index]!, {
          scramble: true,
          animationStartDelay: 0
        });
      }
    });
  }, []);

  const handleCardEnter = (index: number) => {
    setActiveCard(index);
    if (oomphInstances.current[index]) {
      oomphInstances.current[index]?.scrambleText(800, false);
    }
  };

  const handleCardLeave = (index: number) => {
    setActiveCard(null);
    if (oomphInstances.current[index]) {
      oomphInstances.current[index]?.unscrambleText();
    }
  };

  return (
    <div className="absolute inset-0">
      {cards.map((card, index) => (
        <div
          key={index}
          className="absolute transition-all duration-300"
          style={{
            top: card.position.top,
            left: card.position.left
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
            <div className="relative bg-black/80 backdrop-blur-sm p-4 min-w-[240px]">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#32c8f4] opacity-70 group-hover:opacity-100 group-hover:h-[3px] transition-all"></div>

              <h3 
                ref={el => titleRefs.current[index] = el}
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
                  {card.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}