"use client";

import { useEffect, useState } from "react";
import FloatingCards from "@/components/FloatingCards";
import Navbar from "@/components/Navbar";
import NetworkGraphComponent from "@/components/NetworkGraph";
import { useRouter } from "next/navigation";
import nextConfig from "@/next.config";
import Image from "next/image";

interface ProjectCard {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

const BASE_PATH = nextConfig.basePath || "";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.projects);
        }
      });
  }, []);

  return (
    <main className="relative min-h-screen">
      <div>
        <section id="projects" className="min-h-screen relative">
          <div className="max-w-4xl mx-auto px-4 py-24">
            {/* <h2 className="text-3xl font-bold mb-8">Projects</h2> */}
            <div className="relative w-full h-[600px]">
              <div className="absolute inset-0 z-10">
                <div className="flex flex-wrap gap-14 justify-center items-center h-full">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="group relative bg-black/95 w-80 h-60 cursor-pointer transition-all duration-300 overflow-hidden select-none hover:scale-105 border-b-2 border-[#32c8f4]"
                      style={{ borderRadius: 0, boxShadow: 'none', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
                      onClick={() => router.push(project.link)}
                    >
                      {/* 底部蓝色横条 */}
                      <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#32c8f4] opacity-70 group-hover:opacity-100 group-hover:h-[3px] transition-all" style={{ borderRadius: 0 }} />
                      <div style={{position: 'relative', width: '100%', height: '148.3px', margin: 0, padding: 0}}>
                        <Image
                          src={`${BASE_PATH}${project.image}`}
                          alt={project.title}
                          fill
                          style={{
                            objectFit: 'cover',
                            borderRadius: 0,
                            margin: 0,
                            padding: 0,
                            display: 'block',
                          }}
                        />
                      </div>
                      <div className="px-4 pt-3 pb-2">
                        <h3 className="relative text-xl font-bold mb-2 transition-colors duration-300 text-[#32c8f4] group-hover:text-[#ffe600]">
                          {project.title}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-3">{project.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 可选：如需悬浮动画可用FloatingCards组件包裹或自定义 */}
              {/* <FloatingCards /> */}
            </div>
          </div>
          <Navbar />
          <NetworkGraphComponent />
        </section>
      </div>
    </main>
  );
}