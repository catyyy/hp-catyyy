"use client";

import NetworkGraphComponent from "@/components/NetworkGraph";
import Navbar from "@/components/Navbar";

export default function Projects() {
  return (
    <main className="relative min-h-screen">
      <div>
        <section id="projects" className="min-h-screen relative">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">个人项目</h3>
                <ul className="space-y-2">
                  <li>• 待添加项目1</li>
                  <li>• 待添加项目2</li>
                  <li>• 待添加项目3</li>
                  <li>• 待添加项目4</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">开源贡献</h3>
                <ul className="space-y-2">
                  <li>• 待添加项目1</li>
                  <li>• 待添加项目2</li>
                  <li>• 待添加项目3</li>
                  <li>• 待添加项目4</li>
                </ul>
              </div>
            </div>
          </div>
          <Navbar />
          <NetworkGraphComponent />
        </section>
      </div>
    </main>
  );
}