import React, { useState } from 'react';

const tags = [
  ['AI 创意探索者', 'aboutTagViolet'],
  ['自带阳光的行动派', 'aboutTagEmerald'],
  ['🤹 多面体验官', 'aboutTagRose'],
];

const stats = [
  ['🎤', '爱唱歌 · KTV灵魂批发商', 'aboutStatMint'],
  ['💃', '爱跳舞 · BGM一响膝盖先开机', 'aboutStatLavender'],
  ['🏸', '爱羽毛球 · 网前小旋风 · 扣杀要狠', 'aboutStatPeach'],
];

export default function About() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const move = (event: React.MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientY - box.top) / box.height - 0.5) * -6, y: ((event.clientX - box.left) / box.width - 0.5) * 6 });
  };
  return <section className="aboutRedesign" id="about">
    <nav className="aboutNav"><div className="aboutNavLinks"><a href="#projects">[PORTFOLIO]</a><a href="#strengths">[SERVICES]</a><a href="#contact">[CONTACT]</a></div><button className="aboutMenuButton" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button></nav>
    {menuOpen && <div className="aboutMenu"><button onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button><a href="#about">ABOUT</a><a href="#projects">WORKS</a><a href="#contact">CONTACT</a><a href="#contact">RESUME</a></div>}
    <div className="aboutLayout"><div className="aboutCopyRedesign"><p className="aboutKicker">Hey, I'm Janet</p><h1>别划走·这只小鹿会发光</h1><p className="aboutIntro">哈喽我是战晓璐🦌，一只刚上岸人工智能专业的准大学生小鹿。别看专业挺「硬核」，本人比算法接地气多了——活泼开朗、平易近人，积极向上算出厂设置，属于一秒破冰、巨好相处型。课余三件套：唱歌、跳舞、打羽毛球，动静皆宜；新事物我是「实验型人格」🧪，啥都敢试，翻车也算体验。不混脸熟，只立招牌——认识我，你大概率不会后悔😎</p><div className="aboutTags">{tags.map(([label, cls]) => <span className={`aboutTag ${cls}`} key={label}>{label}</span>)}</div><div className="aboutStats">{stats.map(([value, label, cls]) => <article className={`aboutStat ${cls}`} key={label}><strong>{value}</strong><span>{label}</span></article>)}</div></div><div className="aboutVisual"><div className="aboutOrbWrap" onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })}><div className="aboutOrb" style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}><svg className="aboutNetwork" viewBox="0 0 440 440" aria-hidden="true"><path d="M38 175 128 94 216 132 314 62 405 158M56 303l94-68 90 56 112-70M128 94l22 141 66-103 24 159 74-229" /><g><circle cx="38" cy="175" r="3"/><circle cx="128" cy="94" r="3"/><circle cx="216" cy="132" r="3"/><circle cx="314" cy="62" r="3"/><circle cx="405" cy="158" r="3"/><circle cx="56" cy="303" r="3"/><circle cx="150" cy="235" r="3"/><circle cx="240" cy="291" r="3"/><circle cx="352" cy="221" r="3"/></g></svg><span className="aboutOrbGlow" /><img src="/ip-transparent.png" alt="Janet digital IP" /></div></div></div></div><div className="aboutWorksAnchor">SELECTED WORKS</div>
  </section>;
}
