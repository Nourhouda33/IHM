import { useState, useEffect, useRef, useCallback } from "react";

/* ─── CONSTANTS ─────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const AUTH_TOKEN_KEY = "whisper_api_token_v1";
const AUTH_USER_KEY  = "whisper_user_v1";

/* ─── DESIGN TOKENS ─────────────────────────────────── */
const C = {
  ink:"#04091a",deep:"#070d20",navy:"#0b1530",mid:"#102050",steel:"#1a3580",
  azure:"#2757c8",sky:"#4d89f5",mist:"#8ab6fa",ghost:"#c4dafc",chalk:"#e8f2ff",
  gold:"#e8c44a",goldDim:"#b89a2d",
  glass:"rgba(11,21,48,0.55)",glassBr:"rgba(255,255,255,0.04)",
  lBg:"#f0f2fa",lSurface:"#ffffff",lBorder:"rgba(39,87,200,0.12)",
  lText:"#0d1b3e",lTextMid:"#3a5080",lTextSub:"#6b82b0",
  lBlue:"#2757c8",lBlueMid:"#4d89f5",lBlueSoft:"#e8f0fd",
  lGold:"#e8c44a",lShadow:"rgba(39,87,200,0.10)",lShadowHv:"rgba(39,87,200,0.18)",
};

/* ─── POSTS DATA ─────────────────────────────────────── */
const posts = [
  { id:1, topic:"Études",      user:"AnonStu22",    avatar:"A", text:"يخي فما شركة تقبل stagiaire مغير اكتاف ؟",                                    reactions:87,  shares:6,  comments:31 },
  { id:2, topic:"Technologie", user:"TechDev99",    avatar:"T", text:"كيفاه تتعلم بيراتاج… لينك في أول كومنتار 👇",                                  reactions:204, shares:44, comments:78 },
  { id:3, topic:"Santé",       user:"AnonymeSanté", avatar:"S", text:"ماعاش نحب الخروج مالدار و نحس عندي رهاب اجتماعي… شنعمل؟",                     reactions:312, shares:29, comments:95 },
  { id:4, topic:"Loi & Droit", user:"LegalAnon",    avatar:"L", text:"السلام عليكم أنا مخطوبة من 2009 لتو لاعرسنا نحب نشكي بيه...",                 reactions:156, shares:18, comments:62 },
];

/* ─── LOGO ───────────────────────────────────────────── */
function HkeyaLogo({ size = 40, dark = false }) {
  const c1 = dark ? C.ghost : "#4d89f5";
  const c2 = dark ? C.sky   : "#2757c8";
  const c3 = dark ? C.gold  : "#e8c44a";
  const id = dark ? "dark"  : "light";
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <defs>
        <linearGradient id={`logoG${id}`} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={c1}/>
          <stop offset="55%"  stopColor={c2}/>
          <stop offset="100%" stopColor={c3}/>
        </linearGradient>
        <radialGradient id={`keyGlow${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={c3} stopOpacity="0.35"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <path d="M10 30 C10 16 20 8 28 8 C36 8 46 16 46 30 L10 30 Z" fill={`url(#logoG${id})`} opacity="0.92"/>
      <circle cx="28" cy="22" r="5" fill={dark ? C.ink : "#fff"} opacity="0.85"/>
      <path d="M25 25 L25 31 L31 31 L31 25" fill={dark ? C.ink : "#fff"} opacity="0.85"/>
      <line x1="28" y1="30" x2="28" y2="46" stroke={`url(#logoG${id})`} strokeWidth="3" strokeLinecap="round"/>
      <line x1="28" y1="38" x2="33" y2="38" stroke={`url(#logoG${id})`} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="43" x2="32" y2="43" stroke={`url(#logoG${id})`} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="43" cy="12" r="4.5" fill={c3} opacity="0.9"/>
      <circle cx="43" cy="12" r="7"   fill={`url(#keyGlow${id})`}/>
    </svg>
  );
}

/* ─── PARTICLE CANVAS ───────────────────────────────── */
function ParticleCanvas({ density = 40, light = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
    };
    resize();
    const ps = Array.from({ length: density }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*2.5+0.8,
      vx: (Math.random()-0.5)*0.15, vy: (Math.random()-0.5)*0.15,
      alpha: Math.random()*0.4+0.08, ph: Math.random()*Math.PI*2,
      color: Math.random()>0.7 ? "#e8c44a" : "#4d89f5",
    }));
    let raf, t = 0;
    const draw = () => {
      t += 0.008; ctx.clearRect(0,0,W,H);
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x=W; if (p.x>W) p.x=0;
        if (p.y<0) p.y=H; if (p.y>H) p.y=0;
        const a = p.alpha*(0.6+Math.sin(t+p.ph)*0.4);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = light
          ? p.color==="#e8c44a" ? `rgba(232,196,74,${a*0.7})` : `rgba(77,137,245,${a*0.5})`
          : `rgba(77,137,245,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density, light]);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity: light ? 0.7 : 0.5 }}/>;
}

/* ─── FLOATING POST CARD ─────────────────────────────── */
function FloatingCard({ post, style, rev, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const topicColors = {
    "Études":      { bg:"#e8f0fd", border:"rgba(77,137,245,0.3)",  text:"#2757c8" },
    "Technologie": { bg:"#e8f0fd", border:"rgba(39,87,200,0.25)",  text:"#1a3580" },
    "Santé":       { bg:"#f0f7ff", border:"rgba(138,182,250,0.3)", text:"#3a5080" },
    "Loi & Droit": { bg:"#fdf8e8", border:"rgba(232,196,74,0.35)", text:"#8a6a00" },
  };
  const tc = topicColors[post.topic] || topicColors["Études"];
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      position:"absolute", background:"#fff", borderRadius:20, width:195,
      border:`1px solid ${hov ? "rgba(77,137,245,0.25)" : "rgba(39,87,200,0.1)"}`,
      boxShadow: hov
        ? "0 20px 60px rgba(39,87,200,0.16), 0 4px 16px rgba(0,0,0,0.08)"
        : "0 8px 32px rgba(39,87,200,0.10), 0 2px 8px rgba(0,0,0,0.05)",
      padding:"11px 13px 10px", backdropFilter:"blur(6px)",
      opacity: rev ? 1 : 0,
      transform: rev
        ? `translateY(${hov?-6:0}px) scale(${hov?1.03:1})`
        : "translateY(20px) scale(0.95)",
      transition:`all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, box-shadow 0.25s ease`,
      cursor:"default", ...style,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
        <div style={{
          width:26, height:26, borderRadius:"50%", flexShrink:0,
          background:"linear-gradient(135deg,#4d89f5,#2757c8)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:11, fontWeight:700, color:"#fff", fontFamily:"monospace",
        }}>{post.avatar}</div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:C.lText, letterSpacing:0.1 }}>{post.user}</div>
          <span style={{
            fontSize:8.5, padding:"1.5px 6px", borderRadius:99,
            background:tc.bg, border:`1px solid ${tc.border}`,
            color:tc.text, fontWeight:700, letterSpacing:0.6,
            textTransform:"uppercase", fontFamily:"monospace",
          }}>{post.topic}</span>
        </div>
      </div>
      <p style={{
        color:C.lTextMid, fontSize:11, lineHeight:1.65, direction:"rtl",
        margin:"0 0 8px 0", fontFamily:"Georgia, serif",
        display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden",
      }}>{post.text}</p>
      <div style={{ display:"flex", alignItems:"center", gap:10, paddingTop:6, borderTop:"1px solid rgba(39,87,200,0.08)" }}>
        {[["👍",post.reactions],["💬",post.comments],["↩",post.shares]].map(([icon,n],i)=>(
          <span key={i} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:C.lTextSub, fontFamily:"monospace" }}>
            <span>{icon}</span><span>{n}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── TESTIMONIAL BUBBLE ─────────────────────────────── */
function TestimonialBubble({ text, style, rev, delay = 0 }) {
  return (
    <div style={{
      position:"absolute", background:"#fff", borderRadius:16,
      border:"1px solid rgba(39,87,200,0.10)",
      boxShadow:"0 8px 28px rgba(39,87,200,0.09)",
      padding:"12px 16px", maxWidth:210,
      opacity: rev ? 1 : 0,
      transform: rev ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
      transition:`all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>
      <p style={{ fontSize:12.5, color:C.lTextMid, lineHeight:1.65, fontFamily:"Georgia, serif", margin:0, fontStyle:"italic" }}>"{text}"</p>
    </div>
  );
}

/* ─── AVATAR STACK ───────────────────────────────────── */
function AvatarStack({ rev }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
      <div style={{
        opacity: rev ? 1 : 0, transform: rev ? "translateY(0)" : "translateY(8px)",
        transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 1.25s",
        fontSize:12.5, color:C.lTextSub, fontFamily:"Georgia, serif", textAlign:"center",
      }}>Rejoins des milliers d'utilisateurs qui partagent, écoutent et évoluent ensemble.</div>
    </div>
  );
}

/* ─── FOOTER ─────────────────────────────────────────── */
function Footer({ light = false }) {
  return (
    <div style={{
      position:"absolute", bottom:14, left:28, zIndex:80,
      fontSize:10, color: light ? C.lTextSub : C.steel, opacity:0.55,
      whiteSpace:"nowrap", letterSpacing:0.6, fontFamily:"Georgia, serif", pointerEvents:"none",
    }}>© 2026 Hkeya · Fait avec ❤️ en Tunisie</div>
  );
}

/* ─── HERO BUTTON ────────────────────────────────────── */
function HeroBtn({ label, onClick, primary = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      padding:"14px 32px", borderRadius:99, cursor:"pointer",
      fontSize:11.5, fontWeight:700, letterSpacing:1.6,
      textTransform:"uppercase", fontFamily:"monospace",
      background: primary
        ? (hov ? "linear-gradient(135deg,#4d89f5,#1a3580)" : "linear-gradient(135deg,#2757c8,#1a3580)")
        : "#fff",
      color: primary ? "#fff" : C.lBlue,
      border: primary ? "none" : "1.5px solid rgba(39,87,200,0.25)",
      boxShadow: primary
        ? (hov ? "0 8px 32px rgba(39,87,200,0.38)" : "0 4px 18px rgba(39,87,200,0.24)")
        : (hov ? "0 4px 18px rgba(39,87,200,0.14)" : "0 2px 10px rgba(39,87,200,0.08)"),
      transform: hov ? "translateY(-2px)" : "none",
      transition:"all 0.22s ease",
    }}>{label}</button>
  );
}

/* ════════════════════════════════════════════════════════
   PANEL 1 — LIGHT HERO
════════════════════════════════════════════════════════ */
function HeroPanel({ isActive, onSignIn, onSignUp }) {
  const [rev, setRev] = useState(false);
  useEffect(() => {
    if (isActive) { const t = setTimeout(()=>setRev(true), 80); return ()=>clearTimeout(t); }
    setRev(false);
  }, [isActive]);

  return (
    <div style={{
      width:"100vw", height:"100vh", position:"relative", flexShrink:0,
      overflow:"hidden",
      background:"radial-gradient(ellipse at 50% 0%, #dde8ff 0%, #eef1fb 40%, #f0f2fa 100%)",
    }}>
      <ParticleCanvas density={28} light/>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(39,87,200,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(39,87,200,0.045) 1px,transparent 1px)",
        backgroundSize:"70px 70px",
      }}/>
      <div style={{
        position:"absolute", top:"-15%", left:"50%", transform:"translateX(-50%)",
        width:700, height:400, borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(77,137,245,0.18) 0%,transparent 65%)",
        filter:"blur(40px)", pointerEvents:"none",
      }}/>

      {/* Floating Cards — poussées vers les bords */}
      <FloatingCard post={posts[0]} rev={rev} delay={0.5}  style={{ top:"6%",     left:"6%",   transform:"rotate(-5deg)" }}/>
      <FloatingCard post={posts[1]} rev={rev} delay={0.65} style={{ top:"5%",     right:"6%",  transform:"rotate(5deg)"  }}/>
      <FloatingCard post={posts[2]} rev={rev} delay={0.55} style={{ bottom:"8%",  left:"6%",   transform:"rotate(3deg)"  }}/>
      <FloatingCard post={posts[3]} rev={rev} delay={0.7}  style={{ bottom:"8%",  right:"6%",  transform:"rotate(-4deg)" }}/>

      {/* Decorative dots */}
      {[
        { top:"30%",    left:"28%",  color:"#4d89f5", size:8 },
        { top:"20%",    left:"36%",  color:"#e8c44a", size:6 },
        { top:"60%",    right:"25%", color:"#8ab6fa", size:7 },
        { top:"75%",    left:"40%",  color:"#e8c44a", size:5 },
        { top:"15%",    right:"30%", color:"#4d89f5", size:5 },
        { bottom:"35%", left:"22%",  color:"#c4dafc", size:8 },
        { bottom:"15%", right:"28%", color:"#4d89f5", size:6 },
        { top:"45%",    left:"33%",  color:"#ff7eb3", size:6 },
        { top:"55%",    right:"33%", color:"#4d89f5", size:5 },
      ].map((d,i)=>(
        <div key={i} style={{
          position:"absolute", borderRadius:"50%",
          width:d.size, height:d.size, background:d.color,
          opacity: rev ? 0.75 : 0,
          transition:`opacity 0.8s ${0.6+i*0.05}s`,
          ...d,
        }}/>
      ))}

      {/* Center Content */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        zIndex:10, textAlign:"center", padding:"0 22%", pointerEvents:"none",
      }}>
        {/* Badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"6px 16px", borderRadius:99, marginBottom:28,
          background:"rgba(255,255,255,0.88)", border:"1px solid rgba(77,137,245,0.22)",
          boxShadow:"0 4px 16px rgba(39,87,200,0.08)", backdropFilter:"blur(12px)",
          opacity: rev?1:0, transform: rev?"translateY(0)":"translateY(-10px)",
          transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s", pointerEvents:"auto",
        }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.lBlue, animation:"blink 2.2s infinite" }}/>
          <span style={{ fontSize:10, letterSpacing:3, color:C.lBlue, textTransform:"uppercase", fontFamily:"monospace", fontWeight:700 }}>CE QU'ON DIT SUR HKEYA</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily:"'Georgia','Times New Roman',serif",
          fontSize:"clamp(80px,12vw,148px)", fontWeight:900, lineHeight:0.88,
          margin:"0 0 20px 0", letterSpacing:-6,
          background:"linear-gradient(145deg,#1a3580 0%,#2757c8 35%,#4d89f5 60%,#8ab6fa 85%,#c4dafc 100%)",
          backgroundSize:"200% auto",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          filter:"drop-shadow(0 4px 24px rgba(39,87,200,0.18))",
          animation:"shimmer 8s linear infinite",
          opacity: rev?1:0, transform: rev?"translateY(0)":"translateY(40px)",
          transition:"opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.15s",
        }}>HKEYA</h1>

        <h2 style={{
          fontFamily:"Georgia, serif", fontSize:"clamp(16px,2vw,24px)",
          fontWeight:700, color:C.lText, margin:"0 0 10px 0", letterSpacing:-0.3,
          opacity: rev?1:0, transform: rev?"translateY(0)":"translateY(14px)",
          transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s",
        }}>Des vraies conversations.</h2>

        <p style={{
          fontSize:"clamp(13px,1.4vw,16px)", margin:"0 0 10px 0", fontFamily:"Georgia, serif",
          opacity: rev?1:0, transform: rev?"translateY(0)":"translateY(14px)",
          transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.52s",
        }}>
          <span style={{ color:C.lBlue, fontWeight:700 }}>Anonymes.</span>{" "}
          <span style={{ color:C.lBlue, fontWeight:700 }}>Authentiques.</span>{" "}
          <span style={{ color:C.lBlue, fontWeight:700 }}>Tunisiennes.</span>
        </p>

        <p style={{
          fontSize:13, color:C.lTextSub, lineHeight:1.7, margin:"0 0 32px 0", fontFamily:"Georgia, serif",
          opacity: rev?0.85:0, transform: rev?"translateY(0)":"translateY(10px)",
          transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.62s",
        }}>Exprime-toi librement, lis sans jugement,<br/>et rejoins une communauté qui te comprend.</p>

        {/* CTAs */}
        <div style={{
          display:"flex", gap:12, marginBottom:18, marginTop:24,
          opacity: rev?1:0, transform: rev?"translateY(0)":"translateY(12px)",
          transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.75s", pointerEvents:"auto",
        }}>
          <HeroBtn label="  S'INSCRIRE" primary onClick={onSignUp}/>
          <HeroBtn label="  CONNEXION" onClick={onSignIn}/>
        </div>

       

        <div style={{ opacity: rev?1:0, transition:"opacity 0.8s 1.0s", pointerEvents:"auto" }}>
        </div>
      </div>
      <Footer light/>
    </div>
  );
}

/* ─── LIGHT AUTH INPUT ───────────────────────────────── */
function LightInput({ label, placeholder, type="text", value, onChange, rightAction, required }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display:"block", marginBottom:12 }}>
      <div style={{ fontSize:10, letterSpacing:1.8, textTransform:"uppercase", color:C.lTextSub, marginBottom:6, fontFamily:"monospace", fontWeight:600 }}>
        {label}{required && <span style={{ color:C.azure, marginLeft:3 }}>*</span>}
      </div>
      <div style={{ position:"relative" }}>
        <input type={type} value={value} onChange={onChange}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          placeholder={placeholder}
          style={{
            width:"100%", height:44, borderRadius:12, outline:"none",
            padding: rightAction ? "0 84px 0 16px" : "0 16px",
            color:C.lText, fontSize:13,
            background: focus ? "#fff" : "rgba(240,242,250,0.9)",
            border:`1.5px solid ${focus ? C.azure : "rgba(39,87,200,0.15)"}`,
            boxShadow: focus ? "0 0 0 4px rgba(39,87,200,0.08)" : "none",
            transition:"all 0.22s ease", fontFamily:"Georgia, serif",
          }}
        />
        {rightAction && <div style={{ position:"absolute", top:"50%", right:14, transform:"translateY(-50%)" }}>{rightAction}</div>}
      </div>
    </label>
  );
}

/* ─── AUTH SUBMIT BUTTON ─────────────────────────────── */
function AuthBtn({ label, loading = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="submit" disabled={loading}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        width:"100%", height:48, borderRadius:12, border:"none",
        cursor: loading ? "not-allowed" : "pointer",
        color:"#fff", fontSize:13, fontWeight:800, letterSpacing:1.5, marginTop:6,
        background: hov ? "linear-gradient(135deg,#4d89f5,#1a3580)" : "linear-gradient(135deg,#2757c8,#1a3580)",
        boxShadow: hov ? "0 8px 32px rgba(39,87,200,0.35)" : "0 4px 18px rgba(39,87,200,0.22)",
        transform: hov ? "translateY(-2px)" : "none",
        transition:"all 0.22s ease", fontFamily:"monospace", textTransform:"uppercase",
        opacity: loading ? 0.7 : 1,
      }}
    >{label}</button>
  );
}

/* ─── AUTH CARD WRAPPER ──────────────────────────────── */
function AuthCard({ rev, children, wide = false }) {
  return (
    <div style={{
      position:"relative", zIndex:10,
      width: wide ? "min(520px,94vw)" : "min(440px,94vw)",
      maxHeight:"92vh", overflowY:"auto",
      opacity: rev?1:0,
      transform: rev ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
      transition:"all 0.85s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        background:"#fff", borderRadius:24,
        border:"1px solid rgba(39,87,200,0.12)",
        boxShadow:"0 24px 80px rgba(39,87,200,0.13), 0 4px 16px rgba(39,87,200,0.07)",
        padding:"36px 32px 28px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"linear-gradient(90deg,#2757c8,#4d89f5,#8ab6fa,#e8c44a)", borderRadius:"24px 24px 0 0" }}/>
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, background:"radial-gradient(circle,rgba(77,137,245,0.12) 0%,transparent 70%)", pointerEvents:"none" }}/>
        {children}
      </div>
    </div>
  );
}

/* ─── AUTH BG ────────────────────────────────────────── */
function LightAuthBg() {
  return (
    <>
      <ParticleCanvas density={20} light/>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(39,87,200,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(39,87,200,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px" }}/>
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(77,137,245,0.15) 0%,transparent 65%)", filter:"blur(40px)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-15%", left:"-8%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,196,74,0.10) 0%,transparent 65%)", filter:"blur(30px)", pointerEvents:"none" }}/>
    </>
  );
}

/* ─── STEP LABEL ─────────────────────────────────────── */
function StepLabel({ title }) {
  return (
    <div style={{ fontSize:10, letterSpacing:2.5, textTransform:"uppercase", color:C.lTextSub, fontFamily:"monospace", fontWeight:700, paddingBottom:8, marginBottom:14, marginTop:8, borderBottom:"1.5px solid rgba(39,87,200,0.1)", display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:20, height:1.5, background:C.lBlue, opacity:0.5 }}/>{title}
    </div>
  );
}

/* ─── SWITCH LINKS ───────────────────────────────────── */
function SwitchLinks({ question, switchLabel, onSwitch, onBack }) {
  return (
    <div style={{ marginTop:18, paddingTop:16, borderTop:"1px solid rgba(39,87,200,0.1)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
        <div>
          <span style={{ color:C.lTextSub, fontSize:12, fontFamily:"Georgia, serif" }}>{question} </span>
          <button type="button" onClick={onSwitch} style={{ background:"none", border:"none", color:C.lBlue, fontSize:12, cursor:"pointer", padding:0, fontFamily:"Georgia, serif", fontWeight:700, textDecoration:"underline" }}>{switchLabel}</button>
        </div>
        <button type="button" onClick={onBack} style={{ background:"none", border:"none", color:C.lTextSub, fontSize:11.5, cursor:"pointer", padding:0, fontFamily:"Georgia, serif", opacity:0.7, display:"flex", alignItems:"center", gap:4 }}>← Accueil</button>
      </div>
    </div>
  );
}

/* ─── AVATAR PICKER ──────────────────────────────────── */
const AVATAR_DEFS = [
  { bg:"linear-gradient(135deg,#2757c8,#4d89f5)", face:(<svg viewBox="0 0 40 40" width="22" height="22"><circle cx="20" cy="14" r="7" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/><path d="M8 36 C8 28 14 24 20 24 C26 24 32 28 32 36" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none"/><circle cx="15" cy="12" r="1.5" fill="rgba(255,255,255,0.9)"/><circle cx="25" cy="12" r="1.5" fill="rgba(255,255,255,0.9)"/><path d="M15 17 Q20 21 25 17" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" fill="none"/></svg>) },
  { bg:"linear-gradient(135deg,#1a3580,#2757c8)", face:(<svg viewBox="0 0 40 40" width="22" height="22"><path d="M20 6 L22 12 L28 12 L23 16 L25 22 L20 18 L15 22 L17 16 L12 12 L18 12 Z" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="20" cy="30" r="5" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2"/></svg>) },
  { bg:"linear-gradient(135deg,#4d89f5,#8ab6fa)", face:(<svg viewBox="0 0 40 40" width="22" height="22"><circle cx="20" cy="20" r="12" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5"/><path d="M14 20 Q20 28 26 20" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" fill="none"/><line x1="14" y1="15" x2="18" y2="15" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round"/><line x1="22" y1="15" x2="26" y2="15" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round"/></svg>) },
];
function AvatarPicker({ selected, onChange }) {
  return (
    <div>
      <div style={{ fontSize:10, letterSpacing:1.8, textTransform:"uppercase", color:C.lTextSub, marginBottom:8, fontFamily:"monospace", fontWeight:600 }}>Avatar <span style={{ color:C.azure }}>*</span></div>
      <div style={{ display:"flex", gap:10 }}>
        {AVATAR_DEFS.map((av,i)=>(
          <button key={i} type="button" onClick={()=>onChange(i)} style={{
            width:52, height:52, borderRadius:"50%", background:av.bg,
            border: selected===i ? `2.5px solid ${C.azure}` : "1.5px solid rgba(39,87,200,0.2)",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow: selected===i ? "0 0 0 4px rgba(39,87,200,0.12), 0 4px 16px rgba(39,87,200,0.25)" : "0 2px 8px rgba(39,87,200,0.1)",
            transform: selected===i ? "scale(1.1)" : "scale(1)",
            transition:"all 0.22s cubic-bezier(0.16,1,0.3,1)",
          }}>{av.face}</button>
        ))}
      </div>
    </div>
  );
}

/* ─── CHIP ───────────────────────────────────────────── */
function Chip({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding:"7px 16px", borderRadius:99,
      border: selected ? `1.5px solid ${C.azure}` : "1.5px solid rgba(39,87,200,0.18)",
      background: selected ? "linear-gradient(135deg,#2757c8,#1a3580)" : "rgba(240,242,250,0.9)",
      color: selected ? "#fff" : C.lTextMid,
      fontSize:12, fontWeight: selected ? 700 : 400, cursor:"pointer",
      letterSpacing:0.3, fontFamily:"Georgia, serif",
      boxShadow: selected ? "0 4px 14px rgba(39,87,200,0.25)" : "none",
      transition:"all 0.2s ease", display:"inline-flex", alignItems:"center", gap:5,
    }}>{label}{selected && <span style={{ fontSize:10 }}>✓</span>}</button>
  );
}

/* ─── ERROR BOX ──────────────────────────────────────── */
function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ color:"#c0392b", fontSize:12, marginBottom:12, padding:"9px 13px", background:"rgba(192,57,43,0.07)", borderRadius:9, border:"1px solid rgba(192,57,43,0.18)" }}>{msg}</div>
  );
}

/* ════════════════════════════════════════════════════════
   PANEL 2 — SIGN IN (light + real API)
════════════════════════════════════════════════════════ */
function SignInPanel({ isActive, onGoSignUp, onBackLanding, inline = false }) {
  const [rev, setRev] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email:"", password:"" });
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));

  useEffect(() => {
    if (isActive) { const t = setTimeout(()=>setRev(true), inline ? 40 : 110); return ()=>clearTimeout(t); }
    setRev(false); setError("");
  }, [isActive]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ identifier: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        window.location.href = "/whisper-original.html";
      } else {
        setError(data.message || "Email ou mot de passe incorrect");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const card = (
    <AuthCard rev={rev}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
        <HkeyaLogo size={32} dark={false}/>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:5, color:C.lBlue, textTransform:"uppercase", fontStyle:"italic", fontFamily:"Georgia, serif" }}>HKEYA</span>
      </div>
      <h2 style={{ margin:"0 0 4px 0", color:C.lText, fontSize:28, fontFamily:"Georgia, serif", fontWeight:900, lineHeight:1 }}>Connexion</h2>
      <p style={{ margin:"0 0 24px 0", color:C.lTextSub, fontSize:12, fontFamily:"Georgia, serif" }}>Bienvenue de retour 👋</p>
      <form onSubmit={handleSubmit}>
        <LightInput label="Adresse email" placeholder="email@exemple.com" value={form.email} onChange={set("email")} required/>
        <LightInput label="Mot de passe" placeholder="••••••••" type={showPw?"text":"password"} value={form.password} onChange={set("password")} required
          rightAction={<button type="button" onClick={()=>setShowPw(s=>!s)} style={{ border:"none", background:"none", color:C.lBlue, fontSize:11, cursor:"pointer", padding:0, fontFamily:"monospace", fontWeight:600 }}>{showPw?"Masquer":"Afficher"}</button>}
        />
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20, marginTop:-4 }}>
          <button type="button" style={{ background:"none", border:"none", color:C.lBlue, fontSize:11.5, cursor:"pointer", padding:0, fontFamily:"Georgia, serif" }}>Mot de passe oublié ?</button>
        </div>
        <ErrorBox msg={error}/>
        <AuthBtn label={loading ? "Connexion..." : "Se connecter →"} loading={loading}/>
      </form>
      <SwitchLinks question="Pas encore de compte ?" switchLabel="Créer un compte" onSwitch={onGoSignUp} onBack={onBackLanding}/>
    </AuthCard>
  );

  if (inline) return card;
  return (
    <div style={{ width:"100vw", height:"100vh", position:"relative", flexShrink:0, overflow:"hidden", background:"radial-gradient(ellipse at 60% 20%,#dde8ff 0%,#eef1fb 45%,#f0f2fa 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <LightAuthBg/>{card}<Footer light/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PANEL 3 — SIGN UP (light + real API)
════════════════════════════════════════════════════════ */
const INTERESTS = ["Loi & Droit","Technologie","Éducation","Santé"];
const AVATAR_LETTERS = ["A","B","C","D","E","M","S","T","Y"];

function SignUpPanel({ isActive, onGoSignIn, onBackLanding, inline = false }) {
  const [rev, setRev] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName:"", lastName:"", email:"", phone:"", password:"",
    avatar:0, pseudonym:"", interests:["Éducation"], moderator:false,
  });
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const toggleInterest = label => setForm(p=>({
    ...p, interests: p.interests.includes(label) ? p.interests.filter(x=>x!==label) : [...p.interests, label],
  }));

  useEffect(() => {
    if (isActive) { const t = setTimeout(()=>setRev(true), inline ? 40 : 110); return ()=>clearTimeout(t); }
    setRev(false); setError("");
  }, [isActive]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          prenom: form.firstName, nom: form.lastName,
          email: form.email, telephone: form.phone || null,
          password: form.password, pseudo: form.pseudonym,
          avatar: AVATAR_LETTERS[form.avatar] || "A",
          veut_etre_moderateur: form.moderator,
        }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        window.location.href = "/whisper-original.html";
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const card = (
    <AuthCard rev={rev} wide>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
        <HkeyaLogo size={32} dark={false}/>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:5, color:C.lBlue, textTransform:"uppercase", fontStyle:"italic", fontFamily:"Georgia, serif" }}>HKEYA</span>
      </div>
      <h2 style={{ margin:"0 0 4px 0", color:C.lText, fontSize:28, fontFamily:"Georgia, serif", fontWeight:900, lineHeight:1 }}>Inscription</h2>
      <p style={{ margin:"0 0 18px 0", color:C.lTextSub, fontSize:12, fontFamily:"Georgia, serif" }}>* Champs obligatoires</p>
      <form onSubmit={handleSubmit}>
        <StepLabel title="Identité civile"/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <LightInput label="Prénom" placeholder="Ex: Jean" value={form.firstName} onChange={set("firstName")} required/>
          <LightInput label="Nom" placeholder="Ex: Dupont" value={form.lastName} onChange={set("lastName")} required/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <LightInput label="Email" placeholder="jean@exemple.com" value={form.email} onChange={set("email")} required/>
          <LightInput label="Téléphone" placeholder="+216 00 000 000" value={form.phone} onChange={set("phone")}/>
        </div>
        <LightInput label="Mot de passe" placeholder="••••••••••••" type={showPw?"text":"password"} value={form.password} onChange={set("password")} required
          rightAction={<button type="button" onClick={()=>setShowPw(s=>!s)} style={{ border:"none", background:"none", color:C.lBlue, fontSize:11, cursor:"pointer", padding:0, fontFamily:"monospace", fontWeight:600 }}>{showPw?"Masquer":"Afficher"}</button>}
        />
        <StepLabel title="Persona anonyme"/>
        <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:16, marginBottom:14, alignItems:"end" }}>
          <AvatarPicker selected={form.avatar} onChange={v=>setForm(p=>({...p,avatar:v}))}/>
          <LightInput label="Pseudonyme public" placeholder="@LeBib_42" value={form.pseudonym} onChange={set("pseudonym")} required/>
        </div>
        <StepLabel title="Centres d'intérêt"/>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
          {INTERESTS.map(tag=><Chip key={tag} label={tag} selected={form.interests.includes(tag)} onClick={()=>toggleInterest(tag)}/>)}
        </div>
        <label style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderRadius:14, cursor:"pointer", background:"rgba(240,242,250,0.8)", border:"1.5px solid rgba(39,87,200,0.12)", marginBottom:20 }}>
          <div onClick={()=>setForm(p=>({...p,moderator:!p.moderator}))} style={{
            width:18, height:18, borderRadius:5, flexShrink:0,
            border:`2px solid ${form.moderator ? C.azure : "rgba(39,87,200,0.3)"}`,
            background: form.moderator ? C.azure : "#fff",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", transition:"all 0.2s ease",
          }}>
            {form.moderator && <span style={{ color:"#fff", fontSize:12 }}>✓</span>}
          </div>
          <div style={{ color:C.lTextMid, fontSize:12.5, fontFamily:"Georgia, serif", lineHeight:1.5 }}>Je souhaite devenir modérateur à l'avenir</div>
        </label>
        <ErrorBox msg={error}/>
        <AuthBtn label={loading ? "Création..." : "Créer mon compte →"} loading={loading}/>
      </form>
      <SwitchLinks question="Tu as déjà un compte ?" switchLabel="Se connecter" onSwitch={onGoSignIn} onBack={onBackLanding}/>
    </AuthCard>
  );

  if (inline) return card;
  return (
    <div style={{ width:"100vw", height:"100vh", position:"relative", flexShrink:0, overflow:"hidden", background:"radial-gradient(ellipse at 40% 10%,#dde8ff 0%,#eef1fb 45%,#f0f2fa 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <LightAuthBg/>{card}<Footer light/>
    </div>
  );
}

/* ─── NAV ARROW ──────────────────────────────────────── */
function NavArrow({ dir, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      position:"fixed", [dir==="left"?"left":"right"]:14,
      top:"50%", transform:`translateY(-50%) ${hov?"scale(1.12)":"scale(1)"}`,
      width:40, height:40, borderRadius:"50%",
      background: hov ? "rgba(39,87,200,0.12)" : "rgba(255,255,255,0.85)",
      border:"1px solid rgba(39,87,200,0.18)",
      color:C.lBlue, fontSize:15, cursor:"pointer",
      backdropFilter:"blur(18px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:100,
      boxShadow: hov ? "0 0 18px rgba(39,87,200,0.2)" : "0 3px 16px rgba(39,87,200,0.1)",
      transition:"all 0.2s ease",
    }}>{dir==="left" ? "←" : "→"}</button>
  );
}

/* ════════════════════════════════════════════════════════
   ROOT — Hero fixe + modals overlay
════════════════════════════════════════════════════════ */
export default function HkeyaApp() {
  // "none" | "signin" | "signup"
  const [modal, setModal] = useState("none");

  return (
    <div style={{ width:"100vw", height:"100vh", overflow:"hidden", background:C.lBg, position:"relative", fontFamily:"Georgia, serif" }}>
      <style>{`
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}
        *{box-sizing:border-box}
        html,body{overflow:hidden;margin:0;padding:0;width:100%;height:100%}
        ::-webkit-scrollbar{display:none}
        ::placeholder{color:rgba(107,130,176,0.45)!important}
        input{box-sizing:border-box;width:100%!important}
      `}</style>

      {/* Hero toujours visible en fond */}
      <HeroPanel
        isActive={true}
        onSignIn={()=>setModal("signin")}
        onSignUp={()=>setModal("signup")}
      />

      {/* Brand top-left */}
      <div style={{ position:"fixed", top:16, left:18, zIndex:200, display:"flex", alignItems:"center", gap:9 }}>
        <HkeyaLogo size={28} dark={false}/>
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:5, color:C.lBlue, textTransform:"uppercase", fontStyle:"italic", fontFamily:"Georgia, serif" }}>HKEYA</span>
      </div>

      {/* Modal overlay */}
      {modal !== "none" && (
        <div
          onClick={e=>{ if(e.target===e.currentTarget) setModal("none"); }}
          style={{
            position:"fixed", inset:0, zIndex:300,
            background:"rgba(15,24,60,0.35)",
            backdropFilter:"blur(6px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"24px",
            animation:"fadeIn 0.25s ease",
          }}
        >
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
          {modal === "signin" && (
            <SignInPanel
              isActive={true}
              onGoSignUp={()=>setModal("signup")}
              onBackLanding={()=>setModal("none")}
              inline
            />
          )}
          {modal === "signup" && (
            <SignUpPanel
              isActive={true}
              onGoSignIn={()=>setModal("signin")}
              onBackLanding={()=>setModal("none")}
              inline
            />
          )}
        </div>
      )}
    </div>
  );
}
