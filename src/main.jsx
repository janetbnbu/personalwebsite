import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BrainCircuit,
  Contact,
  Layers3,
  Menu,
  Palette,
  Sparkles,
  Wand2,
} from 'lucide-react';
import './styles.css';
import About from './components/About.tsx';

const projects = [
  {
    title: 'AI Brand Visual System',
    type: 'Brand identity / AI visual',
    desc: '用 AI 辅助探索品牌语气、视觉资产和内容方向，形成可延展的视觉系统。',
    url: '#',
    image: 'linear-gradient(135deg, #5EEAD4, #C4B5FD 56%, #FFD6A5)',
  },
  {
    title: 'Furniture Online Store',
    type: 'App development',
    desc: '为产品传播打造高级、清晰、可识别的视觉语言，适配多渠道内容。',
    url: 'https://qimu-292919-10-1464111003.sh.run.tcloudbase.com/contact/',
    image: 'url("/luxury-campaign-cover.png") center / cover no-repeat',
    preview: '/luxury-campaign-cover.png',
  },
  {
    title: 'Digital Exhibition Identity',
    type: 'Experience / Identity',
    desc: '围绕沉浸式叙事构建空间视觉，让观众在流动光影中理解主题。',
    url: '#',
    image: 'linear-gradient(135deg, #D9F99D, #5EEAD4 48%, #C4B5FD)',
  },
  {
    title: 'Gaokao Fuel Station',
    type: 'App development',
    desc: '面向未来交互的概念界面，把信息结构、视觉节奏和科技感统一起来。',
    url: 'https://gaokaozhiyuan-292919-10-1464111003.sh.run.tcloudbase.com/',
    image: 'url("/future-interface-cover.png") center / cover no-repeat',
    preview: '/future-interface-cover.png',
  },
  {
    title: '华为云微认证',
    type: 'Certificate / AI skills',
    desc: '人工智能技能认证：华为云码道 CodeArts 实战速成。点击查看证书全貌。',
    url: '#',
    image: 'url("/huawei-certificate.png") center / cover no-repeat',
    certificate: '/huawei-certificate.png',
  },
  {
    title: 'XiaoLu',
    type: 'Personal Website',
    desc: '把天马行空的概念拆解成可以验证的视觉方案，再用 AI 快速实现。',
    url: '#',
    image: 'url("/janet-cover.png") center / cover no-repeat',
    preview: '/janet-cover.png',
  },
];

const strengths = [
  { icon: Palette, title: 'AI-assisted creation', text: '使用 AI 进行头脑风暴、学习编程和设计产品方案，帮助想法更快进入实现阶段。' },
  { icon: BrainCircuit, title: 'Product thinking', text: '从自己的真实经历和生活需求出发，发现问题，并尝试设计有用的解决方案。' },
  { icon: Layers3, title: 'Understated credibility', text: '赢得尊重，而非刻意博取人缘。' },
  { icon: Wand2, title: 'Lifelong learning and relentless self-improvement', text: '目前仍在学习人工智能和 Python，但愿意不断尝试，把不会的东西一步步变成会做的作品。' },
];

function App() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <main>
      <section className="hero" id="home">
        <video className="heroVideo" autoPlay muted loop playsInline poster="/poster.svg">
          <source src="/hero-bg-sci-fi-cont.mp4" type="video/mp4" />
        </video>
        <div className="motionBackdrop" aria-hidden="true" />

        <nav className="nav">
          <div />
          <div className="navLinks">
            <a href="#projects">[PORTFOLIO]</a>
            <a href="#strengths">[SERVICES]</a>
            <a href="#contact">[CONTACT]</a>
          </div>
          <a className="menuButton" href="#contact" aria-label="Contact">
            <Menu size={24} />
          </a>
        </nav>

        <div className="heroComposition">
          <div className="heroTitle">
            <h1 className="heroIndex" aria-label="Janet">Janet</h1>
            <p>Reshape every possibility with AI</p>
          </div>
        </div>
      </section>

      <About />

      <section className="section projectsOrbitSection" id="projects">
        <div className="sectionHeader"><p className="eyebrow">Selected Works</p><h2>作品集</h2></div>
        <div className="orbitScene">
          <div className="orbitGlow" aria-hidden="true" />
          <div className="orbitRing" aria-hidden="true" />
          <img className="orbitIp" src="/ip-cutout.png" alt="Janet digital IP" />
          <div className="projectOrbit">
            {projects.map((project, index) => (
              <button className="orbitCard" key={project.title} type="button" style={{ '--angle': `${(360 / projects.length) * index}deg`, '--thumb': project.image }} onClick={() => setActiveProject(project)}>
                <span className="orbitThumb" />
                <span className="orbitMeta"><small>{project.type}</small><strong>{project.title}</strong></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="strengths">
        <div className="sectionHeader"><p className="eyebrow">Capabilities</p><h2>个人优势</h2></div>
        <div className="strengthGrid">{strengths.map(({ icon: Icon, title, text }) => <article className="strengthCard" key={title}><Icon size={26} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="contactFinal" id="contact">
        <img className="contactIp" src="/ip-transparent.png" alt="Janet digital IP" />
        <div><p className="eyebrow">Let's Create</p><h2>一起把下一个想法，用 AI 做成现实。</h2><a className="largeContact" href="mailto:hello@janet.design"><Contact size={22} /> hello@janet.design</a></div>
        <Sparkles className="finalMark" size={96} />
      </section>

      {activeProject && (
        <div className="projectModal" role="dialog" aria-modal="true" onClick={() => setActiveProject(null)}>
          <div className="projectModalPanel" onClick={(event) => event.stopPropagation()}>
            <button className="modalClose" type="button" aria-label="Close" onClick={() => setActiveProject(null)}>×</button>
            {(activeProject.certificate || activeProject.preview) ? <img className="certificatePreview" src={activeProject.certificate || activeProject.preview} alt={activeProject.title} /> : <div className="modalPreview" style={{ background: activeProject.image }} />}
            <div className="modalCopy">
              <p className="eyebrow">{activeProject.type}</p>
              <h2>{activeProject.title}</h2>
              <p>{activeProject.desc}</p>
              <a href={activeProject.url} target="_blank" rel="noreferrer">查看作品 <ArrowUpRight size={18} /></a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
