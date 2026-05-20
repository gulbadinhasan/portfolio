import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════════
   LANGCHAIN DESIGN TOKENS
   Palette: LangChain's actual brand — charcoal, teal, warm white
═══════════════════════════════════════════════════════════════ */
const T = {
  bg:       "#111211",
  bg2:      "#161817",
  bg3:      "#1c1e1c",
  surface:  "#202220",
  glass:    "rgba(28,30,28,0.85)",
  text:     "#f0f0ee",
  muted:    "#7a8079",
  faint:    "#3a3d3a",
  teal:     "#1de9b6",
  teal2:    "#00c49a",
  teal3:    "rgba(29,233,182,0.12)",
  amber:    "#f59e0b",
  red:      "#ef4444",
  border:   "rgba(29,233,182,0.12)",
  borderHov:"rgba(29,233,182,0.35)",
  glow:     "0 0 24px rgba(29,233,182,0.18)",
  glowLg:   "0 0 60px rgba(29,233,182,0.1)",
  chain:    "#2a2d2a",
};

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      html { scroll-behavior:smooth; }
      body {
        background:${T.bg}; color:${T.text};
        font-family:'DM Sans',sans-serif; font-weight:300;
        overflow-x:hidden; cursor:none;
      }
      ::selection { background:rgba(29,233,182,0.2); color:${T.teal}; }
      ::-webkit-scrollbar { width:3px; }
      ::-webkit-scrollbar-track { background:${T.bg}; }
      ::-webkit-scrollbar-thumb { background:${T.teal}; border-radius:2px; }
      strong { color:${T.text}; font-weight:600; }

      @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
      @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes flowLine { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
      @keyframes nodePop  { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
      @keyframes chainRun { 0%{width:0%} 100%{width:100%} }
      @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes spinDot  { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      @keyframes streamIn { from{opacity:0;max-height:0} to{opacity:1;max-height:400px} }
      @keyframes orbFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }

      .rv { opacity:0; transform:translateY(20px); transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1); }
      .rv.in { opacity:1; transform:none; }

      .chain-node {
        background:${T.surface};
        border:1px solid ${T.faint};
        border-radius:8px;
        transition:all .3s cubic-bezier(.22,1,.36,1);
      }
      .chain-node:hover {
        border-color:${T.teal};
        box-shadow:${T.glow};
        transform:translateY(-2px);
      }
      .chain-node:hover .node-accent { opacity:1; }

      .node-accent {
        position:absolute; top:0; left:0; right:0; height:2px;
        background:linear-gradient(90deg,${T.teal},transparent);
        opacity:0; transition:opacity .3s; border-radius:8px 8px 0 0;
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════════════════════════ */
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const m    = useRef({ x:0, y:0 });
  const r    = useRef({ x:0, y:0 });
  const hov  = useRef(false);

  useEffect(() => {
    const mv = e => { m.current = { x:e.clientX, y:e.clientY }; };
    const ov = e => { hov.current = !!e.target.closest("a,button,[data-hover]"); };
    document.addEventListener("mousemove", mv);
    document.addEventListener("mouseover", ov);
    let raf;
    const loop = () => {
      r.current.x += (m.current.x - r.current.x) * 0.1;
      r.current.y += (m.current.y - r.current.y) * 0.1;
      if (dot.current) {
        dot.current.style.left = m.current.x + "px";
        dot.current.style.top  = m.current.y + "px";
        dot.current.style.background = hov.current ? T.amber : T.teal;
        dot.current.style.transform = hov.current ? "translate(-50%,-50%) scale(2.2)" : "translate(-50%,-50%) scale(1)";
      }
      if (ring.current) {
        ring.current.style.left = r.current.x + "px";
        ring.current.style.top  = r.current.y + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); document.removeEventListener("mousemove", mv); document.removeEventListener("mouseover", ov); };
  }, []);

  return (
    <>
      <div ref={dot}  style={{ position:"fixed",width:7,height:7,borderRadius:"50%",background:T.teal,pointerEvents:"none",zIndex:9999,transition:"transform .15s,background .2s",boxShadow:`0 0 8px ${T.teal}` }} />
      <div ref={ring} style={{ position:"fixed",width:28,height:28,borderRadius:"50%",border:`1px solid ${T.teal}40`,pointerEvents:"none",zIndex:9998,transform:"translate(-50%,-50%)",transition:"left .12s,top .12s" }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REVEAL HOOK
═══════════════════════════════════════════════════════════════ */
function useReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add("in"), delay); obs.unobserve(el); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ═══════════════════════════════════════════════════════════════
   CHAIN CONNECTOR — SVG arrow between nodes
═══════════════════════════════════════════════════════════════ */
function ChainArrow({ vertical = false }) {
  if (vertical) return (
    <div style={{ display:"flex", justifyContent:"center", padding:"6px 0" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
        <div style={{ width:1, height:20, background:`linear-gradient(${T.teal},${T.teal}40)` }} />
        <div style={{ width:0, height:0, borderLeft:"4px solid transparent", borderRight:"4px solid transparent", borderTop:`6px solid ${T.teal}` }} />
      </div>
    </div>
  );
  return (
    <div style={{ display:"flex", alignItems:"center", padding:"0 8px", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:2 }}>
        <div style={{ width:24, height:1, background:`linear-gradient(90deg,${T.teal}40,${T.teal})` }} />
        <div style={{ width:0, height:0, borderTop:"4px solid transparent", borderBottom:"4px solid transparent", borderLeft:`6px solid ${T.teal}` }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAIN STEP PILL — LangChain pipeline step component
═══════════════════════════════════════════════════════════════ */
function ChainStep({ type, label, sublabel, status = "success" }) {
  const colors = {
    llm:      { bg:"rgba(29,233,182,0.08)", border:T.teal,   icon:"🧠", label:"LLM" },
    tool:     { bg:"rgba(245,158,11,0.08)", border:T.amber,  icon:"⚙", label:"Tool" },
    retriever:{ bg:"rgba(99,102,241,0.08)", border:"#6366f1", icon:"🔍", label:"Retriever" },
    prompt:   { bg:"rgba(236,72,153,0.08)", border:"#ec4899", icon:"📝", label:"Prompt" },
    output:   { bg:"rgba(29,233,182,0.06)", border:T.teal2,  icon:"✦",  label:"Output" },
    memory:   { bg:"rgba(168,85,247,0.08)", border:"#a855f7", icon:"💾", label:"Memory" },
    agent:    { bg:"rgba(29,233,182,0.1)",  border:T.teal,   icon:"⬡",  label:"Agent" },
  };
  const c = colors[type] || colors.tool;
  const statusColor = status === "success" ? T.teal : status === "running" ? T.amber : T.muted;

  return (
    <div style={{
      display:"inline-flex", flexDirection:"column", gap:6,
      padding:"10px 14px", minWidth:110,
      background:c.bg,
      border:`1px solid ${c.border}30`,
      borderRadius:8, position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1.5, background:c.border, opacity:0.5 }} />
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:13 }}>{c.icon}</span>
        <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:9, color:c.border, letterSpacing:".1em", textTransform:"uppercase" }}>{c.label}</span>
      </div>
      <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.text, fontWeight:500 }}>{label}</div>
      {sublabel && <div style={{ fontSize:10, color:T.muted }}>{sublabel}</div>}
      <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
        <div style={{ width:5, height:5, borderRadius:"50%", background:statusColor, boxShadow:`0 0 4px ${statusColor}` }} />
        <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:9, color:statusColor }}>{status}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AGENT LOOP ANIMATION — Hero centerpiece
═══════════════════════════════════════════════════════════════ */
const AGENT_STEPS = [
  { phase:"Thought",     text:"Analysing infrastructure profile: gulbadin-hasan ...",                       color:T.teal  },
  { phase:"Action",      text:"tool: career_retriever.invoke({query: 'impact metrics'})",                   color:T.amber },
  { phase:"Observation", text:"$30K/month saved · 99.7% SLA · MTTR ↓40% · PCIDSS compliant",              color:"#6366f1"},
  { phase:"Action",      text:"tool: skills_loader.load({domains: ['SRE','DevOps','Cloud','Security']})",   color:T.amber },
  { phase:"Observation", text:"AWS · Kubernetes · Terraform · ArgoCD · OpenTelemetry · Vault",              color:"#6366f1"},
  { phase:"Final Answer",text:"Lead DevOps Engineer with 10+ years building scalable, secure cloud infra.", color:T.teal  },
];

function AgentLoop() {
  const [step, setStep]     = useState(0);
  const [typed, setTyped]   = useState("");
  const [visible, setVisible] = useState([]);
  const [done, setDone]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < AGENT_STEPS.length; i++) {
        if (cancelled) return;
        setStep(i);
        const s = AGENT_STEPS[i];
        setTyped("");
        await new Promise(r => setTimeout(r, 300));
        for (let j = 0; j <= s.text.length; j++) {
          if (cancelled) return;
          setTyped(s.text.slice(0, j));
          await new Promise(r => setTimeout(r, j === 0 ? 0 : 18));
        }
        await new Promise(r => setTimeout(r, 400));
        setVisible(v => [...v, i]);
      }
      setDone(true);
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{
      background:T.surface,
      border:`1px solid ${T.faint}`,
      borderRadius:10,
      overflow:"hidden",
      maxWidth:640,
    }}>
      {/* window bar */}
      <div style={{ padding:"10px 16px", borderBottom:`1px solid ${T.faint}`, background:T.chain, display:"flex", alignItems:"center", gap:10 }}>
        {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(
          <div key={i} style={{ width:10,height:10,borderRadius:"50%",background:c }} />
        ))}
        <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.muted, marginLeft:8 }}>AgentExecutor — gulbadin-hasan</span>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:done?T.teal:T.amber,boxShadow:`0 0 6px ${done?T.teal:T.amber}`,animation:done?"none":"pulse .8s ease-in-out infinite" }} />
          <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, color:done?T.teal:T.amber }}>{done?"finished":"running"}</span>
        </div>
      </div>
      {/* body */}
      <div style={{ padding:"20px 20px 16px", display:"flex", flexDirection:"column", gap:0 }}>
        {visible.map((idx) => {
          const s = AGENT_STEPS[idx];
          const isFinal = s.phase === "Final Answer";
          return (
            <div key={idx} style={{ marginBottom:10, animation:"fadeUp .35s ease" }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{
                  fontFamily:"'Geist Mono',monospace", fontSize:10,
                  color:s.color, letterSpacing:".08em", textTransform:"uppercase",
                  minWidth:90, paddingTop:2, flexShrink:0,
                  opacity:0.85,
                }}>{s.phase}</span>
                <span style={{
                  fontFamily:"'Geist Mono',monospace", fontSize:12,
                  color: isFinal ? T.text : T.muted,
                  lineHeight:1.6,
                  borderLeft:`1.5px solid ${s.color}30`,
                  paddingLeft:12,
                  fontWeight: isFinal ? 500 : 300,
                }}>{s.text}</span>
              </div>
            </div>
          );
        })}
        {/* currently typing */}
        {!done && step < AGENT_STEPS.length && !visible.includes(step) && (
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, color:AGENT_STEPS[step].color, letterSpacing:".08em", textTransform:"uppercase", minWidth:90, paddingTop:2, flexShrink:0, opacity:0.85 }}>{AGENT_STEPS[step].phase}</span>
            <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:12, color:T.muted, lineHeight:1.6, borderLeft:`1.5px solid ${AGENT_STEPS[step].color}30`, paddingLeft:12 }}>
              {typed}
              <span style={{ animation:"blink .9s step-end infinite", display:"inline-block", width:7, height:12, background:T.teal, verticalAlign:"middle", marginLeft:2 }} />
            </span>
          </div>
        )}
        {done && (
          <div style={{ marginTop:8, padding:"8px 12px", background:`${T.teal}08`, border:`1px solid ${T.teal}20`, borderRadius:6, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:T.teal, fontSize:13 }}>✔</span>
            <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.teal }}>chain complete · 0 errors · ready for hire</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════════ */
const NAVS = ["Impact","Stack","Experience","Projects","Certifications","Contact"];

function Nav() {
  const [sc, setSc]     = useState(false);
  const [active, setAc] = useState("");
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const secs = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) setAc(e.target.id); }), { threshold:.4 });
    secs.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:500,
      padding:"0 60px", height:60,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background: sc ? "rgba(17,18,17,0.92)" : "transparent",
      backdropFilter: sc ? "blur(20px)" : "none",
      borderBottom: sc ? `1px solid ${T.faint}` : "none",
      transition:"all .4s",
    }}>
      {/* logo — LangChain chain-link icon style */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ position:"relative", width:24, height:24 }}>
          <div style={{ position:"absolute", width:16, height:16, border:`2px solid ${T.teal}`, borderRadius:4, top:0, left:0 }} />
          <div style={{ position:"absolute", width:16, height:16, border:`2px solid ${T.teal}60`, borderRadius:4, bottom:0, right:0 }} />
        </div>
        <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:13, color:T.text, letterSpacing:".05em" }}>gulbadin<span style={{ color:T.teal }}>.chain</span></span>
      </div>

      <ul style={{ display:"flex", gap:32, listStyle:"none" }}>
        {NAVS.map(l => (
          <li key={l}><a href={`#${l.toLowerCase()}`} style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:active===l.toLowerCase()?T.teal:T.muted, textDecoration:"none", letterSpacing:".1em", textTransform:"lowercase", transition:"color .2s", borderBottom:active===l.toLowerCase()?`1px solid ${T.teal}`:"1px solid transparent", paddingBottom:2 }}>{l}</a></li>
        ))}
      </ul>

      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:T.teal, boxShadow:`0 0 8px ${T.teal}`, animation:"pulse 2s ease-in-out infinite" }} />
        <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.teal }}>available</span>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section id="hero" style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:"120px 60px 80px", position:"relative", overflow:"hidden" }}>
      {/* background orbs */}
      {[
        { w:500, t:"20%", l:"60%", c:"rgba(29,233,182,0.05)", d:"18s" },
        { w:300, t:"65%", l:"20%", c:"rgba(99,102,241,0.04)", d:"24s" },
      ].map((o,i) => (
        <div key={i} style={{ position:"absolute", width:o.w, height:o.w, top:o.t, left:o.l, transform:"translate(-50%,-50%)", background:`radial-gradient(circle,${o.c} 0%,transparent 70%)`, borderRadius:"50%", pointerEvents:"none", animation:`orbFloat ${o.d} ease-in-out infinite` }} />
      ))}

      {/* dot grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(${T.faint} 1px, transparent 1px)`, backgroundSize:"32px 32px", maskImage:"radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)", opacity:.5 }} />

      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", gap:48, width:"100%", maxWidth:1100 }}>
        {/* top label */}
        <div style={{ display:"flex", alignItems:"center", gap:12, opacity:0, animation:"fadeUp .6s .1s forwards" }}>
          <div style={{ padding:"4px 12px", background:`${T.teal}12`, border:`1px solid ${T.teal}30`, borderRadius:20, fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.teal, letterSpacing:".1em" }}>
            ⬡ LangChain Agent · gulbadin-hasan
          </div>
          <div style={{ height:1, width:60, background:`linear-gradient(90deg,${T.teal}40,transparent)` }} />
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:40, flexWrap:"wrap" }}>
          {/* left */}
          <div style={{ maxWidth:520 }}>
            <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(52px,7vw,88px)", fontWeight:800, lineHeight:.92, letterSpacing:"-.03em", marginBottom:24, opacity:0, animation:"fadeUp .8s .25s forwards" }}>
              Gulbadin<br />
              <span style={{ color:T.teal }}>Hasan</span><span style={{ color:T.faint }}>.</span>
            </h1>
            <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:14, color:T.muted, marginBottom:20, opacity:0, animation:"fadeUp .7s .4s forwards" }}>
              <span style={{ color:T.teal }}># </span>Lead DevOps Engineer · 10+ years · India
            </div>
            <p style={{ fontSize:15, color:T.muted, lineHeight:1.85, maxWidth:460, marginBottom:40, fontWeight:300, opacity:0, animation:"fadeUp .7s .55s forwards" }}>
              Building scalable AWS platforms, Kubernetes systems, and CI/CD pipelines. Proven ability to improve reliability, reduce costs, and automate infrastructure at scale.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", opacity:0, animation:"fadeUp .7s .7s forwards" }}>
              <HeroBtn href="#impact" primary>invoke("show_impact")</HeroBtn>
              <HeroBtn href="#contact">chain.call("hire")</HeroBtn>
            </div>
          </div>

          {/* right — agent loop */}
          <div style={{ opacity:0, animation:"fadeUp .9s .5s forwards" }}>
            <AgentLoop />
          </div>
        </div>

        {/* stats row */}
        <div style={{ display:"flex", gap:2, flexWrap:"wrap", opacity:0, animation:"fadeUp .7s .9s forwards" }}>
          {[
            { v:"10+",    l:"years experience" },
            { v:"$30K",   l:"saved per month" },
            { v:"99.7%",  l:"uptime SLA" },
            { v:"400%",   l:"faster deploys" },
            { v:"0",      l:"critical findings" },
          ].map(s => (
            <div key={s.l} style={{ padding:"14px 24px", background:T.surface, border:`1px solid ${T.faint}`, flex:1, minWidth:140 }}>
              <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, fontWeight:800, color:T.teal, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, color:T.muted, marginTop:4, letterSpacing:".08em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroBtn({ href, primary, children }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding:"11px 24px", background:primary?(h?T.teal:"transparent"):"transparent", border:`1px solid ${primary?T.teal:T.faint}`, color:primary?(h?T.bg:T.teal):(h?T.text:T.muted), fontFamily:"'Geist Mono',monospace", fontSize:12, textDecoration:"none", cursor:"none", transition:"all .25s", borderRadius:6, letterSpacing:".05em", boxShadow:primary&&h?T.glow:"none" }}
    >{children}</a>
  );
}

/* ═══════════════════════════════════════════════════════════════
   IMPACT — RAG pipeline per domain
═══════════════════════════════════════════════════════════════ */
const DOMAINS = [
  {
    id:"sre", label:"SRE", icon:"📡", color:T.teal,
    chain:[
      { type:"prompt",    label:"SLO Target",  sub:"99.7% uptime" },
      { type:"retriever", label:"ObservStack", sub:"OpenTelemetry" },
      { type:"tool",      label:"IncidentMgr", sub:"PagerDuty" },
      { type:"llm",       label:"RootCause",   sub:"Analysis" },
      { type:"output",    label:"MTTR ↓40%",  sub:"Resolved" },
    ],
    metrics:[
      { k:"uptime_sla",       v:"99.7%+",    note:"AZ-aware HA architecture" },
      { k:"mttr_reduction",   v:"↓ 40%",     note:"OpenTelemetry observability" },
      { k:"sev1_incidents",   v:"0",         note:"post blue-green migration" },
      { k:"k8s_downtime",     v:"ZERO",      note:"EKS 1.23 → 1.29 upgrades" },
    ],
  },
  {
    id:"devops", label:"DevOps", icon:"🔄", color:T.amber,
    chain:[
      { type:"prompt",  label:"Commit",       sub:"git push" },
      { type:"tool",    label:"CI Pipeline",  sub:"GitHub Actions" },
      { type:"tool",    label:"GitOps Sync",  sub:"ArgoCD" },
      { type:"llm",     label:"Canary Gate",  sub:"Auto-promote" },
      { type:"output",  label:"Deployed ✔",  sub:"0 rollbacks" },
    ],
    metrics:[
      { k:"deploy_speed",     v:"↑ 400%",    note:"ArgoCD self-service portal" },
      { k:"failure_rate",     v:"↓ 33%",     note:"GitOps change pipeline" },
      { k:"upgrade_versions", v:"6",         note:"EKS major versions" },
      { k:"rollbacks",        v:"0",         note:"blue-green + canary strategy" },
    ],
  },
  {
    id:"cloud", label:"Cloud", icon:"☁️", color:"#6366f1",
    chain:[
      { type:"prompt",    label:"Audit Infra",  sub:"AWS Cost Explorer" },
      { type:"retriever", label:"ResourceScan", sub:"14 services" },
      { type:"llm",       label:"RightSize",    sub:"Terraform plan" },
      { type:"tool",      label:"Apply",        sub:"0 downtime" },
      { type:"output",    label:"$30K saved",   sub:"per month" },
    ],
    metrics:[
      { k:"monthly_savings",  v:"$30K",      note:"DB & infra optimisation" },
      { k:"annual_savings",   v:"$360K",     note:"annualised" },
      { k:"iac_coverage",     v:"100%",      note:"Terraform modules" },
      { k:"environments",     v:"multi",     note:"dev · staging · prod" },
    ],
  },
  {
    id:"security", label:"Security", icon:"🔐", color:"#a855f7",
    chain:[
      { type:"prompt",    label:"Scope: full",   sub:"847 resources" },
      { type:"retriever", label:"TrivyScan",     sub:"CVE database" },
      { type:"tool",      label:"IAM Auditor",   sub:"zero long-lived" },
      { type:"llm",       label:"PCIDSSCheck",   sub:"all controls" },
      { type:"output",    label:"0 critical",    sub:"COMPLIANT" },
    ],
    metrics:[
      { k:"pcidss_status",    v:"COMPLIANT", note:"built 0 → 1" },
      { k:"critical_findings",v:"0",         note:"full audit scope" },
      { k:"iam_creds",        v:"0",         note:"long-lived credentials" },
      { k:"compliance_scope", v:"12",        note:"AWS accounts audited" },
    ],
  },
];

function Impact() {
  const [activeTab, setActiveTab] = useState("sre");
  const active = DOMAINS.find(d => d.id === activeTab);
  const ref = useReveal();

  return (
    <section id="impact" style={{ padding:"100px 60px", background:T.bg2 }}>
      <div ref={ref} className="rv">
        <SecLabel num="01" text="key_impact" />
        <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-.02em", marginBottom:12 }}>
          Impact by domain
        </h2>
        <p style={{ fontFamily:"'Geist Mono',monospace", fontSize:12, color:T.muted, marginBottom:40, maxWidth:520 }}>
          # Each recruiter signal rendered as a LangChain retrieval chain
        </p>
      </div>

      {/* tab strip */}
      <div style={{ display:"flex", gap:2, marginBottom:32, flexWrap:"wrap" }}>
        {DOMAINS.map(d => {
          const isAct = activeTab === d.id;
          return (
            <button key={d.id} onClick={() => setActiveTab(d.id)}
              style={{ padding:"8px 20px", background:isAct?`${d.color}14`:"transparent", border:`1px solid ${isAct?d.color:T.faint}`, color:isAct?d.color:T.muted, fontFamily:"'Geist Mono',monospace", fontSize:12, cursor:"none", borderRadius:6, transition:"all .2s", letterSpacing:".05em" }}
            >{d.icon} {d.label}</button>
          );
        })}
      </div>

      {/* chain pipeline */}
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.muted, marginBottom:16, letterSpacing:".08em" }}>
          # chain.invoke({`{domain: "${activeTab}"}`}) →
        </div>
        <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:0 }}>
          {active.chain.map((step, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center" }}>
              <ChainStep type={step.type} label={step.label} sublabel={step.sub} status="success" />
              {i < active.chain.length - 1 && <ChainArrow />}
            </div>
          ))}
        </div>
      </div>

      {/* metrics grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:2 }}>
        {active.metrics.map((m, i) => (
          <MetricCard key={i} {...m} color={active.color} delay={i * 50} />
        ))}
      </div>
    </section>
  );
}

function MetricCard({ k, v, note, color, delay }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="rv chain-node" style={{ padding:"24px 22px", position:"relative" }}>
      <div className="node-accent" style={{ background:`linear-gradient(90deg,${color},transparent)` }} />
      <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, color:T.muted, letterSpacing:".12em", marginBottom:10 }}>{k}</div>
      <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:36, fontWeight:800, color, lineHeight:1, marginBottom:6 }}>{v}</div>
      <div style={{ fontSize:12, color:T.muted }}>{note}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STACK — Tool registry format
═══════════════════════════════════════════════════════════════ */
const TOOLS = [
  { name:"AWS",            desc:"EKS·ECS·EC2·Lambda·VPC·S3·IAM·KMS·RDS·DynamoDB·CloudFront·EMR·Security Hub", type:"cloud",    since:"2019" },
  { name:"Kubernetes",     desc:"Cluster admin · upgrades · RBAC · networking · workload mgmt",                type:"container",since:"2020" },
  { name:"Terraform",      desc:"Reusable modules · multi-env · drift detection · cost estimation",            type:"iac",      since:"2019" },
  { name:"ArgoCD",         desc:"GitOps · self-service portal · drift sync · app-of-apps pattern",            type:"cicd",     since:"2022" },
  { name:"GitHub Actions", desc:"Reusable workflows · matrix builds · OIDC · secrets mgmt",                   type:"cicd",     since:"2022" },
  { name:"OpenTelemetry",  desc:"Distributed tracing · metrics · logs · OTLP export · Splunk/NR/Grafana",     type:"observ",   since:"2024" },
  { name:"Prometheus",     desc:"SLO/SLA alerting · recording rules · Grafana dashboards",                    type:"observ",   since:"2021" },
  { name:"Vault",          desc:"Dynamic secrets · PKI · KV v2 · Kubernetes auth · IAM integration",          type:"security", since:"2021" },
  { name:"Jenkins",        desc:"Pipeline as code · shared libraries · agent pools",                           type:"cicd",     since:"2018" },
  { name:"LangChain",      desc:"LLM chains · RAG pipelines · tool use · agent executor · memory",            type:"ai",       since:"2024" },
  { name:"Ollama",         desc:"Local LLM hosting · model management · OpenAI-compatible API",               type:"ai",       since:"2024" },
  { name:"Docker",         desc:"Multi-stage builds · Compose · registry · image hardening",                  type:"container",since:"2019" },
];

const TYPE_COLORS = { cloud:"#6366f1", container:T.teal, iac:"#a855f7", cicd:T.amber, observ:"#ec4899", security:"#ef4444", ai:T.teal2 };

function Stack() {
  const ref = useReveal();
  return (
    <section id="stack" style={{ padding:"100px 60px", background:T.bg }}>
      <div ref={ref} className="rv">
        <SecLabel num="02" text="tool_registry" />
        <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-.02em", marginBottom:12 }}>Technical stack</h2>
        <p style={{ fontFamily:"'Geist Mono',monospace", fontSize:12, color:T.muted, marginBottom:40, maxWidth:480 }}>
          # tools = [Tool(name=..., description=...) for tool in registry]
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:2 }}>
        {TOOLS.map((t, i) => <ToolCard key={i} {...t} delay={i * 45} />)}
      </div>
    </section>
  );
}

function ToolCard({ name, desc, type, since, delay }) {
  const ref   = useReveal(delay);
  const color = TYPE_COLORS[type] || T.teal;
  return (
    <div ref={ref} className="rv chain-node" style={{ padding:"22px", position:"relative", overflow:"hidden" }}>
      <div className="node-accent" style={{ background:`linear-gradient(90deg,${color},transparent)` }} />
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:2, background:color }} />
          <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:13, fontWeight:500, color:T.text }}>{name}</span>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:9, padding:"2px 7px", background:`${color}14`, border:`1px solid ${color}30`, color, borderRadius:4, letterSpacing:".08em" }}>{type}</span>
          <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:9, padding:"2px 7px", background:T.chain, border:`1px solid ${T.faint}`, color:T.muted, borderRadius:4 }}>{since}</span>
        </div>
      </div>
      <p style={{ fontSize:12, color:T.muted, lineHeight:1.6 }}>{desc}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPERIENCE — Agent executor trace
═══════════════════════════════════════════════════════════════ */
const JOBS = [
  { period:"Oct 2024 – Mar 2025", role:"Lead DevOps Engineer",             company:"9Yards Technology",    loc:"Remote",
    entering:"Entering chain: modernise_deployment_workflows",
    steps:["event_driven_arch(Lambda, SQS/SNS, API Gateway, EventBridge)","observability(OpenTelemetry) → MTTR ↓ 40%","iam_migration(role_based, Terraform) → zero long-lived creds","ci_cd(GitHub Actions, reusable workflows)"],
    result:"Delivery velocity ↑ · Security posture ✔ · MTTR ↓ 40%",
    tags:["AWS","Lambda","SQS/SNS","OpenTelemetry","GitHub Actions","Terraform"] },
  { period:"Apr 2023 – Jun 2024",  role:"Sr. Cloud Infrastructure Engineer",company:"Arkose Labs",          loc:"Pune",
    entering:"Entering chain: reduce_cost_and_upgrade_risk",
    steps:["cost_analysis(DB + infra) → $30K/month saved","eks_upgrade(1.23 → 1.29, rolling) → zero downtime","ha_architecture(AZ-aware routing) → 99.9%+ uptime","terraform_modules(reusable, multi-env)"],
    result:"$30K/month recovered · 99.9%+ uptime · 6 EKS versions upgraded",
    tags:["AWS EKS","Terraform","ArgoCD","GitHub Actions","Kubernetes"] },
  { period:"Dec 2020 – Apr 2023",  role:"Technical Lead",                   company:"Incedo Inc",            loc:"Pune",
    entering:"Entering chain: platform_reliability_and_secrets",
    steps:["vault_secrets(KV v2, K8s auth, IAM integration)","cicd_pipeline(Jenkins, Terraform, optimised)","aws_security_audit(Trusted Advisor + Inspector)","oncall_automation(structured runbooks, SLOs)"],
    result:"Secrets sprawl eliminated · Deployment failures ↓ · Audit passed",
    tags:["Kubernetes","Jenkins","Terraform","Vault","IAM"] },
  { period:"May 2019 – Dec 2020",  role:"Data Engineer",                    company:"Cratas Techno Solution",loc:"Pune",
    entering:"Entering chain: build_cloud_from_zero",
    steps:["aws_foundation(VPC, EC2, S3, IAM, networking)","pcidss_compliance(OS hardening, KMS, Security Hub) → 0 findings","iac_automation(Terraform + CloudFormation)","monitoring(CloudWatch alerts + logging)"],
    result:"PCIDSS compliant · Cloud footprint established · Zero findings",
    tags:["AWS","Terraform","CloudFormation","PCIDSS","CloudWatch"] },
  { period:"Jul 2016 – May 2019",  role:"Senior Systems Engineer",          company:"Astron Systems",         loc:"Nagpur",
    entering:"Entering chain: hadoop_cluster_ops",
    steps:["hadoop_clusters(CDH/HDP, AWS + bare metal)","kerberos_auth(Active Directory integration)","health_checks(automated, shell scripting)","capacity_planning(data workload scaling)"],
    result:"Cluster stability ✔ · Manual ops ↓ · Auth hardened",
    tags:["Hadoop","AWS","CDH/HDP","Kerberos","Bash"] },
  { period:"Jan 2014 – Jul 2016",  role:"Senior Systems Engineer",          company:"Cognizant",              loc:"Pune",
    entering:"Entering chain: enterprise_support_ops",
    steps:["production_support(50+ apps, SLA adherence)","legacy_migration(Windows 2003 → 2008)","itil_practices(incident · problem · change mgmt)"],
    result:"SLA maintained · Migration complete · 0 open incidents",
    tags:["ITIL","IIS","Windows","SLA","Enterprise"] },
];

function Experience() {
  const ref = useReveal();
  return (
    <section id="experience" style={{ padding:"100px 60px", background:T.bg2 }}>
      <div ref={ref} className="rv">
        <SecLabel num="03" text="agent_trace" />
        <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-.02em", marginBottom:12 }}>Experience</h2>
        <p style={{ fontFamily:"'Geist Mono',monospace", fontSize:12, color:T.muted, marginBottom:48, maxWidth:480 }}>
          # AgentExecutor.invoke(career) — all chains resolved
        </p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {JOBS.map((j, i) => <JobCard key={i} {...j} delay={i * 80} />)}
      </div>
    </section>
  );
}

function JobCard({ period, role, company, loc, entering, steps, result, tags, delay }) {
  const [open, setOpen] = useState(false);
  const ref = useReveal(delay);

  return (
    <div ref={ref} className="rv chain-node" style={{ position:"relative", overflow:"hidden" }}>
      <div className="node-accent" />
      <div style={{ padding:"22px 24px", cursor:"none" }} onClick={() => setOpen(o => !o)} data-hover>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, color:T.teal, letterSpacing:".12em", marginBottom:8 }}>{period}</div>
            <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:20, fontWeight:700, marginBottom:4 }}>{role}</div>
            <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:12, color:T.muted }}>
              {company} <span style={{ color:T.amber }}>// {loc}</span>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ padding:"4px 12px", background:`${T.teal}10`, border:`1px solid ${T.teal}20`, borderRadius:20, fontFamily:"'Geist Mono',monospace", fontSize:10, color:T.teal }}>✔ resolved</div>
            <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:14, color:T.muted, transform:open?"rotate(90deg)":"none", transition:"transform .2s" }}>›</div>
          </div>
        </div>
        {/* tags */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:14 }}>
          {tags.map(t => <span key={t} style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, padding:"3px 8px", background:`${T.teal}0a`, border:`1px solid ${T.teal}18`, color:T.teal, borderRadius:4 }}>{t}</span>)}
        </div>
      </div>

      {/* expanded trace */}
      {open && (
        <div style={{ borderTop:`1px solid ${T.faint}`, padding:"20px 24px", animation:"streamIn .3s ease", background:T.chain }}>
          <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.muted, marginBottom:12 }}>
            &gt; {entering}
          </div>
          {steps.map((s, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:8 }}>
              <span style={{ color:T.teal, fontFamily:"'Geist Mono',monospace", fontSize:11, flexShrink:0 }}>  ▸</span>
              <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.muted }}>{s}</span>
            </div>
          ))}
          <div style={{ marginTop:14, padding:"8px 14px", background:`${T.teal}08`, border:`1px solid ${T.teal}20`, borderRadius:6, fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.teal }}>
            &gt; Finished chain. Result: {result}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECTS — RAG pipeline cards
═══════════════════════════════════════════════════════════════ */
const PROJECTS = [
  { num:"01", title:"EKS Zero-Downtime Upgrade Pipeline", result:"1.23→1.29 · ZERO downtime", color:T.teal,
    pipeline:["Document(EKS 1.23 state)","TextSplitter(upgrade plan)","Embedder(risk vectors)","Retriever(rollback docs)","LLM(execute strategy)"],
    desc:"6 major Kubernetes version upgrades at Arkose Labs using blue-green and canary strategies. Every environment migrated without a single production incident.",
    stack:["AWS EKS","Kubernetes","Helm","ArgoCD","Terraform"] },
  { num:"02", title:"Developer Self-Service Portal", result:"↑400% deploys · ↓33% failures", color:T.amber,
    pipeline:["Loader(git push)","Splitter(validate + test)","Embedder(artifact)","Retriever(target env)","LLM(ArgoCD sync)"],
    desc:"ArgoCD WebUI self-service portal removed DevOps as a bottleneck. Developers own their release pipelines — deploy time ↑400%, failure rate ↓33%.",
    stack:["ArgoCD","GitOps","Kubernetes","GitHub Actions","AWS"] },
  { num:"03", title:"PCIDSS Compliant Cloud Platform", result:"0→1 · zero critical findings", color:"#a855f7",
    pipeline:["Loader(blank AWS account)","Splitter(PCIDSS controls)","Embedder(Terraform)","Retriever(Security Hub)","LLM(audit report)"],
    desc:"Designed and secured a PCIDSS-compliant cloud platform from scratch. OS hardening, KMS, VPC segmentation, IAM — zero compliance gaps at audit.",
    stack:["AWS","KMS","Security Hub","IAM","Terraform","CloudWatch"] },
  { num:"04", title:"Unified Observability Platform", result:"↓40% MTTR · 99.7%+ uptime", color:"#ec4899",
    pipeline:["Loader(OTLP traces)","Splitter(spans + metrics)","Embedder(anomaly vecs)","Retriever(runbook)","LLM(alert + resolve)"],
    desc:"End-to-end OpenTelemetry instrumentation unifying Splunk, New Relic, Prometheus and Grafana. MTTR dropped 40%, uptime maintained at 99.7%+.",
    stack:["OpenTelemetry","Splunk","New Relic","Prometheus","Grafana"] },
];

function Projects() {
  const ref = useReveal();
  return (
    <section id="projects" style={{ padding:"100px 60px", background:T.bg }}>
      <div ref={ref} className="rv">
        <SecLabel num="04" text="rag_pipelines" />
        <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-.02em", marginBottom:12 }}>Key projects</h2>
        <p style={{ fontFamily:"'Geist Mono',monospace", fontSize:12, color:T.muted, marginBottom:48, maxWidth:480 }}>
          # Each project rendered as a retrieval-augmented pipeline
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))", gap:2 }}>
        {PROJECTS.map((p, i) => <ProjectCard key={i} {...p} delay={i * 70} />)}
      </div>
    </section>
  );
}

function ProjectCard({ num, title, result, color, pipeline, desc, stack, delay }) {
  const ref = useReveal(delay);
  const [h, setH] = useState(false);

  return (
    <div ref={ref} className="rv chain-node" style={{ position:"relative", overflow:"hidden", borderColor:h?`${color}40`:undefined }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <div className="node-accent" style={{ background:`linear-gradient(90deg,${color},transparent)`, opacity:h?1:0 }} />
      <div style={{ padding:"28px 24px" }}>
        <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, color:T.muted, letterSpacing:".12em", marginBottom:14 }}>// PROJECT_{num}</div>
        <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:19, fontWeight:700, marginBottom:8, color:h?color:T.text, transition:"color .2s" }}>{title}</div>
        <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.teal, marginBottom:16, padding:"5px 10px", background:`${T.teal}08`, border:`1px solid ${T.teal}18`, borderRadius:4, display:"inline-block" }}>{result}</div>

        {/* mini RAG pipeline */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:9, color:T.muted, letterSpacing:".1em", marginBottom:8 }}>RAG PIPELINE</div>
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            {pipeline.map((step, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:1, height:i===0?0:8, background:`${color}30`, marginLeft:7, flexShrink:0 }} />
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:6, height:6, borderRadius:2, background:color, opacity:0.6+i*0.08, flexShrink:0 }} />
                  <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, color:T.muted }}>{step}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize:13, color:T.muted, lineHeight:1.7, marginBottom:16 }}>{desc}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {stack.map(t => <span key={t} style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, padding:"3px 8px", border:`1px solid ${T.faint}`, color:T.muted, borderRadius:4 }}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CERTIFICATIONS — Document loader format
═══════════════════════════════════════════════════════════════ */
const CERTS = [
  { icon:"☁️", issuer:"Amazon Web Services",    title:"AWS Solutions Architect — Professional", valid:"2023–2026", level:"Professional", url:"https://aws.amazon.com/certification/certified-solutions-architect-professional/", color:T.amber },
  { icon:"⚙️", issuer:"CNCF / Linux Foundation", title:"Certified Kubernetes Administrator",    valid:"2022–2025", level:"Professional", url:"https://www.cncf.io/certification/cka/",  color:T.teal },
  { icon:"🔧", issuer:"HashiCorp",               title:"Terraform Associate",                   valid:"2023–2025", level:"Associate",    url:"https://www.hashicorp.com/certification/terraform-associate", color:"#a855f7" },
  { icon:"🪟", issuer:"Microsoft",               title:"Azure Fundamentals (AZ-900)",           valid:"2022–∞",    level:"Fundamentals", url:"https://learn.microsoft.com/en-us/certifications/azure-fundamentals/", color:"#6366f1" },
];

function Certifications() {
  const ref = useReveal();
  return (
    <section id="certifications" style={{ padding:"100px 60px", background:T.bg2 }}>
      <div ref={ref} className="rv">
        <SecLabel num="05" text="document_loader" />
        <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-.02em", marginBottom:12 }}>Certifications</h2>
        <p style={{ fontFamily:"'Geist Mono',monospace", fontSize:12, color:T.muted, marginBottom:48, maxWidth:480 }}>
          # loader.load_and_split(source="cert_authority")
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:2 }}>
        {CERTS.map((c, i) => <CertCard key={i} {...c} delay={i * 70} />)}
      </div>
    </section>
  );
}

function CertCard({ icon, issuer, title, valid, level, url, color, delay }) {
  const ref = useReveal(delay);
  const [h, setH] = useState(false);

  return (
    <div ref={ref} className="rv">
      <a href={url} target="_blank" rel="noopener"
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{ display:"flex", flexDirection:"column", gap:14, padding:"24px", background:h?`${color}06`:T.surface, border:`1px solid ${h?color+"40":T.faint}`, borderRadius:8, textDecoration:"none", color:"inherit", transform:h?"translateY(-3px)":"none", boxShadow:h?`0 0 24px ${color}18`:"none", transition:"all .3s", cursor:"none", position:"relative", overflow:"hidden" }}
      >
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1.5, background:color, opacity:h?.6:.15, transition:"opacity .3s" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ width:44, height:44, background:`${color}12`, border:`1px solid ${color}25`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
          <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:16, color:h?color:T.muted, transform:h?"translate(2px,-2px)":"none", transition:"all .2s" }}>↗</span>
        </div>
        {/* Document format */}
        <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, color:T.muted, lineHeight:1.8 }}>
          <div><span style={{ color:T.muted }}>page_content</span><span style={{ color:T.faint }}>=</span><span style={{ color:T.teal }}>"{title}"</span></div>
          <div><span style={{ color:T.muted }}>metadata</span><span style={{ color:T.faint }}>=</span><span style={{ color:T.faint }}>{'{'}</span></div>
          <div style={{ paddingLeft:12 }}><span style={{ color:T.muted }}>source</span>: <span style={{ color:T.teal }}>"{issuer}"</span>,</div>
          <div style={{ paddingLeft:12 }}><span style={{ color:T.muted }}>valid</span>: <span style={{ color:color }}>"{valid}"</span>,</div>
          <div style={{ paddingLeft:12 }}><span style={{ color:T.muted }}>level</span>: <span style={{ color:T.amber }}>"{level}"</span>,</div>
          <div style={{ paddingLeft:12 }}><span style={{ color:T.muted }}>status</span>: <span style={{ color:T.teal }}>"✔ ACTIVE"</span></div>
          <div><span style={{ color:T.faint }}>{'}'}</span></div>
        </div>
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTACT — chain.invoke("hire")
═══════════════════════════════════════════════════════════════ */
function Contact() {
  const ref = useReveal();
  const [streaming, setStreaming] = useState(false);
  const [streamed, setStreamed]   = useState([]);
  const RESPONSE = [
    { t:0,    text:"Initialising hire_chain ..." },
    { t:500,  text:"✔ profile loaded: gulbadin-hasan" },
    { t:900,  text:"✔ availability: Immediate" },
    { t:1200, text:"✔ mode: Remote or Hybrid" },
    { t:1500, text:"✔ contact: gulbadinhasan1@gmail.com" },
    { t:1800, text:"✔ linkedin: linkedin.com/in/gulbadin-hasan" },
    { t:2100, text:"" },
    { t:2200, text:"chain complete. Ready to connect." },
  ];

  const runStream = () => {
    if (streaming) return;
    setStreaming(true);
    setStreamed([]);
    RESPONSE.forEach(r => {
      setTimeout(() => setStreamed(prev => [...prev, r.text]), r.t);
    });
    setTimeout(() => setStreaming(false), 2800);
  };

  return (
    <section id="contact" style={{ padding:"120px 60px", background:T.bg, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, background:`radial-gradient(circle,${T.teal3} 0%,transparent 70%)`, pointerEvents:"none" }} />
      <div ref={ref} className="rv" style={{ position:"relative", zIndex:1, maxWidth:700, margin:"0 auto" }}>
        <SecLabel num="06" text="chain.invoke" />
        <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:.92, letterSpacing:"-.03em", marginBottom:24 }}>
          Let's build<br /><span style={{ color:T.teal }}>something.</span>
        </h2>
        <p style={{ fontSize:15, color:T.muted, lineHeight:1.8, marginBottom:48, maxWidth:480, fontWeight:300 }}>
          Open to Lead DevOps · Principal Engineer · Platform Engineering · Cloud Architecture roles.
        </p>

        {/* invoke block */}
        <div style={{ background:T.surface, border:`1px solid ${T.faint}`, borderRadius:10, overflow:"hidden", marginBottom:32 }}>
          <div style={{ padding:"10px 16px", borderBottom:`1px solid ${T.faint}`, background:T.chain, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.muted }}>hire_chain.invoke({"{"}"input": "connect with gulbadin"{"}"})</span>
            <button onClick={runStream} data-hover
              style={{ padding:"4px 14px", background:`${T.teal}12`, border:`1px solid ${T.teal}30`, borderRadius:4, fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.teal, cursor:"none", transition:"all .2s" }}
            >▶ run</button>
          </div>
          <div style={{ padding:"16px 20px", minHeight:140, fontFamily:"'Geist Mono',monospace", fontSize:12 }}>
            {streamed.length === 0 && !streaming && (
              <span style={{ color:T.faint }}>// click run to invoke the chain</span>
            )}
            {streamed.map((line, i) => (
              <div key={i} style={{ color:line.startsWith("✔")?T.teal:line.startsWith("chain")?T.text:T.muted, marginBottom:4, animation:"fadeUp .25s ease" }}>{line || " "}</div>
            ))}
            {streaming && streamed.length < RESPONSE.length && (
              <span style={{ display:"inline-block", width:7, height:12, background:T.teal, verticalAlign:"middle", animation:"blink .8s step-end infinite" }} />
            )}
          </div>
        </div>

        {/* links */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
          {[
            { label:"send mail",   href:"mailto:gulbadinhasan1@gmail.com" },
            { label:"linkedin",    href:"https://linkedin.com/in/gulbadinhasan" },
            { label:"github",   href:"https://github.com/gulbadinhasan" },
            { label:"resume",  href:"/portfolio/Gulbadin_Hasan_CV.pdf",}
          ].map(l => <ContactBtn key={l.label} {...l} />)}
        </div>
      </div>
    </section>
  );
}

function ContactBtn({ label, href }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding:"11px 22px", background:h?`${T.teal}12`:"transparent", border:`1px solid ${h?T.teal:T.faint}`, color:h?T.teal:T.muted, fontFamily:"'Geist Mono',monospace", fontSize:12, textDecoration:"none", cursor:"none", transition:"all .25s", borderRadius:6, letterSpacing:".05em" }}
    >{label}</a>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED — Section label
═══════════════════════════════════════════════════════════════ */
function SecLabel({ num, text }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
      <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.teal, letterSpacing:".15em" }}>0{num}.</span>
      <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.muted, letterSpacing:".1em" }}>{text}</span>
      <div style={{ height:1, width:40, background:`linear-gradient(90deg,${T.teal}30,transparent)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ padding:"22px 60px", borderTop:`1px solid ${T.faint}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:T.bg }}>
      <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.muted }}>
        <span style={{ color:T.teal }}>gulbadin hasan</span> · built with LangChain design system
      </div>
      <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:T.muted }}>
        <span style={{ color:T.teal }}>⬡</span> 2025 · GitHub Pages
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <GlobalStyle />
      <Cursor />
      <Nav />
      <Hero />
      <Impact />
      <Stack />
      <Experience />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
    </>
  );
}
