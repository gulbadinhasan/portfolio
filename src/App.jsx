import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════
   THEME TOKENS
═══════════════════════════════════════════════════════════ */
const DARK = {
  mode:"dark", bg:"#04060f", bg2:"#070b18", bg3:"#0b1022",
  glass:"rgba(11,16,34,0.65)", cardBg:"rgba(11,16,34,0.65)", cardHov:"rgba(0,240,255,0.04)",
  text:"#dde4f0", muted:"#5a6a88",
  border:"rgba(0,240,255,0.1)", borderHov:"rgba(0,240,255,0.35)",
  cyan:"#00f0ff", green:"#00ffa3", orange:"#ff6b35", purple:"#a855f7",
  glow:"0 0 30px rgba(0,240,255,0.2)",
  navBg:"rgba(4,6,15,0.88)",
  pColor:"0,240,255",
};
const LIGHT = {
  mode:"light", bg:"#f0f4ff", bg2:"#e4eaf8", bg3:"#d8e2f5",
  glass:"rgba(240,244,255,0.78)", cardBg:"rgba(240,244,255,0.78)", cardHov:"rgba(0,100,200,0.05)",
  text:"#0d1424", muted:"#6678a0",
  border:"rgba(0,100,200,0.14)", borderHov:"rgba(0,100,200,0.45)",
  cyan:"#0055cc", green:"#007a4d", orange:"#c45000", purple:"#6d28d9",
  glow:"0 0 30px rgba(0,85,204,0.18)",
  navBg:"rgba(240,244,255,0.9)",
  pColor:"0,100,200",
};

const Ctx = createContext(DARK);
const useT = () => useContext(Ctx);

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
function GlobalStyle({ T }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=Share+Tech+Mono&display=swap');
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      html { scroll-behavior:smooth; }
      body {
        background:${T.bg}; color:${T.text};
        font-family:'DM Sans',sans-serif;
        overflow-x:hidden; cursor:none;
        transition:background .45s,color .45s;
      }
      ::selection { background:${T.cyan}22; color:${T.cyan}; }
      ::-webkit-scrollbar { width:3px; }
      ::-webkit-scrollbar-track { background:${T.bg}; }
      ::-webkit-scrollbar-thumb { background:${T.cyan}; border-radius:2px; }
      strong { color:${T.text}; font-weight:600; }

      @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
      @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes orbDrift { 0%{transform:translate(0,0) scale(1)} 40%{transform:translate(28px,-18px) scale(1.04)} 70%{transform:translate(-18px,28px) scale(.97)} 100%{transform:translate(0,0) scale(1)} }
      @keyframes gridFade { 0%,100%{opacity:.03} 50%{opacity:.065} }
      @keyframes scanSwep { from{top:-5%} to{top:105%} }
      @keyframes pulseRng { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(1.9);opacity:0} }
      @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes termIn   { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
      @keyframes lineIn   { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
      @keyframes barGrow  { from{width:0} to{width:100%} }

      .rv { opacity:0; transform:translateY(26px); transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1); }
      .rv.in { opacity:1; transform:none; }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════
   TERMINAL INTRO
═══════════════════════════════════════════════════════════ */
const BOOT = [
  { t:0,    text:"$ initialising gulbadin-hasan.dev ...",           color:null },
  { t:400,  text:"✔  loading profile                  [ OK ]",     color:"#00ffa3" },
  { t:720,  text:"✔  mounting AWS infrastructure layer [ OK ]",    color:"#00ffa3" },
  { t:1020, text:"✔  injecting 10+ yrs DevOps XP      [ OK ]",     color:"#00ffa3" },
  { t:1300, text:"✔  connecting $30K/month savings     [ OK ]",    color:"#00ffa3" },
  { t:1580, text:"✔  verifying 4 certifications        [ OK ]",    color:"#00ffa3" },
  { t:1840, text:"✔  locking in 99.7%+ uptime SLA     [ OK ]",     color:"#00ffa3" },
  { t:2100, text:"⚙   compiling portfolio assets ...",              color:"#00f0ff" },
  { t:2600, text:"✔  build complete  [ STATUS: READY ]",           color:"#00ffa3" },
  { t:2900, text:"",                                                color:null },
  { t:3000, text:"$ ./launch --mode=premium --theme=dark",         color:null },
];

function TerminalIntro({ onDone }) {
  const [lines, setLines]       = useState([]);
  const [progress, setProgress] = useState(false);
  const [exiting, setExiting]   = useState(false);

  useEffect(() => {
    BOOT.forEach((b, i) => {
      setTimeout(() => {
        setLines(p => [...p, b]);
        if (i === BOOT.length - 1) setProgress(true);
      }, b.t);
    });
  }, []);

  const skip = () => { setExiting(true); setTimeout(onDone, 650); };

  useEffect(() => {
    if (progress) { const id = setTimeout(skip, 900); return () => clearTimeout(id); }
  }, [progress]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:3000,
      background:"#04060f",
      display:"flex", alignItems:"center", justifyContent:"center",
      opacity: exiting ? 0 : 1,
      transition:"opacity .65s cubic-bezier(.22,1,.36,1)",
    }}>
      {/* grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,240,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,.04) 1px,transparent 1px)", backgroundSize:"60px 60px", maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)", animation:"gridFade 4s ease-in-out infinite" }} />
      {/* glow */}
      <div style={{ position:"absolute", width:560, height:560, background:"radial-gradient(circle,rgba(0,240,255,.07) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none", animation:"orbDrift 14s ease-in-out infinite" }} />

      {/* window */}
      <div style={{
        width:"min(700px,92vw)",
        background:"rgba(6,10,22,.97)",
        border:"1px solid rgba(0,240,255,.22)",
        borderRadius:10,
        overflow:"hidden",
        boxShadow:"0 0 80px rgba(0,240,255,.12), 0 40px 100px rgba(0,0,0,.7)",
        animation:"termIn .5s cubic-bezier(.22,1,.36,1)",
      }}>
        {/* title bar */}
        <div style={{ padding:"11px 20px", borderBottom:"1px solid rgba(0,240,255,.1)", background:"rgba(0,0,0,.35)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", gap:7 }}>
            {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(
              <div key={i} style={{ width:12, height:12, borderRadius:"50%", background:c }} />
            ))}
          </div>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:12, color:"rgba(0,240,255,.5)", letterSpacing:".1em", marginLeft:8 }}>
            alex@portfolio — zsh — 80×24
          </span>
        </div>

        {/* body */}
        <div style={{ padding:"28px 30px 32px", minHeight:340 }}>
          {/* ASCII */}
          <pre style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"clamp(6.5px,1.3vw,10.5px)", color:"rgba(0,240,255,.3)", lineHeight:1.2, marginBottom:26, letterSpacing:".05em", userSelect:"none" }}>{`
 ██████╗ ██╗   ██╗██╗     ██████╗  █████╗ ██████╗ ██╗███╗   ██╗
██╔════╝ ██║   ██║██║     ██╔══██╗██╔══██╗██╔══██╗██║████╗  ██║
██║  ███╗██║   ██║██║     ██████╔╝███████║██║  ██║██║██╔██╗ ██║
██║   ██║██║   ██║██║     ██╔══██╗██╔══██║██║  ██║██║██║╚██╗██║
╚██████╔╝╚██████╔╝███████╗██████╔╝██║  ██║██████╔╝██║██║ ╚████║
 ╚═════╝  ╚═════╝ ╚══════╝╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝

██╗  ██╗ █████╗ ███████╗ █████╗ ███╗   ██╗
██║  ██║██╔══██╗██╔════╝██╔══██╗████╗  ██║
███████║███████║███████╗███████║██╔██╗ ██║
██╔══██║██╔══██║╚════██║██╔══██║██║╚██╗██║
██║  ██║██║  ██║███████║██║  ██║██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
`}</pre>

          {/* lines */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {lines.map((l, i) => (
              <div key={i} style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13, color:l.color||"rgba(0,240,255,.72)", letterSpacing:".04em", lineHeight:1.5, animation:"lineIn .28s ease" }}>
                {l.text}
              </div>
            ))}
            {!progress && (
              <span style={{ display:"inline-block", width:8, height:15, background:"#00f0ff", animation:"blink .9s step-end infinite", verticalAlign:"middle", marginTop:4 }} />
            )}
          </div>

          {/* progress bar */}
          {progress && (
            <div style={{ marginTop:22 }}>
              <div style={{ width:"100%", height:2, background:"rgba(0,240,255,.1)", borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", background:"linear-gradient(90deg,#00f0ff,#a855f7)", animation:"barGrow .7s ease forwards" }} />
              </div>
              <div style={{ marginTop:12, fontFamily:"'Share Tech Mono',monospace", fontSize:12, color:"#00ffa3", textAlign:"center", letterSpacing:".15em" }}>
                LAUNCHING PORTFOLIO...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* skip */}
      <button onClick={skip} style={{
        position:"absolute", bottom:32, right:40,
        fontFamily:"'Share Tech Mono',monospace", fontSize:11,
        color:"rgba(0,240,255,.4)", background:"transparent",
        border:"1px solid rgba(0,240,255,.15)", padding:"8px 20px",
        cursor:"none", letterSpacing:".12em", textTransform:"uppercase",
        transition:"all .2s",
      }}
        onMouseEnter={e=>{e.target.style.color="#00f0ff";e.target.style.borderColor="rgba(0,240,255,.4)";}}
        onMouseLeave={e=>{e.target.style.color="rgba(0,240,255,.4)";e.target.style.borderColor="rgba(0,240,255,.15)";}}
      >Skip →</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════════════════ */
function ThemeToggle({ isDark, onToggle }) {
  const T = useT();
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onToggle}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      title={`Switch to ${isDark?"light":"dark"} mode`}
      style={{
        width:48, height:26, position:"relative",
        background: hov ? `${T.cyan}20` : "transparent",
        border:`1px solid ${hov?T.cyan:T.border}`,
        borderRadius:13, cursor:"none",
        transition:"all .3s",
        boxShadow: hov ? T.glow : "none",
        flexShrink:0,
      }}
    >
      <span style={{ position:"absolute", left:7, top:"50%", transform:"translateY(-50%)", fontSize:10, opacity:isDark?1:.3, transition:"opacity .3s", userSelect:"none" }}>🌙</span>
      <span style={{ position:"absolute", right:6,  top:"50%", transform:"translateY(-50%)", fontSize:10, opacity:isDark?.3:1, transition:"opacity .3s", userSelect:"none" }}>☀️</span>
      <div style={{
        position:"absolute", top:"50%",
        width:18, height:18, borderRadius:"50%",
        background:`linear-gradient(135deg,${T.cyan},${T.purple})`,
        boxShadow:`0 0 8px ${T.cyan}60`,
        transform: isDark ? "translate(4px,-50%)" : "translate(22px,-50%)",
        transition:"transform .35s cubic-bezier(.22,1,.36,1)",
      }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════ */
function Cursor() {
  const T = useT();
  const dot  = useRef(null);
  const ring = useRef(null);
  const m    = useRef({x:0,y:0});
  const r    = useRef({x:0,y:0});
  const hov  = useRef(false);

  useEffect(() => {
    const mv = e => { m.current={x:e.clientX,y:e.clientY}; };
    const ov = e => { hov.current=!!e.target.closest("a,button,[data-hover]"); };
    document.addEventListener("mousemove",mv);
    document.addEventListener("mouseover",ov);
    let raf;
    const loop = () => {
      r.current.x += (m.current.x-r.current.x)*.1;
      r.current.y += (m.current.y-r.current.y)*.1;
      if(dot.current){
        dot.current.style.left=m.current.x+"px"; dot.current.style.top=m.current.y+"px";
        dot.current.style.transform=hov.current?"translate(-50%,-50%) scale(2.4)":"translate(-50%,-50%) scale(1)";
        dot.current.style.background=hov.current?T.green:T.cyan;
        dot.current.style.boxShadow=`0 0 10px ${hov.current?T.green:T.cyan}`;
      }
      if(ring.current){
        ring.current.style.left=r.current.x+"px"; ring.current.style.top=r.current.y+"px";
        ring.current.style.borderColor=`${T.cyan}55`;
        ring.current.style.transform=hov.current?"translate(-50%,-50%) scale(1.5)":"translate(-50%,-50%) scale(1)";
      }
      raf=requestAnimationFrame(loop);
    };
    loop();
    return ()=>{ cancelAnimationFrame(raf); document.removeEventListener("mousemove",mv); document.removeEventListener("mouseover",ov); };
  },[T]);

  return (
    <>
      <div ref={dot}  style={{ position:"fixed",width:8,height:8,borderRadius:"50%",background:T.cyan,pointerEvents:"none",zIndex:9999,transition:"transform .15s,background .2s,box-shadow .2s" }} />
      <div ref={ring} style={{ position:"fixed",width:32,height:32,borderRadius:"50%",border:`1px solid ${T.cyan}55`,pointerEvents:"none",zIndex:9998,transition:"transform .2s,border-color .3s" }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PARTICLE FIELD
═══════════════════════════════════════════════════════════ */
function ParticleField() {
  const T    = useT();
  const cvs  = useRef(null);
  const colR = useRef(T.pColor);
  useEffect(()=>{ colR.current=T.pColor; },[T.pColor]);

  useEffect(()=>{
    const c=cvs.current, ctx=c.getContext("2d");
    let W=c.width=window.innerWidth, H=c.height=window.innerHeight;
    const rsz=()=>{ W=c.width=window.innerWidth; H=c.height=window.innerHeight; };
    window.addEventListener("resize",rsz);
    const pts=Array.from({length:55},()=>({ x:Math.random()*W,y:Math.random()*H, vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22, r:Math.random()*1.4+.3,a:Math.random()*.3+.07 }));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      const col=colR.current;
      pts.forEach((p,i)=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${col},${p.a})`; ctx.fill();
        pts.slice(i+1).forEach(q=>{ const d=Math.hypot(p.x-q.x,p.y-q.y); if(d<115){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.strokeStyle=`rgba(${col},${.048*(1-d/115)})`; ctx.lineWidth=.5; ctx.stroke(); } });
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",rsz); };
  },[]);

  return <canvas ref={cvs} style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0 }} />;
}

/* ═══════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════ */
function useReveal(delay=0){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){ setTimeout(()=>el.classList.add("in"),delay); obs.unobserve(el); } },{threshold:.14});
    obs.observe(el); return ()=>obs.disconnect();
  },[delay]);
  return ref;
}

function Counter({ target, dec=0, dur=1800 }){
  const [v,setV]=useState(0); const [done,setDone]=useState(false); const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting&&!done){ setDone(true);
        const s=performance.now();
        const tick=n=>{ const p=Math.min((n-s)/dur,1); setV(parseFloat((target*(1-Math.pow(1-p,3))).toFixed(dec))); if(p<1)requestAnimationFrame(tick); };
        requestAnimationFrame(tick); obs.unobserve(el);
      }
    },{threshold:.4});
    obs.observe(el); return ()=>obs.disconnect();
  },[target,dec,dur,done]);
  return <span ref={ref}>{v.toFixed(dec)}</span>;
}

function Card({ children, style={}, className="" }){
  const T=useT(); const [h,setH]=useState(false);
  return (
    <div className={className}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:h?T.cardHov:T.cardBg, border:`1px solid ${h?T.borderHov:T.border}`, backdropFilter:"blur(20px)", borderRadius:2, transform:h?"translateY(-3px)":"none", boxShadow:h?T.glow:"none", transition:"all .3s cubic-bezier(.22,1,.36,1)", ...style }}
    >{children}</div>
  );
}

function SecHead({ num, title }){
  const T=useT(); const ref=useReveal();
  return (
    <div ref={ref} className="rv" style={{ display:"flex",alignItems:"center",gap:20,marginBottom:56 }}>
      <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:T.cyan,letterSpacing:".2em" }}>{num}</span>
      <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:800,letterSpacing:"-.02em",color:T.text,whiteSpace:"nowrap" }}>{title}</h2>
      <div style={{ flex:1,height:1,background:`linear-gradient(90deg,${T.border},transparent)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
const NAVS = ["Impact","Skills","Experience","Projects","Certifications","Contact"];

function Nav({ active, isDark, onToggle }){
  const T=useT(); const [sc,setSc]=useState(false);
  useEffect(()=>{ const fn=()=>setSc(window.scrollY>40); window.addEventListener("scroll",fn); return ()=>window.removeEventListener("scroll",fn); },[]);
  return (
    <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:500,padding:"0 60px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between", background:sc?T.navBg:"transparent", backdropFilter:sc?"blur(24px)":"none", borderBottom:sc?`1px solid ${T.border}`:"none", transition:"all .4s" }}>
      <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:13,color:T.cyan,letterSpacing:".1em" }}>
        <span style={{ color:T.muted }}>~/</span>gulbadin-hasan
      </div>
      <ul style={{ display:"flex",gap:32,listStyle:"none" }}>
        {NAVS.map(l=>(
          <li key={l}><a href={`#${l.toLowerCase()}`} style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11, color:active===l.toLowerCase()?T.cyan:T.muted, textDecoration:"none",letterSpacing:".12em",textTransform:"uppercase",transition:"color .2s", borderBottom:active===l.toLowerCase()?`1px solid ${T.cyan}`:"1px solid transparent",paddingBottom:2 }}>{l}</a></li>
        ))}
      </ul>
      <div style={{ display:"flex",alignItems:"center",gap:14 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:T.green }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:T.green,boxShadow:`0 0 8px ${T.green}`,animation:"pulseRng 2s ease-out infinite" }} />
          Available
        </div>
        <ThemeToggle isDark={isDark} onToggle={onToggle} />
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════ */
function Hero(){
  const T=useT();
  const [typed,setTyped]=useState("");
  const full="AWS Platform & Kubernetes Infrastructure Expert";
  useEffect(()=>{ let i=0; const id=setInterval(()=>{ setTyped(full.slice(0,++i)); if(i>=full.length)clearInterval(id); },40); return ()=>clearInterval(id); },[]);

  const gridC=T.mode==="dark"?"rgba(0,240,255,.04)":"rgba(0,100,200,.05)";

  return (
    <section id="hero" style={{ minHeight:"100vh",display:"flex",alignItems:"center",padding:"120px 60px 80px",position:"relative",overflow:"hidden" }}>
      {/* grid */}
      <div style={{ position:"absolute",inset:0,zIndex:1, backgroundImage:`linear-gradient(${gridC} 1px,transparent 1px),linear-gradient(90deg,${gridC} 1px,transparent 1px)`, backgroundSize:"60px 60px", maskImage:"radial-gradient(ellipse 70% 70% at 50% 50%,black,transparent)", animation:"gridFade 4s ease-in-out infinite" }} />
      {/* orbs */}
      {[{w:500,t:"10%",l:"55%",c:T.mode==="dark"?"rgba(0,240,255,.06)":"rgba(0,100,200,.06)",d:"20s"},
        {w:300,t:"62%",l:"72%",c:T.mode==="dark"?"rgba(168,85,247,.05)":"rgba(109,40,217,.05)",d:"28s"},
        {w:200,t:"32%",l:"28%",c:T.mode==="dark"?"rgba(0,255,163,.04)":"rgba(0,122,77,.04)",d:"15s"},
      ].map((o,i)=>(
        <div key={i} style={{ position:"absolute",width:o.w,height:o.w,top:o.t,left:o.l,transform:"translate(-50%,-50%)", background:`radial-gradient(circle,${o.c} 0%,transparent 70%)`, borderRadius:"50%",pointerEvents:"none",zIndex:1,animation:`orbDrift ${o.d} ease-in-out infinite` }} />
      ))}

      <div style={{ position:"relative",zIndex:2,maxWidth:900 }}>
        {/* tag */}
        <div style={{ display:"flex",alignItems:"center",gap:14,fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:T.cyan,letterSpacing:".2em",textTransform:"uppercase",marginBottom:28,opacity:0,animation:"fadeUp .6s .1s forwards" }}>
          <div style={{ width:40,height:1,background:T.cyan }} /> Lead DevOps Engineer
          <div style={{ padding:"3px 10px",border:`1px solid ${T.green}50`,color:T.green,fontSize:10,letterSpacing:".15em" }}>AVAILABLE</div>
        </div>
        {/* name */}
        <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(64px,10vw,120px)",fontWeight:800,lineHeight:.92,letterSpacing:"-.03em",marginBottom:20,color:T.text,opacity:0,animation:"fadeUp .8s .3s forwards" }}>
          Gulbadin<br />
          <span style={{ background:`linear-gradient(135deg,${T.cyan},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>Hasan.</span>
        </h1>
        {/* typewriter */}
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:"clamp(14px,2vw,18px)",color:T.muted,marginBottom:32,height:28,opacity:0,animation:"fadeUp .7s .55s forwards" }}>
          <span style={{ color:T.cyan }}>&gt; </span>{typed}<span style={{ animation:"blink 1s step-end infinite",color:T.cyan }}>_</span>
        </div>
        {/* desc */}
        <p style={{ fontSize:16,color:T.muted,lineHeight:1.9,maxWidth:520,marginBottom:52,fontWeight:300,opacity:0,animation:"fadeUp .7s .75s forwards" }}>
          Building scalable AWS platforms, Kubernetes systems, and CI/CD pipelines. Proven ability to improve reliability, reduce costs, and automate infrastructure at scale — since 2014.
        </p>
        {/* ctas */}
        <div style={{ display:"flex",gap:16,flexWrap:"wrap",opacity:0,animation:"fadeUp .7s .95s forwards" }}>
          <HBtn href="#impact" primary>View My Impact</HBtn>
          <HBtn href="#contact">Get in Touch</HBtn>
        </div>
      </div>

      {/* stats */}
      <div style={{ position:"absolute",right:60,top:"50%",transform:"translateY(-50%)",display:"flex",flexDirection:"column",gap:32,zIndex:2,opacity:0,animation:"fadeUp .9s 1.1s forwards" }}>
        {[{n:"10+",l:"Years Exp"},{n:"99.7%+",l:"Uptime SLA"},{n:"4",l:"Certs"}].map(s=>(
          <div key={s.l} style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontSize:44,fontWeight:800,color:T.cyan,lineHeight:1,textShadow:`0 0 30px ${T.cyan}55` }}>{s.n}</div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:T.muted,letterSpacing:".15em",textTransform:"uppercase",marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* scroll hint */}
      <div style={{ position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,zIndex:2,animation:"floatY 3s ease-in-out infinite" }}>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:T.muted,letterSpacing:".15em" }}>SCROLL</div>
        <div style={{ width:1,height:40,background:`linear-gradient(${T.cyan},transparent)` }} />
      </div>
    </section>
  );
}

function HBtn({ href, primary, children }){
  const T=useT(); const [h,setH]=useState(false);
  return (
    <a href={href} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ padding:"14px 36px", background:primary?(h?T.cyan:"transparent"):"transparent", border:`1px solid ${primary?T.cyan:T.border}`, color:primary?(h?T.bg:T.cyan):(h?T.text:T.muted), fontFamily:"'Share Tech Mono',monospace",fontSize:12,letterSpacing:".1em",textTransform:"uppercase",textDecoration:"none",cursor:"none", transition:"all .3s cubic-bezier(.22,1,.36,1)", boxShadow:primary&&h?T.glow:"none" }}
    >{children}</a>
  );
}

/* ═══════════════════════════════════════════════════════════
   IMPACT
═══════════════════════════════════════════════════════════ */
const KPIS=[
  {target:30, suf:"K",label:"Monthly Cloud Savings",  ctx:"DB & infra optimisation",  col:"green"},
  {target:40, suf:"%",label:"MTTR Reduction",         ctx:"OpenTelemetry observability",col:"cyan"},
  {target:99.7,suf:"%",dec:1,label:"Platform Uptime", ctx:"maintained consistently",  col:"orange"},
  {target:400,suf:"%",label:"Faster Deployments",     ctx:"ArgoCD self-service portal",col:"purple"},
  {target:33, suf:"%",label:"Change Failure Reduction",ctx:"ArgoCD GitOps workflow",  col:"cyan"},
  {target:6,  suf:"+",label:"Major EKS Upgrades",     ctx:"1.23 → 1.29 zero downtime",col:"green"},
  {target:0,  suf:"",label:"Downtime on K8s Upgrades",ctx:"blue-green & canary",       col:"orange"},
  {target:10, suf:"+",label:"Years Experience",       ctx:"across cloud & DevOps",     col:"purple"},
];
const PILLARS=[
  {icon:"💸",cat:"Cost & Efficiency",   title:"Financial Impact",     col:"green",  items:[
    <><strong>Saved $30K/month</strong> through infrastructure and database optimisation at Arkose Labs.</>,
    <>Led <strong>EKS cluster upgrades 1.23 → 1.29</strong> with zero downtime using rolling upgrade strategies.</>,
    <>Designed and provisioned <strong>reusable Terraform modules</strong> across environments reducing setup overhead significantly.</>,
  ]},
  {icon:"🚀",cat:"Velocity & Delivery",  title:"Developer Productivity",col:"cyan",   items:[
    <>Implemented <strong>self-service portal for developers</strong> using ArgoCD WebUI — reduced deployment time by 400% and change failure rate by 33%.</>,
    <>Built <strong>reusable GitHub Actions workflows</strong> accelerating CI/CD efficiency across release cycles.</>,
    <>Modernised legacy deployment workflows with <strong>event-driven architecture</strong> using Lambda, SQS/SNS, and EventBridge.</>,
  ]},
  {icon:"🛡️",cat:"Reliability & Resilience",title:"Platform Stability",  col:"orange", items:[
    <>Maintained <strong>99.7%+ platform uptime</strong> with AZ-aware routing and high-availability architecture.</>,
    <>Reduced <strong>MTTR by 40%</strong> via OpenTelemetry-based observability and improved incident response workflows.</>,
    <>Designed and secured <strong>PCIDSS-compliant infrastructure from 0 to 1</strong> — zero critical findings.</>,
  ]},
  {icon:"🔐",cat:"Security & Compliance", title:"Security Leadership",   col:"purple", items:[
    <>Eliminated long-lived credentials by <strong>migrating IAM users to role-based access via Terraform</strong>.</>,
    <>Strengthened security posture with <strong>Vault-based secrets management</strong> and robust IAM policies.</>,
    <>Achieved <strong>zero-downtime Kubernetes upgrades</strong> across all environments via blue-green & canary deployment strategies.</>,
  ]},
];

function Impact(){
  const T=useT();
  return (
    <section id="impact" style={{ padding:"100px 60px",background:T.bg2,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"80%",height:1,background:`linear-gradient(90deg,transparent,${T.cyan},transparent)`,opacity:.3 }} />
      <SecHead num="01." title="Key Impact" />
      <p style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:13,color:T.muted,maxWidth:600,lineHeight:1.8,borderLeft:`2px solid ${T.cyan}`,paddingLeft:20,marginBottom:72 }}>
        Beyond shipping features — measurable business value delivered across organisations. Every number has a story.
      </p>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:2,marginBottom:72 }}>
        {KPIS.map((k,i)=><KpiCard key={i} {...k} delay={i*60} />)}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:20 }}>
        {PILLARS.map((p,i)=><PillarCard key={i} {...p} delay={i*80} />)}
      </div>
    </section>
  );
}

function KpiCard({ target,suf,dec=0,label,ctx,col,delay }){
  const T=useT(); const color=T[col]; const ref=useReveal(delay);
  return (
    <div ref={ref} className="rv">
      <Card style={{ padding:"32px 24px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${color},transparent)`,opacity:.5 }} />
        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(36px,4vw,52px)",fontWeight:800,color,lineHeight:1,marginBottom:10,textShadow:`0 0 28px ${color}40` }}>
          <Counter target={target} dec={dec} />{suf}
        </div>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:T.muted,letterSpacing:".15em",textTransform:"uppercase",lineHeight:1.6 }}>{label}</div>
        <div style={{ fontSize:11,color:T.muted,opacity:.6,marginTop:6,fontFamily:"'Share Tech Mono',monospace" }}>{ctx}</div>
      </Card>
    </div>
  );
}

function PillarCard({ icon,cat,title,col,items,delay }){
  const T=useT(); const color=T[col]; const ref=useReveal(delay);
  return (
    <div ref={ref} className="rv">
      <Card style={{ padding:32,height:"100%",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color},transparent)`,opacity:.6 }} />
        <div style={{ display:"flex",alignItems:"flex-start",gap:16,marginBottom:24 }}>
          <div style={{ width:48,height:48,flexShrink:0,fontSize:22,background:`${color}14`,border:`1px solid ${color}30`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}>{icon}</div>
          <div>
            <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color,letterSpacing:".15em",textTransform:"uppercase",marginBottom:4 }}>{cat}</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,color:T.text }}>{title}</div>
          </div>
        </div>
        <ul style={{ listStyle:"none",display:"flex",flexDirection:"column",gap:14 }}>
          {items.map((item,i)=>(
            <li key={i} style={{ display:"flex",gap:12,fontSize:13,color:T.muted,lineHeight:1.7 }}>
              <span style={{ color,flexShrink:0,marginTop:2,fontSize:11 }}>▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKILLS
═══════════════════════════════════════════════════════════ */
const SCATS=[
  {icon:"☁️",title:"Cloud — AWS",               tags:["EKS","ECS","EC2","VPC","S3","IAM","Lambda","DynamoDB","RDS","EMR","CloudFront","KMS","Security Hub","Systems Manager"]},
  {icon:"⚙️",title:"Container & Orchestration", tags:["Kubernetes","Docker","Helm","ArgoCD"]},
  {icon:"🔧",title:"IaC & Automation",          tags:["Terraform","GitHub Actions","Jenkins","Bash","Python","YAML","CloudFormation"]},
  {icon:"🚀",title:"CI/CD & GitOps",            tags:["GitHub Actions","Jenkins","ArgoCD","GitOps","Blue-Green","Canary"]},
  {icon:"📊",title:"Observability",             tags:["Splunk","New Relic","Prometheus","Grafana","OpenTelemetry","CloudWatch","CloudTrail"]},
  {icon:"🤖",title:"AI & LLM Tooling",          tags:["LangChain","Ollama","Claude","ChatGPT","Gemini","RAG","Vector DBs","Embeddings","Transformers"]},
];

function Skills(){
  const T=useT();
  return (
    <section id="skills" style={{ padding:"100px 60px",background:T.bg }}>
      <SecHead num="02." title="Technical Arsenal" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:2 }}>
        {SCATS.map((c,i)=><SkillCard key={i} {...c} delay={i*70} />)}
      </div>
    </section>
  );
}

function SkillCard({ icon,title,tags,delay }){
  const T=useT(); const ref=useReveal(delay); const [ht,setHt]=useState(null);
  return (
    <div ref={ref} className="rv">
      <Card style={{ padding:32,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,${T.cyan},transparent)`,opacity:.3 }} />
        <div style={{ fontSize:28,marginBottom:14 }}>{icon}</div>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:T.cyan,letterSpacing:".12em",textTransform:"uppercase",marginBottom:20 }}>{title}</div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
          {tags.map(t=>(
            <span key={t} onMouseEnter={()=>setHt(t)} onMouseLeave={()=>setHt(null)}
              style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,padding:"5px 12px", border:`1px solid ${ht===t?T.cyan:T.border}`, color:ht===t?T.cyan:T.muted, background:ht===t?`${T.cyan}10`:"transparent", letterSpacing:".06em",transition:"all .2s",cursor:"none" }}
            >{t}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE
═══════════════════════════════════════════════════════════ */
const JOBS=[
  {period:"Oct 2024 — Mar 2025",role:"Lead DevOps Engineer",       company:"9Yards Technology",    loc:"Remote",
   desc:"Modernised legacy deployment workflows by designing AWS-based microservices and serverless architecture. Implemented OpenTelemetry-based observability reducing MTTR by 40%. Strengthened cloud security by migrating IAM users to role-based access via Terraform, eliminating long-lived credentials.",
   tags:["AWS","Lambda","API Gateway","SQS/SNS","EventBridge","OpenTelemetry","GitHub Actions","Terraform"]},
  {period:"Apr 2023 — Jun 2024",role:"Senior Cloud Infrastructure Engineer",company:"Arkose Labs",loc:"Pune",
   desc:"Reduced infrastructure cost by $30K/month through database optimisation and architecture improvements. Led Kubernetes cluster upgrades (EKS 1.23 → 1.29) with zero downtime using rolling strategies. Built CI/CD pipelines with GitHub Actions and ArgoCD, implemented AZ-aware routing achieving 99.9%+ uptime.",
   tags:["AWS EKS","GitHub Actions","ArgoCD","Terraform","Kubernetes","High Availability"]},
  {period:"Dec 2020 — Apr 2023",role:"Technical Lead",             company:"Incedo Inc",           loc:"Pune",
   desc:"Managed Kubernetes infrastructure and optimised deployment pipelines. Implemented Vault-based secrets management and IAM policies. Performed AWS cloud optimisation & security assessments with Amazon Trusted Advisor and Amazon Inspector. Introduced automation and structured on-call practices.",
   tags:["Kubernetes","Jenkins","Terraform","Vault","IAM","AWS Inspector"]},
  {period:"May 2019 — Dec 2020",role:"Data Engineer",              company:"Cratas Techno Solution",loc:"Pune",
   desc:"Built organisation's AWS infrastructure from scratch — VPC, EC2, S3, IAM, and networking layers. Implemented PCIDSS compliance controls and OS hardening. Automated infrastructure provisioning using Terraform and CloudFormation. Configured CloudWatch monitoring, logging, and alerting.",
   tags:["AWS","Terraform","CloudFormation","Jenkins","PCIDSS","CloudWatch"]},
  {period:"Jul 2016 — May 2019",role:"Senior Systems Engineer",    company:"Astron Systems",        loc:"Nagpur",
   desc:"Designed and managed Hadoop clusters (CDH/HDP) on AWS and bare metal ensuring high availability. Implemented Kerberos authentication and Active Directory integration. Automated cluster health checks, reducing manual intervention through shell scripting.",
   tags:["Hadoop","AWS","CDH/HDP","Kerberos","Active Directory","Shell Scripting"]},
  {period:"Jan 2014 — Jul 2016",role:"Senior Systems Engineer",    company:"Cognizant",             loc:"Pune",
   desc:"Managed production support for 50+ enterprise applications ensuring SLA adherence. Led migration of legacy systems (Windows 2003 → 2008). Collaborated with cross-functional teams following ITIL practices for incident, problem, and change management.",
   tags:["Production Support","ITIL","IIS","Windows Migration","SLA Management"]},
];

function Experience(){
  const T=useT();
  return (
    <section id="experience" style={{ padding:"100px 60px",background:T.bg2 }}>
      <SecHead num="03." title="Experience" />
      <div style={{ position:"relative",paddingLeft:48 }}>
        <div style={{ position:"absolute",left:0,top:0,bottom:0,width:1,background:`linear-gradient(to bottom,${T.cyan},transparent)` }} />
        {JOBS.map((j,i)=><JobCard key={i} {...j} delay={i*100} />)}
      </div>
    </section>
  );
}

function JobCard({ period,role,company,loc,desc,tags,delay }){
  const T=useT(); const ref=useReveal(delay);
  return (
    <div ref={ref} className="rv" style={{ position:"relative",paddingBottom:52 }}>
      <div style={{ position:"absolute",left:-52,top:6,width:10,height:10,borderRadius:"50%",background:T.cyan,boxShadow:`0 0 16px ${T.cyan}` }}>
        <div style={{ position:"absolute",inset:-5,borderRadius:"50%",border:`1px solid ${T.cyan}30`,animation:"pulseRng 3s ease-out infinite" }} />
      </div>
      <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:T.cyan,letterSpacing:".15em",marginBottom:10 }}>{period}</div>
      <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,marginBottom:6,color:T.text }}>{role}</div>
      <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:T.muted,marginBottom:16 }}>
        {company} <span style={{ color:T.orange }}>// {loc}</span>
      </div>
      <p style={{ fontSize:14,color:T.muted,lineHeight:1.8,maxWidth:640,marginBottom:16 }}>{desc}</p>
      <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
        {tags.map(t=><span key={t} style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,padding:"4px 10px",background:`${T.cyan}0e`,border:`1px solid ${T.cyan}22`,color:T.cyan,letterSpacing:".1em" }}>{t}</span>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════════════════ */
const PROJS=[
  {num:"01",title:"EKS Zero-Downtime Upgrade Pipeline", metric:"1.23 → 1.29 · Zero downtime",col:"cyan",
   desc:"Designed and executed Kubernetes cluster upgrades across 6 major versions at Arkose Labs using blue-green and canary deployment strategies. Eliminated upgrade-related downtime entirely across all environments.",
   stack:["AWS EKS","Kubernetes","Helm","ArgoCD","Terraform"]},
  {num:"02",title:"Developer Self-Service Portal",      metric:"↑ 400% faster deployments · ↓ 33% failure rate",col:"green",
   desc:"Implemented a self-service deployment portal using ArgoCD WebUI enabling developers to manage their own releases. Dramatically reduced deployment time and change failure rate across engineering teams.",
   stack:["ArgoCD","GitOps","Kubernetes","GitHub Actions","AWS"]},
  {num:"03",title:"PCIDSS Compliant Cloud Platform",   metric:"0 → 1 · Zero critical findings",col:"purple",
   desc:"Designed, architected, and secured a fully PCIDSS-compliant cloud infrastructure from scratch. Implemented OS hardening, IAM policies, KMS encryption, and Security Hub across the entire platform.",
   stack:["AWS","KMS","Security Hub","IAM","Terraform","CloudWatch"]},
  {num:"04",title:"OpenTelemetry Observability Stack", metric:"↓ 40% MTTR · 99.7%+ uptime",col:"orange",
   desc:"Implemented end-to-end OpenTelemetry-based observability at 9Yards Technology improving incident response and reducing MTTR by 40%. Integrated Splunk, New Relic, Prometheus and Grafana into a unified observability platform.",
   stack:["OpenTelemetry","Splunk","New Relic","Prometheus","Grafana","CloudWatch"]},
];

function Projects(){
  const T=useT();
  return (
    <section id="projects" style={{ padding:"100px 60px",background:T.bg }}>
      <SecHead num="04." title="Key Projects" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:20 }}>
        {PROJS.map((p,i)=><ProjectCard key={i} {...p} delay={i*80} />)}
      </div>
    </section>
  );
}

function ProjectCard({ num,title,desc,metric,stack,col,delay }){
  const T=useT(); const color=T[col]; const ref=useReveal(delay); const [h,setH]=useState(false);
  return (
    <div ref={ref} className="rv">
      <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{ padding:32,height:"100%",position:"relative",overflow:"hidden", background:h?T.cardHov:T.cardBg, border:`1px solid ${h?color+"55":T.border}`, backdropFilter:"blur(20px)",borderRadius:2, transform:h?"translateY(-5px)":"none", boxShadow:h?`0 0 40px ${color}18`:"none", transition:"all .35s cubic-bezier(.22,1,.36,1)" }}
      >
        <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color},transparent)`, transform:h?"scaleX(1)":"scaleX(.3)",transformOrigin:"left",transition:"transform .4s" }} />
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:T.muted,letterSpacing:".15em",marginBottom:14 }}>// PROJECT_{num}</div>
        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,marginBottom:12,color:h?color:T.text,transition:"color .2s" }}>{title}</div>
        <p style={{ fontSize:13,color:T.muted,lineHeight:1.75,marginBottom:16 }}>{desc}</p>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:T.green,padding:"5px 12px",background:`${T.green}0e`,border:`1px solid ${T.green}30`,display:"inline-block",marginBottom:20 }}>{metric}</div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
          {stack.map(t=><span key={t} style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,padding:"4px 10px",border:`1px solid ${T.border}`,color:T.muted }}>{t}</span>)}
        </div>
        <div style={{ marginTop:24,paddingTop:20,borderTop:`1px solid ${T.border}`,display:"flex",gap:16 }}>
          <a href="https://github.com/gulbadinhasan" target="_blank" rel="noopener"
            style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:h?color:T.muted,textDecoration:"none",letterSpacing:".1em",textTransform:"uppercase",transition:"color .2s" }}
          >↗ GitHub</a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CERTIFICATIONS
═══════════════════════════════════════════════════════════ */
const AWS_LOGO = (
  <svg viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:52,height:32}}>
    <path d="M22.9 19.7c0 .8.1 1.4.2 1.8.2.4.4.9.8 1.4.1.2.2.4.2.5 0 .2-.1.4-.4.6l-1.4 1c-.2.1-.4.2-.5.2-.2 0-.4-.1-.6-.3-.3-.3-.5-.6-.7-1-.2-.4-.4-.8-.6-1.3-1.5 1.8-3.4 2.7-5.7 2.7-1.6 0-2.9-.5-3.8-1.4-.9-.9-1.4-2.1-1.4-3.6 0-1.6.6-2.9 1.7-3.8 1.1-.9 2.6-1.4 4.5-1.4.6 0 1.3.1 2 .2.7.1 1.4.3 2.2.5v-1.4c0-1.4-.3-2.4-.9-3-.6-.5-1.6-.8-3.1-.8-.7 0-1.3.1-2 .2-.7.2-1.3.4-1.9.7-.3.1-.5.2-.6.2-.1 0-.2 0-.3-.1-.1-.1-.1-.2-.1-.4v-1.1c0-.2 0-.4.1-.5.1-.1.3-.2.5-.3.7-.4 1.5-.6 2.4-.8.9-.2 1.9-.3 2.9-.3 2.2 0 3.8.5 4.9 1.5 1 1 1.6 2.5 1.6 4.5v5.9zm-7.9 3c.6 0 1.2-.1 1.9-.3.7-.2 1.3-.6 1.8-1.1.3-.4.5-.8.6-1.2.1-.4.2-1 .2-1.6v-.8c-.6-.1-1.1-.2-1.7-.3-.6-.1-1.1-.1-1.7-.1-1.2 0-2.1.2-2.7.7-.6.5-.9 1.2-.9 2 0 .8.2 1.4.6 1.8.4.5 1 .7 1.9.9zm14.5 1.9c-.2 0-.4 0-.5-.1-.1-.1-.2-.3-.3-.6L25 11.5c-.1-.3-.1-.5-.1-.6 0-.2.1-.4.4-.4h1.8c.2 0 .4 0 .5.1.1.1.2.3.3.6l3.4 13.3 3.1-13.3c.1-.3.2-.5.3-.6.1-.1.3-.1.5-.1h1.4c.2 0 .4 0 .5.1.1.1.2.3.3.6l3.2 13.5 3.5-13.5c.1-.3.2-.5.3-.6.1-.1.3-.1.5-.1H46c.2 0 .4.1.4.4 0 .1 0 .2-.1.4l-4.5 13.4c-.1.3-.2.5-.3.6-.1.1-.3.1-.5.1h-1.5c-.2 0-.4 0-.5-.1-.1-.1-.2-.3-.3-.6l-3.1-13-3.1 13c-.1.3-.2.5-.3.6-.1.1-.3.1-.5.1h-1.6zm23.9.4c-.9 0-1.8-.1-2.7-.3-.9-.2-1.5-.4-2-.7-.3-.2-.4-.3-.5-.5-.1-.1-.1-.3-.1-.4v-1.1c0-.3.1-.4.4-.4.1 0 .2 0 .4.1.1.1.3.2.5.2.7.3 1.4.5 2.2.6.8.1 1.5.2 2.3.2 1.2 0 2.2-.2 2.8-.6.7-.4 1-.9 1-1.7 0-.5-.2-.9-.5-1.2-.3-.3-1-.6-1.9-.9l-2.8-.9c-1.4-.4-2.4-1.1-3-2-.6-.9-.9-1.8-.9-2.8 0-.8.2-1.5.5-2.2.4-.7.9-1.2 1.5-1.7.6-.4 1.3-.8 2.1-1 .8-.2 1.6-.3 2.5-.3.4 0 .9 0 1.3.1.4.1.8.1 1.2.2.4.1.7.2 1 .3.3.1.5.2.7.3.2.1.4.3.5.5.1.1.1.3.1.5v1c0 .3-.1.4-.4.4-.1 0-.4-.1-.7-.2-.9-.4-2-.6-3.2-.6-1.1 0-1.9.2-2.5.5-.6.4-.9.9-.9 1.6 0 .5.2 1 .6 1.3.4.3 1.1.7 2.1 1l2.7.9c1.4.4 2.3 1.1 3 1.9.6.8.9 1.7.9 2.7 0 .8-.2 1.6-.5 2.3-.4.7-.9 1.3-1.6 1.8-.7.5-1.4.9-2.3 1.1-.9.2-1.9.4-2.9.4z" fill="#FF9900"/>
    <path d="M54.4 30.5c-5.5 4.1-13.5 6.2-20.4 6.2-9.6 0-18.3-3.6-24.9-9.5-.5-.5-.1-1.1.6-.7 7.1 4.1 15.8 6.6 24.9 6.6 6.1 0 12.8-1.3 18.9-3.9.9-.5 1.7.6.9 1.3z" fill="#FF9900"/>
    <path d="M56.8 27.8c-.7-.9-4.6-.4-6.3-.2-.5.1-.6-.4-.1-.8 3.1-2.2 8.2-1.5 8.7-.8.6.7-.2 5.9-3.1 8.3-.4.4-.9.2-.7-.3.7-1.7 2.2-5.3 1.5-6.2z" fill="#FF9900"/>
  </svg>
);

const CKA_LOGO = (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:44,height:44}}>
    <circle cx="24" cy="24" r="24" fill="#326CE5"/>
    <path d="M24 8.5L10 16.25v15.5L24 39.5l14-7.75V16.25L24 8.5z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.2"/>
    <path d="M17.5 22h13M24 15.5v17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="3.5" fill="white"/>
    <path d="M24 8.5v7M24 32.5v7M10 16.25l6 3.5M32 28.25l6 3.5M10 31.75l6-3.5M32 19.75l6-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <text x="24" y="27.5" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">K8s</text>
  </svg>
);

const TF_LOGO = (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:40,height:40}}>
    <path d="M18.5 12.5l9.5 5.5v11L18.5 23.5V12.5z" fill="#7B42BC"/>
    <path d="M29.5 18l9.5-5.5v11L29.5 29V18z" fill="#7B42BC" fillOpacity="0.7"/>
    <path d="M9 18l9.5 5.5v11L9 29V18z" fill="#7B42BC" fillOpacity="0.5"/>
    <path d="M18.5 30l9.5 5.5v-11L18.5 19V30z" fill="#4040B2"/>
  </svg>
);

const AZURE_LOGO = (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:44,height:36}}>
    <path d="M17.5 6h13.2L16.8 42H4L17.5 6z" fill="url(#az1)"/>
    <path d="M30.7 6L20.3 19.8l11.5 13.5H16.5L4 42h40L30.7 6z" fill="url(#az2)"/>
    <defs>
      <linearGradient id="az1" x1="10" y1="6" x2="18" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#114A8B"/>
        <stop offset="1" stopColor="#0669BC"/>
      </linearGradient>
      <linearGradient id="az2" x1="26" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3CCBF4"/>
        <stop offset="1" stopColor="#2892DF"/>
      </linearGradient>
    </defs>
  </svg>
);

const CERTS=[
  {logo:AWS_LOGO, auth:"Amazon Web Services",    name:"AWS Solutions Architect — Professional",   year:2023,status:"Active",url:"https://aws.amazon.com/certification/certified-solutions-architect-professional/"},
  {logo:CKA_LOGO, auth:"CNCF / Linux Foundation",name:"Certified Kubernetes Administrator (CKA)", year:2022,status:"Active",url:"https://www.cncf.io/certification/cka/"},
  {logo:TF_LOGO,  auth:"HashiCorp",              name:"HashiCorp Certified: Terraform Associate", year:2023,status:"Active",url:"https://www.hashicorp.com/certification/terraform-associate"},
  {logo:AZURE_LOGO,auth:"Microsoft Azure",       name:"Microsoft Azure Fundamentals (AZ-900)",    year:2022,status:"Active",url:"https://learn.microsoft.com/en-us/certifications/azure-fundamentals/"},
];

function Certifications(){
  const T=useT();
  return (
    <section id="certifications" style={{ padding:"100px 60px",background:T.bg2 }}>
      <SecHead num="05." title="Certifications" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16 }}>
        {CERTS.map((c,i)=><CertCard key={i} {...c} delay={i*60} />)}
      </div>
    </section>
  );
}

function CertCard({ logo,auth,name,year,status,url,delay }){
  const T=useT(); const ref=useReveal(delay); const [h,setH]=useState(false);
  const active=status==="Active";
  return (
    <div ref={ref} className="rv">
      <a href={url} target="_blank" rel="noopener"
        onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{ display:"flex",flexDirection:"column",gap:16,padding:28, background:h?T.cardHov:T.cardBg, border:`1px solid ${h?T.borderHov:T.border}`, backdropFilter:"blur(20px)",borderRadius:2, textDecoration:"none",color:"inherit", transform:h?"translateY(-4px)":"none", boxShadow:h?T.glow:"none", transition:"all .3s cubic-bezier(.22,1,.36,1)", position:"relative",overflow:"hidden",cursor:"none" }}
      >
        <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${T.cyan},transparent)`,opacity:h?.5:0,transition:"opacity .3s" }} />
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ width:56,height:48,background:h?`${T.cyan}0a`:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",padding:6,transition:"background .3s" }}>
            {logo}
          </div>
          <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:18,color:h?T.cyan:T.muted,transform:h?"translate(3px,-3px)":"none",transition:"all .2s" }}>↗</span>
        </div>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:T.cyan,letterSpacing:".15em",textTransform:"uppercase" }}>{auth}</div>
        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,lineHeight:1.3,color:T.text }}>{name}</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"auto" }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:T.muted }}>{year}</span>
          <span style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:10,padding:"3px 10px",letterSpacing:".1em", color:active?T.green:T.orange, background:active?`${T.green}12`:`${T.orange}12`, border:`1px solid ${active?T.green+"40":T.orange+"40"}` }}>{status}</span>
        </div>
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════ */
const CLINKS=[
  {label:"Email",   href:"mailto:gulbadinhasan1@gmail.com", icon:"✉"},
  {label:"LinkedIn",href:"https://linkedin.com/in/gulbadin-hasan", icon:"in"},
  {label:"GitHub",  href:"https://github.com/gulbadinhasan",       icon:"gh"},
  {label:"Resume",  href:"/resume.pdf",                            icon:"↓"},
];

function Contact(){
  const T=useT(); const ref=useReveal();
  return (
    <section id="contact" style={{ padding:"120px 60px",background:T.bg,textAlign:"center",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:600,background:`radial-gradient(circle,${T.cyan}0d 0%,transparent 70%)`,pointerEvents:"none" }} />
      <div ref={ref} className="rv" style={{ position:"relative",zIndex:1,maxWidth:640,margin:"0 auto" }}>
        <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:T.cyan,letterSpacing:".2em",textTransform:"uppercase",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"center",gap:12 }}>
          <div style={{ width:30,height:1,background:T.cyan }} />06. Contact<div style={{ width:30,height:1,background:T.cyan }} />
        </div>
        <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:"clamp(44px,7vw,88px)",fontWeight:800,lineHeight:.92,letterSpacing:"-.03em",marginBottom:28,color:T.text }}>
          Let's Build<br />
          <span style={{ background:`linear-gradient(135deg,${T.cyan},${T.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Something.</span>
        </h2>
        <p style={{ fontSize:16,color:T.muted,lineHeight:1.8,marginBottom:52 }}>
          Open to senior / lead DevOps roles, infrastructure consulting, and speaking opportunities.
        </p>
        <div style={{ display:"flex",flexWrap:"wrap",gap:14,justifyContent:"center" }}>
          {CLINKS.map(l=><CLink key={l.label} {...l} />)}
        </div>
      </div>
    </section>
  );
}

function CLink({ label,href,icon }){
  const T=useT(); const [h,setH]=useState(false);
  return (
    <a href={href} target={href.startsWith("mailto")||href.endsWith(".pdf")?undefined:"_blank"} rel="noopener"
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 28px", border:`1px solid ${h?T.cyan:T.border}`, color:h?T.cyan:T.muted, background:h?`${T.cyan}0d`:"transparent", fontFamily:"'Share Tech Mono',monospace",fontSize:12,letterSpacing:".1em",textTransform:"uppercase",textDecoration:"none",cursor:"none", transition:"all .3s",boxShadow:h?T.glow:"none" }}
    ><span style={{ fontSize:14 }}>{icon}</span>{label}</a>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCANLINE
═══════════════════════════════════════════════════════════ */
function Scanline(){
  const T=useT();
  if(T.mode==="light") return null;
  return (
    <>
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:998,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.02) 2px,rgba(0,0,0,.02) 4px)" }} />
      <div style={{ position:"fixed",left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,rgba(0,240,255,.07),transparent)",pointerEvents:"none",zIndex:997,animation:"scanSwep 8s linear infinite" }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════ */
function Footer(){
  const T=useT();
  return (
    <footer style={{ padding:"24px 60px",borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.bg,transition:"background .45s" }}>
      <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:T.muted }}>
        <span style={{ color:T.cyan }}>Gulbadin Hasan</span> · Lead DevOps Engineer · React
      </div>
      <div style={{ fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:T.muted }}>
        <span style={{ color:T.cyan }}>©</span> 2025 · GitHub Pages
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function App(){
  const [intro,  setIntro]  = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [active, setActive] = useState("hero");
  const theme = isDark ? DARK : LIGHT;

  useEffect(()=>{
    if(intro) return;
    const secs=document.querySelectorAll("section[id]");
    const obs=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting)setActive(e.target.id); }); },{threshold:.4});
    secs.forEach(s=>obs.observe(s));
    return ()=>obs.disconnect();
  },[intro]);

  useEffect(()=>{ document.body.style.background=theme.bg; },[theme]);

  return (
    <Ctx.Provider value={theme}>
      <GlobalStyle T={theme} />
      {intro && <TerminalIntro onDone={()=>setIntro(false)} />}
      {!intro && (
        <>
          <Cursor />
          <ParticleField />
          <Scanline />
          <Nav active={active} isDark={isDark} onToggle={()=>setIsDark(d=>!d)} />
          <Hero />
          <Impact />
          <Skills />
          <Experience />
          <Projects />
          <Certifications />
          <Contact />
          <Footer />
        </>
      )}
    </Ctx.Provider>
  );
}
