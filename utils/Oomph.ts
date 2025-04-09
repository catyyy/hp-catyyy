export class Oomph {
  private element: HTMLElement;
  private originalText: string;
  private isScrambled: boolean;
  private scrambleTimeout: NodeJS.Timeout | null;
  private options: {
    scramble: boolean;
    animationStartDelay: number;
  };

  constructor(element: HTMLElement, options: { scramble: boolean; animationStartDelay: number }) {
    this.element = element;
    this.originalText = element.innerText;
    this.isScrambled = false;
    this.scrambleTimeout = null;
    this.options = options;
  }

  init() {
    if (this.options.scramble) {
      this.element.addEventListener('mouseenter', () => this.scrambleText());
      this.element.addEventListener('mouseleave', () => this.unscrambleText());
    }
  }

  public isInScrambledState(): boolean {
    return this.isScrambled;
  }

  public scrambleText(duration: number = 150, shouldKeepScrambled: boolean = false) {
    if (this.isScrambled) return;
    this.isScrambled = true;
    
    // 使用更丰富的字符集，包含特殊符号
    const chars = Array.from({ length: 94 }, (_, i) => String.fromCharCode(i + 33)).join('');
    
    let iterations = 0;
    const maxIterations = duration < 200 ? 8 : 15; // 增加迭代次数
    const iterationInterval = duration / maxIterations;
    
    const scramble = () => {
      if (!this.isScrambled || iterations >= maxIterations) {
        if (!shouldKeepScrambled) {
          this.element.innerText = this.originalText;
          this.isScrambled = false;
        }
        this.scrambleTimeout = null;
        return;
      }
      
      this.element.innerText = this.originalText
        .split('')
        .map((char, index) => {
          if (char === ' ') return char;
          // 根据当前迭代次数和字符位置计算概率
          const progress = iterations / maxIterations;
          const charProgress = index / this.originalText.length;
          // 如果当前进度大于字符位置的进度，保持原字符
          if (progress > charProgress) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      iterations++;
      this.scrambleTimeout = setTimeout(scramble, iterationInterval);
    };

    scramble();
  }

  public unscrambleText() {
    this.isScrambled = false;
    if (this.scrambleTimeout) {
      clearTimeout(this.scrambleTimeout);
    }
    this.element.innerText = this.originalText;
  }

  public updateText(text: string) {
    this.originalText = text;
    this.isScrambled = false;  // 更新文本时重置乱码状态
  }
}