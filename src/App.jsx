import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const T = {
  bg:      "#04060f",
  bg2:     "#070b18",
  bg3:     "#0b1022",
  glass:   "rgba(11,16,34,0.6)",
  cyan:    "#00f0ff",
  cyan2:   "#00c4d4",
  green:   "#00ffa3",
  orange:  "#ff6b35",
  purple:  "#a855f7",
  text:    "#dde4f0",
  muted:   "#5a6a88",
  border:  "rgba(0,240,255,0.1)",
  glow:    "0 0 30px rgba(0,240,255,0.2)",
  glowLg:  "0 0 80px rgba(0,240,255,0.12)",
};

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Share+Tech+Mono&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: ${T.bg};
      color: ${T.text};
      font-family: 'DM Sans', sans-serif;
      overflow-x: hidden;
      cursor: none;
    }
    ::selection { background: rgba(0,240,255,0.2); color: ${T.cyan}; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: ${T.bg}; }
    ::-webkit-scrollbar-thumb { background: ${T.cyan}; border-radius: 2px; }

    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 0.4; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes scanline {
      0% { top: -10%; }
      100% { top: 110%; }
    }
    @keyframes blink {
      0%,100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes count-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes grid-fade {
      0%,100% { opacity: 0.03; }
      50% { opacity: 0.06; }
    }
    @keyframes orb-drift {
      0%   { transform: translate(0,0) scale(1); }
      33%  { transform: translate(30px,-20px) scale(1.05); }
      66%  { transform: translate(-20px,30px) scale(0.97); }
      100% { transform: translate(0,0) scale(1); }
    }
    .fade-up {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
    }
    .fade-up.in { opacity: 1; transform: translateY(0); }
    .fade-left {
      opacity: 0;
      transform: translateX(28px);
      transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
    }
    .fade-left.in { opacity: 1; transform: translateX(0); }
  `}</style>
);

/* ─── CUSTOM CURSOR ─────────────────────────────────────────── */
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);

  useEffect(() => {
    const move = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const over = (e) => { hovering.current = !!e.target.closest("a,button,[data-hover]"); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    let raf;
    const loop = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;
      if (dotRef.current) {
        dotRef.current.style.left  = mouse.current.x + "px";
        dotRef.current.style.top   = mouse.current.y + "px";
        dotRef.current.style.transform = hovering.current
          ? "translate(-50%,-50%) scale(2.5)" : "translate(-50%,-50%) scale(1)";
        dotRef.current.style.background = hovering.current ? T.green : T.cyan;
      }
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + "px";
        ringRef.current.style.top  = ring.current.y + "px";
        ringRef.current.style.transform = hovering.current
          ? "translate(-50%,-50%) scale(1.5)" : "translate(-50%,-50%) scale(1)";
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); document.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: "fixed", width: 8, height: 8, borderRadius: "50%",
        background: T.cyan, pointerEvents: "none", zIndex: 9999,
        boxShadow: `0 0 10px ${T.cyan}`,
        transition: "transform 0.15s, background 0.2s",
      }} />
      <div ref={ringRef} style={{
        position: "fixed", width: 32, height: 32, borderRadius: "50%",
        border: `1px solid rgba(0,240,255,0.35)`, pointerEvents: "none", zIndex: 9998,
        transition: "transform 0.2s",
      }} />
    </>
  );
}

/* ─── PARTICLE CANVAS ───────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const N = 60;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,240,255,${p.alpha})`;
        ctx.fill();
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,240,255,${0.06 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ─── SCROLL REVEAL HOOK ─────────────────────────────────────── */
function useReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => el.classList.add("in"), delay);
        obs.unobserve(el);
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ─── ANIMATED COUNTER ──────────────────────────────────────── */
function Counter({ target, decimals = 0, duration = 1800 }) {
  const [val, setVal]   = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done) {
        setDone(true);
        const start = performance.now();
        const tick  = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(parseFloat((target * eased).toFixed(decimals)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, decimals, duration, done]);
  return <span ref={ref}>{val.toFixed(decimals)}</span>;
}

/* ─── GLASS CARD ─────────────────────────────────────────────── */
function GlassCard({ children, style = {}, hover = true, className = "" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: hov ? "rgba(0,240,255,0.04)" : T.glass,
        border: `1px solid ${hov ? "rgba(0,240,255,0.3)" : T.border}`,
        backdropFilter: "blur(20px)",
        borderRadius: 2,
        transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? T.glow : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── SECTION HEADER ─────────────────────────────────────────── */
function SectionHeader({ num, title }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="fade-up" style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 56 }}>
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: T.cyan, letterSpacing: "0.2em" }}>{num}</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${T.border}, transparent)` }} />
    </div>
  );
}

/* ─── NAV ────────────────────────────────────────────────────── */
const NAV_LINKS = ["Impact","Skills","Experience","Projects","Certifications","Contact"];

function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      padding: "0 60px",
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(4,6,15,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "none",
      transition: "all 0.4s",
    }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: T.cyan, letterSpacing: "0.1em" }}>
        <span style={{ color: T.muted }}>~/</span>gulbadin-hasan
      </div>
      <ul style={{ display: "flex", gap: 36, listStyle: "none" }}>
        {NAV_LINKS.map(l => (
          <li key={l}>
            <a
              href={`#${l.toLowerCase()}`}
              style={{
                fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
                color: active === l.toLowerCase() ? T.cyan : T.muted,
                textDecoration: "none", letterSpacing: "0.12em", textTransform: "uppercase",
                transition: "color 0.2s",
                borderBottom: active === l.toLowerCase() ? `1px solid ${T.cyan}` : "1px solid transparent",
                paddingBottom: 2,
              }}
            >{l}</a>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: T.green }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%", background: T.green,
          boxShadow: `0 0 8px ${T.green}`,
          animation: "pulse-ring 2s ease-out infinite",
        }} />
        Available for roles
      </div>
    </nav>
  );
}

/* ─── HERO ───────────────────────────────────────────────────── */
function Hero() {
  const [typed, setTyped] = useState("");
  const full = "Infrastructure & Automation Architect";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTyped(full.slice(0, ++i));
      if (i >= full.length) clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 60px 80px", position: "relative", overflow: "hidden",
    }}>
      {/* Animated grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        backgroundImage: `linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)",
        animation: "grid-fade 4s ease-in-out infinite",
      }} />

      {/* Floating orbs */}
      {[
        { w:500, h:500, t:"10%", l:"55%", c:"rgba(0,240,255,0.06)", d:"20s" },
        { w:300, h:300, t:"60%", l:"70%", c:"rgba(168,85,247,0.05)", d:"28s" },
        { w:200, h:200, t:"30%", l:"30%", c:"rgba(0,255,163,0.04)", d:"15s" },
      ].map((o,i) => (
        <div key={i} style={{
          position: "absolute", width: o.w, height: o.h,
          top: o.t, left: o.l, transform: "translate(-50%,-50%)",
          background: `radial-gradient(circle, ${o.c} 0%, transparent 70%)`,
          borderRadius: "50%", pointerEvents: "none", zIndex: 1,
          animation: `orb-drift ${o.d} ease-in-out infinite`,
        }} />
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 900 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          fontFamily: "'Share Tech Mono', monospace", fontSize: 12,
          color: T.cyan, letterSpacing: "0.2em", textTransform: "uppercase",
          marginBottom: 28, opacity: 0, animation: "count-up 0.6s 0.1s forwards",
        }}>
          <div style={{ width: 40, height: 1, background: T.cyan }} />
          Lead DevOps Engineer
          <div style={{
            padding: "3px 10px", border: `1px solid rgba(0,255,163,0.3)`,
            color: T.green, fontSize: 10, letterSpacing: "0.15em",
          }}>AVAILABLE</div>
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(64px,10vw,120px)",
          fontWeight: 800, lineHeight: 0.92,
          letterSpacing: "-0.03em",
          marginBottom: 20,
          opacity: 0, animation: "count-up 0.8s 0.3s forwards",
        }}>
          Gulbadin<br />
          <span style={{
            background: `linear-gradient(135deg, ${T.cyan}, ${T.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Hasan.</span>
        </h1>

        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "clamp(14px,2vw,18px)", color: T.muted,
          marginBottom: 32, height: 28,
          opacity: 0, animation: "count-up 0.7s 0.55s forwards",
        }}>
          <span style={{ color: T.cyan }}>&gt; </span>{typed}
          <span style={{ animation: "blink 1s step-end infinite", color: T.cyan }}>_</span>
        </div>

        <p style={{
          fontSize: 16, color: T.muted, lineHeight: 1.9, maxWidth: 520,
          marginBottom: 52, fontWeight: 300,
          opacity: 0, animation: "count-up 0.7s 0.75s forwards",
        }}>
          Building resilient, scalable infrastructure at the intersection of development and operations. Turning complex systems into elegant, automated pipelines since 2013.
        </p>

        <div style={{
          display: "flex", gap: 16, flexWrap: "wrap",
          opacity: 0, animation: "count-up 0.7s 0.95s forwards",
        }}>
          <HeroBtn href="#impact" primary>View My Impact</HeroBtn>
          <HeroBtn href="#contact">Get in Touch</HeroBtn>
        </div>
      </div>

      {/* Right stats */}
      <div style={{
        position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 32, zIndex: 2,
        opacity: 0, animation: "count-up 0.9s 1.1s forwards",
      }}>
        {[
          { n: "10+", l: "Years Exp" },
          { n: "99.9%", l: "Uptime SLA" },
          { n: "8", l: "Certs" },
        ].map(s => (
          <div key={s.l} style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: 44, fontWeight: 800,
              color: T.cyan, lineHeight: 1,
              textShadow: `0 0 30px rgba(0,240,255,0.4)`,
            }}>{s.n}</div>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: 10,
              color: T.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4,
            }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2,
        animation: "float 3s ease-in-out infinite",
      }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: T.muted, letterSpacing: "0.15em" }}>SCROLL</div>
        <div style={{ width: 1, height: 40, background: `linear-gradient(${T.cyan}, transparent)` }} />
      </div>
    </section>
  );
}

function HeroBtn({ href, primary, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "14px 36px",
        background: primary
          ? (hov ? T.cyan : "transparent")
          : "transparent",
        border: `1px solid ${primary ? T.cyan : T.border}`,
        color: primary ? (hov ? T.bg : T.cyan) : (hov ? T.text : T.muted),
        fontFamily: "'Share Tech Mono', monospace", fontSize: 12,
        letterSpacing: "0.1em", textTransform: "uppercase",
        textDecoration: "none", cursor: "none",
        transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
        boxShadow: primary && hov ? T.glow : "none",
      }}
    >{children}</a>
  );
}

/* ─── IMPACT ─────────────────────────────────────────────────── */
const KPIS = [
  { target: 420, suffix: "K", label: "Annual Cloud Savings", ctx: "FinOps automation", color: T.green },
  { target: 40,  suffix: "%", label: "Infra Cost Reduction", ctx: "on-prem → EKS",    color: T.cyan  },
  { target: 10,  suffix: "×", label: "Deploy Frequency",     ctx: "monthly → daily", color: T.purple},
  { target: 99.99, suffix: "%", dec: 2, label: "Platform Uptime", ctx: "multi-cloud DR", color: T.orange},
  { target: 80,  suffix: "%", label: "Error Reduction",      ctx: "auto provisioning",color: T.cyan  },
  { target: 18,  suffix: "m", label: "Env Setup Time",       ctx: "was multiple days",color: T.green },
  { target: 60,  suffix: "%", label: "CI/CD Speedup",        ctx: "parallel + caching",color: T.purple},
  { target: 150, suffix: "+", label: "Engineers Empowered",  ctx: "self-service platform",color: T.orange},
];

const PILLARS = [
  { icon: "💸", cat: "Cost & Efficiency", title: "Financial Impact", color: T.green, items: [
    <><strong>$420K annual savings</strong> via FinOps automation suite — right-sized instances, auto-scheduled non-prod workloads.</>,
    <>Reduced infra spend by <strong>40%</strong> through on-prem to EKS migration with reserved instance planning.</>,
    <>Cut CI/CD runtime by <strong>60%</strong> — thousands of engineering hours saved annually.</>,
  ]},
  { icon: "🚀", cat: "Velocity & Delivery", title: "Developer Productivity", color: T.cyan, items: [
    <>Transformed releases from <strong>monthly to daily</strong> via GitOps and ArgoCD across 200+ services.</>,
    <>Built an <strong>Internal Developer Platform</strong> — environment setup from days down to 18 minutes for 150+ engineers.</>,
    <>Eliminated on-call toil with <strong>automated drift detection</strong> and self-healing across the fleet.</>,
  ]},
  { icon: "🛡️", cat: "Reliability & Resilience", title: "Platform Stability", color: T.orange, items: [
    <>Architected <strong>multi-cloud DR</strong> at 99.99% uptime — RTO &lt; 15 min, RPO &lt; 5 min, tested every 24 hrs.</>,
    <>Reduced deployment incidents by <strong>80%</strong> replacing error-prone manual runbooks with automation.</>,
    <>Achieved <strong>SOC2 compliance</strong> via zero-trust posture and Vault-based secrets — zero critical findings.</>,
  ]},
  { icon: "👥", cat: "Leadership & Culture", title: "Team & Org Growth", color: T.purple, items: [
    <>Mentored <strong>6 engineers</strong> to mid/senior level — 2 promoted to lead roles within 18 months.</>,
    <>Founded <strong>DevOps Centre of Excellence</strong> — 20+ engineer guild, reducing knowledge silos across 4 teams.</>,
    <>Authored <strong>company-wide IaC standards</strong> — adopted by 4 product teams, cutting incident resolution by 35%.</>,
  ]},
];

function Impact() {
  return (
    <section id="impact" style={{ padding: "100px 60px", background: T.bg2, position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80%", height: 1,
        background: `linear-gradient(90deg, transparent, ${T.cyan}, transparent)`,
        opacity: 0.3,
      }} />

      <SectionHeader num="01." title="Key Impact" />

      <div style={{
        fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
        color: T.muted, maxWidth: 600, lineHeight: 1.8,
        borderLeft: `2px solid ${T.cyan}`, paddingLeft: 20,
        marginBottom: 72,
      }}>
        Beyond shipping features and maintaining pipelines — measurable business value delivered across organisations. Every number has a story.
      </div>

      {/* KPI Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 2, marginBottom: 72,
      }}>
        {KPIS.map((k, i) => <KpiCard key={i} {...k} delay={i * 60} />)}
      </div>

      {/* Pillar Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {PILLARS.map((p, i) => <PillarCard key={i} {...p} delay={i * 80} />)}
      </div>
    </section>
  );
}

function KpiCard({ target, suffix, dec = 0, label, ctx, color, delay }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="fade-up">
      <GlassCard style={{ padding: "32px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.5,
        }} />
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px,4vw,52px)",
          fontWeight: 800, color, lineHeight: 1, marginBottom: 10,
          textShadow: `0 0 30px ${color}40`,
        }}>
          <Counter target={target} decimals={dec} />{suffix}
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: T.muted, letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1.6 }}>{label}</div>
        <div style={{ fontSize: 11, color: "rgba(90,106,136,0.6)", marginTop: 6, fontFamily: "'Share Tech Mono', monospace" }}>{ctx}</div>
      </GlassCard>
    </div>
  );
}

function PillarCard({ icon, cat, title, color, items, delay }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="fade-up">
      <GlassCard style={{ padding: "32px", height: "100%", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          opacity: 0.6,
        }} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, flexShrink: 0, fontSize: 22,
            background: `${color}12`, border: `1px solid ${color}30`,
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          }}>{icon}</div>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{cat}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700 }}>{title}</div>
          </div>
        </div>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 12, fontSize: 13, color: T.muted, lineHeight: 1.7 }}>
              <span style={{ color, flexShrink: 0, marginTop: 2, fontSize: 11 }}>▸</span>
              <span style={{ "--strong-color": T.text }}>{item}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

/* ─── SKILLS ─────────────────────────────────────────────────── */
const SKILL_CATS = [
  { icon: "☁️", title: "Cloud Platforms",        tags: ["AWS","GCP","Azure","CloudFront","Route53","IAM","EKS","ECS"] },
  { icon: "⚙️", title: "Container & Orchestration",tags: ["Kubernetes","Docker","Helm","Istio","ArgoCD","Kustomize","Flux"] },
  { icon: "🔧", title: "IaC & Automation",        tags: ["Terraform","Ansible","Pulumi","CDK","CloudFormation","Packer"] },
  { icon: "🚀", title: "CI/CD Pipelines",          tags: ["GitHub Actions","GitLab CI","Jenkins","CircleCI","Spinnaker","Tekton"] },
  { icon: "📊", title: "Observability",            tags: ["Prometheus","Grafana","ELK Stack","Datadog","Jaeger","PagerDuty"] },
  { icon: "🔐", title: "Security & Networking",   tags: ["Vault","OPA","Falco","Zero Trust","SAST/DAST","Trivy","Cilium"] },
];

function Skills() {
  return (
    <section id="skills" style={{ padding: "100px 60px", background: T.bg }}>
      <SectionHeader num="02." title="Technical Arsenal" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
        {SKILL_CATS.map((c, i) => <SkillCard key={i} {...c} delay={i * 70} />)}
      </div>
    </section>
  );
}

function SkillCard({ icon, title, tags, delay }) {
  const ref = useReveal(delay);
  const [hovTag, setHovTag] = useState(null);
  return (
    <div ref={ref} className="fade-up">
      <GlassCard style={{ padding: 32, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${T.cyan}, transparent)`, opacity: 0.3 }} />
        <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: T.cyan, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>{title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.map(t => (
            <span key={t}
              onMouseEnter={() => setHovTag(t)}
              onMouseLeave={() => setHovTag(null)}
              style={{
                fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
                padding: "5px 12px",
                border: `1px solid ${hovTag === t ? T.cyan : T.border}`,
                color: hovTag === t ? T.cyan : T.muted,
                background: hovTag === t ? "rgba(0,240,255,0.06)" : "transparent",
                letterSpacing: "0.06em",
                transition: "all 0.2s", cursor: "none",
              }}
            >{t}</span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ─── EXPERIENCE ─────────────────────────────────────────────── */
const JOBS = [
  { period: "Jun 2024 — Oct 2025", role: "Lead DevOps Engineer", company: "9YT", loc: "Remote",
    desc: "Architected and led migration of 200+ microservices from on-prem to EKS, achieving 40% cost reduction and improving deployment frequency from monthly to daily. Built an internal platform serving 150+ engineers, reducing environment setup time from days to 18 minutes.",
    tags: ["AWS EKS","Terraform","ArgoCD","Istio","Grafana","Backstage"] },
  { period: "Apr 2023 — Jun 2024", role: "Senior Cloud Infrastucture Engineer", company: "Arkose Labs", loc: "Pune, India",
    desc: "Architected and led migration of 200+ microservices from on-prem to EKS, achieving 40% cost reduction and improving deployment frequency from monthly to daily. Built an internal platform serving 150+ engineers, reducing environment setup time from days to 18 minutes.",
    tags: ["AWS EKS","Terraform","ArgoCD","Istio","Grafana","Backstage"] },
  { period: "Dec 2020 — Apr 2023", role: "Technical Lead", company: "Incedo Inc.", loc: "Pune, India",
    desc: "Architected and led migration of 200+ microservices from on-prem to EKS, achieving 40% cost reduction and improving deployment frequency from monthly to daily. Built an internal platform serving 150+ engineers, reducing environment setup time from days to 18 minutes.",
    tags: ["AWS EKS","Terraform","ArgoCD","Istio","Grafana","Backstage"] },
  { period: "May 2019 — Dec 2020", role: "Data Engineer", company: "DataStream Inc", loc: "Pune, India",
    desc: "Designed multi-cloud disaster recovery system achieving 99.99% uptime. Reduced CI/CD pipeline run time by 60% through parallel testing and intelligent caching. Mentored a team of 6 junior engineers.",
    tags: ["GCP","Kubernetes","Jenkins","Vault","Ansible"] },
  { period: "July 2016 — May 2019", role: "Sr Systems Engineer", company: "CloudBridge LLC", loc: "Nagpur, India",
    desc: "Built foundational CI/CD infrastructure from scratch using GitLab and Docker. Automated server provisioning with Ansible, reducing deployment errors by 80%. Implemented ELK stack for centralised logging across 50+ services.",
    tags: ["Docker","GitLab CI","Ansible","ELK Stack"] },
  { period: "Jan 2014 — July 2016", role: "Sr Systems Engineer", company: "NetSphere Corp", loc: "Pune, India",
    desc: "Managed hybrid infrastructure for 1000+ user enterprise. Automated routine maintenance with Bash and Python scripts, reclaiming 15+ hours of manual work per week.",
    tags: ["Linux","Bash","Python","VMware"] },
];

function Experience() {
  return (
    <section id="experience" style={{ padding: "100px 60px", background: T.bg2 }}>
      <SectionHeader num="03." title="Experience" />
      <div style={{ position: "relative", paddingLeft: 48 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, ${T.cyan}, transparent)` }} />
        {JOBS.map((j, i) => <JobCard key={i} {...j} delay={i * 100} />)}
      </div>
    </section>
  );
}

function JobCard({ period, role, company, loc, desc, tags, delay }) {
  const ref = useReveal(delay);
  return (
    <div ref={ref} className="fade-up" style={{ position: "relative", paddingBottom: 52 }}>
      <div style={{
        position: "absolute", left: -52, top: 6,
        width: 10, height: 10, borderRadius: "50%",
        background: T.cyan, boxShadow: `0 0 16px ${T.cyan}`,
      }}>
        <div style={{
          position: "absolute", inset: -5, borderRadius: "50%",
          border: `1px solid rgba(0,240,255,0.25)`,
          animation: "pulse-ring 3s ease-out infinite",
        }} />
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: T.cyan, letterSpacing: "0.15em", marginBottom: 10 }}>{period}</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{role}</div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: T.muted, marginBottom: 16 }}>
        {company} <span style={{ color: T.orange }}>// {loc}</span>
      </div>
      <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, maxWidth: 640, marginBottom: 16 }}>{desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map(t => (
          <span key={t} style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: 10,
            padding: "4px 10px",
            background: "rgba(0,240,255,0.06)", border: `1px solid rgba(0,240,255,0.15)`,
            color: T.cyan, letterSpacing: "0.1em",
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── PROJECTS ───────────────────────────────────────────────── */
const PROJECTS = [
  { num: "01", title: "GitOps Platform @ Scale", metric: "↓ 40% cost · ↑ 10× deploy freq",
    desc: "End-to-end GitOps implementation for 200+ services using ArgoCD and Flux. Single source of truth with automated drift detection and self-healing infrastructure.",
    stack: ["ArgoCD","Flux","Helm","AWS EKS","Terraform"], color: T.cyan },
  { num: "02", title: "Zero-Downtime Multi-Cloud DR", metric: "99.99% uptime · RTO < 15 min",
    desc: "Cross-cloud disaster recovery spanning AWS and GCP. Automated failover testing every 24 hours with full traffic replay ensuring true RPO < 5 min.",
    stack: ["AWS","GCP","Terraform","Consul","Python"], color: T.green },
  { num: "03", title: "Internal Developer Platform", metric: "Setup: Days → 18 minutes",
    desc: "Self-service platform enabling 150+ engineers to provision environments on demand. Backstage catalog, automated TLS, DNS, RBAC, integrated with Slack and Jira.",
    stack: ["Backstage","Kubernetes","Vault","Crossplane","Go"], color: T.purple },
  { num: "04", title: "FinOps Automation Suite", metric: "$420K annual cloud savings",
    desc: "Cloud cost optimisation engine using Lambda and Step Functions to auto-schedule non-production workloads and generate executive reports.",
    stack: ["AWS Lambda","Python","Step Functions","CloudWatch"], color: T.orange },
];

function Projects() {
  return (
    <section id="projects" style={{ padding: "100px 60px", background: T.bg }}>
      <SectionHeader num="04." title="Key Projects" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
        {PROJECTS.map((p, i) => <ProjectCard key={i} {...p} delay={i * 80} />)}
      </div>
    </section>
  );
}

function ProjectCard({ num, title, desc, metric, stack, color, delay }) {
  const ref = useReveal(delay);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} className="fade-up">
      <GlassCard
        hover={false}
        style={{
          padding: 32, height: "100%", position: "relative", overflow: "hidden",
          transform: hov ? "translateY(-5px)" : "translateY(0)",
          borderColor: hov ? `${color}50` : T.border,
          boxShadow: hov ? `0 0 40px ${color}18` : "none",
          transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          transform: hov ? "scaleX(1)" : "scaleX(0.3)",
          transformOrigin: "left",
          transition: "transform 0.4s",
        }} />
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: T.muted, letterSpacing: "0.15em", marginBottom: 14 }}>// PROJECT_{num}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 12, color: hov ? color : T.text, transition: "color 0.2s" }}>{title}</div>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.75, marginBottom: 16 }}>{desc}</p>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
          color: T.green, padding: "5px 12px",
          background: "rgba(0,255,163,0.06)", border: "1px solid rgba(0,255,163,0.2)",
          display: "inline-block", marginBottom: 20,
        }}>{metric}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {stack.map(t => (
            <span key={t} style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: 10,
              padding: "4px 10px", border: `1px solid ${T.border}`, color: T.muted,
            }}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}`, display: "flex", gap: 16 }}>
          <a href="https://github.com/gulbadinhasan" target="_blank" rel="noopener"
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: T.muted, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = color}
            onMouseLeave={e => e.target.style.color = T.muted}
          >↗ GitHub</a>
        </div>
      </GlassCard>
    </div>
  );
}

/* ─── CERTIFICATIONS ─────────────────────────────────────────── */
const CERTS = [
  { icon:"☁️", authority:"Amazon Web Services", name:"AWS Certified Solutions Architect — Professional", year:2023, status:"Active", url:"https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
  { icon:"🚀", authority:"Amazon Web Services", name:"AWS Certified DevOps Engineer — Professional", year:2022, status:"Active", url:"https://aws.amazon.com/certification/certified-devops-engineer-professional/" },
  { icon:"⚙️", authority:"CNCF / Linux Foundation", name:"Certified Kubernetes Administrator (CKA)", year:2023, status:"Active", url:"https://www.cncf.io/certification/cka/" },
  { icon:"🛠️", authority:"CNCF / Linux Foundation", name:"Certified Kubernetes App Developer (CKAD)", year:2022, status:"Active", url:"https://www.cncf.io/certification/ckad/" },
  { icon:"🌐", authority:"Google Cloud", name:"Professional Cloud DevOps Engineer", year:2022, status:"Active", url:"https://cloud.google.com/certification/cloud-devops-engineer" },
  { icon:"🔧", authority:"HashiCorp", name:"HashiCorp Certified: Terraform Associate", year:2023, status:"Active", url:"https://www.hashicorp.com/certification/terraform-associate" },
  { icon:"🎩", authority:"Red Hat", name:"Red Hat Certified Engineer (RHCE)", year:2020, status:"Pro", url:"https://www.redhat.com/en/services/certification/rhce" },
  { icon:"🪟", authority:"Microsoft Azure", name:"Azure DevOps Engineer Expert (AZ-400)", year:2021, status:"Active", url:"https://learn.microsoft.com/en-us/certifications/devops-engineer/" },
];

function Certifications() {
  return (
    <section id="certifications" style={{ padding: "100px 60px", background: T.bg2 }}>
      <SectionHeader num="05." title="Certifications" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {CERTS.map((c, i) => <CertCard key={i} {...c} delay={i * 60} />)}
      </div>
    </section>
  );
}

function CertCard({ icon, authority, name, year, status, url, delay }) {
  const ref = useReveal(delay);
  const [hov, setHov] = useState(false);
  const isActive = status === "Active";
  return (
    <div ref={ref} className="fade-up">
      <a href={url} target="_blank" rel="noopener"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "flex", flexDirection: "column", gap: 16, padding: 28,
          background: hov ? "rgba(0,240,255,0.04)" : T.glass,
          border: `1px solid ${hov ? T.cyan : T.border}`,
          backdropFilter: "blur(20px)",
          borderRadius: 2,
          textDecoration: "none", color: "inherit",
          transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
          transform: hov ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hov ? T.glow : "none",
          position: "relative", overflow: "hidden",
          cursor: "none",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${T.cyan}, transparent)`,
          opacity: hov ? 0.5 : 0,
          transition: "opacity 0.3s",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            width: 48, height: 48, fontSize: 22,
            background: "rgba(0,240,255,0.07)", border: `1px solid ${T.border}`,
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          }}>{icon}</div>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: 18,
            color: hov ? T.cyan : T.muted,
            transform: hov ? "translate(3px,-3px)" : "none",
            transition: "all 0.2s",
          }}>↗</span>
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: T.cyan, letterSpacing: "0.15em", textTransform: "uppercase" }}>{authority}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: T.muted }}>{year}</span>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: 10,
            padding: "3px 10px", letterSpacing: "0.1em",
            color: isActive ? T.green : T.orange,
            background: isActive ? "rgba(0,255,163,0.08)" : "rgba(255,107,53,0.08)",
            border: `1px solid ${isActive ? "rgba(0,255,163,0.25)" : "rgba(255,107,53,0.25)"}`,
          }}>{status}</span>
        </div>
      </a>
    </div>
  );
}

/* ─── CONTACT ────────────────────────────────────────────────── */
const LINKS = [
  { label: "Email",    href: "mailto:gulbadinhasan1@gmail.com",           icon: "✉" },
  { label: "LinkedIn", href: "https://linkedin.com/in/gulbadinhasan",     icon: "in" },
  { label: "GitHub",   href: "https://github.com/gulbadinhasan",          icon: "gh" },
  { label: "Resume",   href: "/resume.pdf",                               icon: "↓" },
];

function Contact() {
  const ref = useReveal();
  return (
    <section id="contact" style={{ padding: "120px 60px", background: T.bg, textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 600,
        background: `radial-gradient(circle, rgba(0,240,255,0.05) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div ref={ref} className="fade-up" style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: T.cyan, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ width: 30, height: 1, background: T.cyan }} />
          06. Contact
          <div style={{ width: 30, height: 1, background: T.cyan }} />
        </div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(44px,7vw,88px)",
          fontWeight: 800, lineHeight: 0.92,
          letterSpacing: "-0.03em", marginBottom: 28,
        }}>
          Let's Build<br />
          <span style={{
            background: `linear-gradient(135deg, ${T.cyan}, ${T.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Something.</span>
        </h2>
        <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.8, marginBottom: 52 }}>
          Open to senior / lead DevOps roles, infrastructure consulting, and speaking opportunities. Let's connect and build reliable systems at scale.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          {LINKS.map(l => <ContactLink key={l.label} {...l} />)}
        </div>
      </div>
    </section>
  );
}

function ContactLink({ label, href, icon }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target={href.startsWith("mailto") || href.endsWith(".pdf") ? undefined : "_blank"} rel="noopener"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 28px",
        border: `1px solid ${hov ? T.cyan : T.border}`,
        color: hov ? T.cyan : T.muted,
        background: hov ? "rgba(0,240,255,0.05)" : "transparent",
        fontFamily: "'Share Tech Mono', monospace", fontSize: 12,
        letterSpacing: "0.1em", textTransform: "uppercase",
        textDecoration: "none", cursor: "none",
        transition: "all 0.3s", boxShadow: hov ? T.glow : "none",
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </a>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      padding: "24px 60px",
      borderTop: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: T.bg,
    }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: T.muted }}>
        <span style={{ color: T.cyan }}>Gulbadin Hasan</span> · Lead DevOps Engineer · Built with React
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: T.muted }}>
        <span style={{ color: T.cyan }}>©</span> 2025 · Hosted on GitHub Pages
      </div>
    </footer>
  );
}

/* ─── SCANLINE OVERLAY ───────────────────────────────────────── */
function Scanline() {
  return (
    <>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 998,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px)",
      }} />
      <div style={{
        position: "fixed", left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.08), transparent)",
        pointerEvents: "none", zIndex: 997,
        animation: "scanline 8s linear infinite",
      }} />
    </>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────── */
export default function App() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActiveSection(e.target.id);
      });
    }, { threshold: 0.4 });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Cursor />
      <ParticleField />
      <Scanline />
      <Nav active={activeSection} />
      <Hero />
      <Impact />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Contact />
      <Footer />
    </>
  );
}