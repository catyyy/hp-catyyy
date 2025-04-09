'use client';

import { useEffect, useRef } from 'react';

class NetworkGraph {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[];
    private animationFrameId: number;
    private mousePosition: { x: number; y: number } = { x: 0, y: 0 };

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.particles = [];
        this.animationFrameId = 0;
        this.init();

        // 添加鼠标移动事件监听
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });
    }

    private init(): void {
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    private resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles(); // 重新创建粒子
    }

    private createParticles(): void {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 20000); // 根据屏幕大小调整粒子数量
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 2 - 1, // x速度
                Math.random() * 2 - 1  // y速度
            ));
        }
    }

    private drawConnections(): void {
        const ctx = this.ctx;
        const maxDist = 200; // 最大连接距离

        // 先绘制连接线
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 2.0; // 将线条宽度从0.3增加到0.8

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // 计算与鼠标的距离
            const mouseDistance = Math.hypot(
                particle.x - this.mousePosition.x,
                particle.y - this.mousePosition.y
            );

            // 如果粒子靠近鼠标，增加其亮度
            if (mouseDistance < maxDist) {
                ctx.globalAlpha = 0.8 * (1 - mouseDistance / maxDist);
            } else {
                ctx.globalAlpha = 0.2;
            }

            for (let j = i + 1; j < this.particles.length; j++) {
                const particle2 = this.particles[j];
                const dx = particle.x - particle2.x;
                const dy = particle.y - particle2.y;
                const distance = Math.hypot(dx, dy);

                if (distance < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.stroke();
                }
            }
        }

        // 然后绘制连接点
        ctx.fillStyle = '#000000'; // 黑色连接点
        ctx.globalAlpha = 0.6; // 点的透明度

        for (const particle of this.particles) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2); // 2px 半径的圆点
            ctx.fill();
        }
    }

    private animate(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        for (const particle of this.particles) {
            particle.update(this.canvas.width, this.canvas.height);
        }

        // 绘制连接线
        this.drawConnections();

        // 继续动画循环
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    public destroy(): void {
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
        cancelAnimationFrame(this.animationFrameId);
    }
}

class Particle {
    constructor(
        public x: number,
        public y: number,
        public vx: number,
        public vy: number
    ) {}

    update(width: number, height: number): void {
        this.x += this.vx;
        this.y += this.vy;

        // 边界检查
        if (this.x < 0) {
            this.x = width;
        } else if (this.x > width) {
            this.x = 0;
        }

        if (this.y < 0) {
            this.y = height;
        } else if (this.y > height) {
            this.y = 0;
        }
    }
}

export default function NetworkGraphComponent() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const graphRef = useRef<NetworkGraph | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            graphRef.current = new NetworkGraph(canvasRef.current);
        }

        // 清理函数
        return () => {
            if (graphRef.current) {
                graphRef.current.destroy();
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}