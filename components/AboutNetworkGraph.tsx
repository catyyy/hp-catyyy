'use client';

import { useEffect, useRef } from 'react';

class NetworkGraph {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[];
    private animationFrameId: number;
    private centerPosition: { x: number; y: number };
    private onParticlesUpdate?: (points: {x: number, y: number}[]) => void;

    constructor(canvas: HTMLCanvasElement, onParticlesUpdate?: (points: {x: number, y: number}[]) => void) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.particles = [];
        this.animationFrameId = 0;
        this.centerPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.onParticlesUpdate = onParticlesUpdate;

        this.init();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    private init(): void {
        this.resizeCanvas();
        this.createParticles();
        this.animate();
    }

    private resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        // 当屏幕大小改变时重新创建粒子以保持合适的密度
        this.createParticles();
    }

    private createParticles(): void {
        // 根据屏幕大小动态调整粒子数量
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 25000);
        this.particles = [];

        for (let i = 0; i < numberOfParticles; i++) {
            // 在整个屏幕范围内创建粒子，留出小边距
            const margin = 50;
            const x = margin + Math.random() * (this.canvas.width - 2 * margin);
            const y = margin + Math.random() * (this.canvas.height - 2 * margin);
            
            this.particles.push(new Particle(
                x,
                y,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            ));
        }
    }

    private drawConnections(): void {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; // 进一步增加基础不透明度
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // 使端点完全不透明
        this.ctx.lineWidth = 1.2; // 增加线条宽度

        // 更新粒子位置
        for (const particle of this.particles) {
            // 添加极小的随机性，使运动看起来更自然
            particle.vx += (Math.random() - 0.5) * 0.002;
            particle.vy += (Math.random() - 0.5) * 0.002;

            // 限制最大速度
            const maxSpeed = 0.15;
            const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (currentSpeed > maxSpeed) {
                particle.vx = (particle.vx / currentSpeed) * maxSpeed;
                particle.vy = (particle.vy / currentSpeed) * maxSpeed;
            }

            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 边界检查 - 让粒子在屏幕边缘反弹
            const margin = 50;
            if (particle.x < margin) {
                particle.x = margin;
                particle.vx *= -0.5;
            }
            if (particle.x > this.canvas.width - margin) {
                particle.x = this.canvas.width - margin;
                particle.vx *= -0.5;
            }
            if (particle.y < margin) {
                particle.y = margin;
                particle.vy *= -0.5;
            }
            if (particle.y > this.canvas.height - margin) {
                particle.y = this.canvas.height - margin;
                particle.vy *= -0.5;
            }
        }

        // 连接粒子形成多边形
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            // 寻找最近的几个粒子进行连接
            const connections = this.particles
                .map((p, index) => ({
                    particle: p,
                    distance: Math.sqrt(
                        Math.pow(p.x - particle.x, 2) + 
                        Math.pow(p.y - particle.y, 2)
                    ),
                    index
                }))
                .filter(conn => conn.index !== i && conn.distance < 400)
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 4);

            // 绘制连接
            if (connections.length >= 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                
                // 绘制到最近的点
                for (const conn of connections) {
                    this.ctx.lineTo(conn.particle.x, conn.particle.y);
                }
                
                // 闭合路径形成多边形
                this.ctx.lineTo(connections[0].particle.x, connections[0].particle.y);
                
                // 设置透明度，距离越近线条越清晰
                const avgDistance = connections.reduce((sum, conn) => sum + conn.distance, 0) / connections.length;
                const opacity = Math.max(0.2, 0.35 * (1 - avgDistance / 400)); // 提高最小和最大不透明度
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.stroke();
            }

            // 绘制稍大一点的粒子并添加光晕效果
            // 先绘制光晕
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.fill();
            
            // 再绘制中心点
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            this.ctx.fill();
        }
    }

    private animate(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        // 每帧将所有粒子坐标传递给回调
        if (this.onParticlesUpdate) {
            this.onParticlesUpdate(this.particles.map(p => ({x: p.x, y: p.y})));
        }
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    public destroy(): void {
        cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
    }
}

class Particle {
    constructor(
        public x: number,
        public y: number,
        public vx: number,
        public vy: number
    ) {}
}

interface AboutNetworkGraphComponentProps {
  setPoints?: (points: {x: number, y: number}[]) => void;
}

export default function AboutNetworkGraphComponent({ setPoints }: AboutNetworkGraphComponentProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const graphRef = useRef<NetworkGraph | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            graphRef.current = new NetworkGraph(canvasRef.current, setPoints);
        }

        return () => {
            if (graphRef.current) {
                graphRef.current.destroy();
            }
        };
    }, [setPoints]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}