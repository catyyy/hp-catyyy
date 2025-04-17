import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  // 假设json文件放在项目根目录下，名为projects.json
  const filePath = path.join(process.cwd(), 'projects.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const projects = JSON.parse(data);
    return NextResponse.json({ success: true, projects });
  } catch {
    return NextResponse.json({ success: false, error: '无法读取项目数据' }, { status: 500 });
  }
} 