import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── Animated counter ── */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = Math.ceil(target / 60);
        const t = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(t); }
          else setCount(start);
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── Typing animation ── */
const TypingDemo = () => {
  const lines = [
    { role: 'user', text: 'What is the refund policy?' },
    { role: 'bot',  text: 'Refunds are available within 7 days for monthly plans and 14 days for annual plans. Approved refunds process in 5–10 business days.' },
    { role: 'user', text: 'What plans do you offer?' },
    { role: 'bot',  text: 'We offer Basic, Pro, and Enterprise plans. Each includes different storage limits and support levels. Would you like a detailed comparison?' },
  ];
  const [shown, setShown] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    const next = () => {
      if (i >= lines.length) return;
      setTyping(true);
      const delay = lines[i].role === 'bot' ? 1200 : 400;
      setTimeout(() => {
        const line = lines[i];
        setShown(prev => [...prev, line]);
        setTyping(false);
        i++;
        setTimeout(next, 900);
      }, delay);
    };
    setTimeout(next, 600);
  }, []);

  return (
    <div style={demoStyles.window}>
      <div style={demoStyles.bar}>
        <div style={{...demoStyles.dot, background:'#ff5f57'}}/>
        <div style={{...demoStyles.dot, background:'#ffbd2e'}}/>
        <div style={{...demoStyles.dot, background:'#28ca41'}}/>
        <span style={demoStyles.url}>nexora.com — IntelliSupport</span>
      </div>
      <div style={demoStyles.chat}>
        <div style={demoStyles.chatHeader}>
          <div style={demoStyles.chatAvatar}>N</div>
          <div>
            <div style={demoStyles.chatName}>Nexora Support</div>
            <div style={demoStyles.chatOnline}>● Online · powered by IntelliSupport</div>
          </div>
        </div>
        <div style={demoStyles.messages}>
          {shown.map((m, i) => (
            <div key={i} style={{
              ...demoStyles.msgRow,
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                ...demoStyles.bubble,
                background: m.role === 'user' ? '#6c63ff' : '#1e1e2e',
                color: '#fff',
                borderRadius: m.role === 'user'
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                maxWidth: '78%'
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{...demoStyles.msgRow, justifyContent:'flex-start'}}>
              <div style={{
                ...demoStyles.bubble,
                background:'#1e1e2e',
                color:'#888',
                borderRadius:'16px 16px 16px 4px',
                display:'flex',
                alignItems:'center',
                gap:'4px'
              }}>
                <span style={demoStyles.dot2}/>
                <span style={{...demoStyles.dot2, animationDelay:'0.2s'}}/>
                <span style={{...demoStyles.dot2, animationDelay:'0.4s'}}/>
              </div>
            </div>
          )}
        </div>
        <div style={demoStyles.inputRow}>
          <div style={demoStyles.fakeInput}>Ask anything about Nexora...</div>
          <div style={demoStyles.sendBtn}>↑</div>
        </div>
      </div>
    </div>
  );
};

const demoStyles = {
  window: { background:'#0d0d12', border:'1px solid #2a2a3e', borderRadius:'16px', overflow:'hidden', width:'100%', maxWidth:'460px', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' },
  bar: { background:'#13131a', padding:'10px 14px', display:'flex', alignItems:'center', gap:'6px', borderBottom:'1px solid #1e1e2e' },
  dot: { width:'10px', height:'10px', borderRadius:'50%' },
  url: { fontSize:'11px', color:'#555', marginLeft:'8px', fontFamily:'monospace' },
  chat: { display:'flex', flexDirection:'column' },
  chatHeader: { padding:'12px 16px', display:'flex', alignItems:'center', gap:'10px', background:'linear-gradient(135deg,#6c63ff,#4f46e5)', borderBottom:'1px solid #2a2a3e' },
  chatAvatar: { width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', color:'#fff' },
  chatName: { fontSize:'13px', fontWeight:'600', color:'#fff' },
  chatOnline: { fontSize:'11px', color:'rgba(255,255,255,0.65)' },
  messages: { padding:'14px', display:'flex', flexDirection:'column', gap:'8px', minHeight:'200px', maxHeight:'240px', overflowY:'auto' },
  msgRow: { display:'flex' },
  bubble: { padding:'8px 12px', fontSize:'12.5px', lineHeight:1.5 },
  inputRow: { padding:'10px', borderTop:'1px solid #1e1e2e', display:'flex', gap:'8px', alignItems:'center' },
  fakeInput: { flex:1, background:'#1a1a24', borderRadius:'8px', padding:'8px 12px', fontSize:'12px', color:'#555' },
  sendBtn: { width:'32px', height:'32px', borderRadius:'8px', background:'#6c63ff', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', cursor:'pointer' },
  dot2: { display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', background:'#555', margin:'0 2px', animation:'bounce 1s infinite' }
};

/* ── Feature card ── */
const FeatureCard = ({ icon, title, desc, delay }) => (
  <div style={{ ...s.featCard, animationDelay: delay }}>
    <div style={s.featIcon}>{icon}</div>
    <h3 style={s.featTitle}>{title}</h3>
    <p style={s.featDesc}>{desc}</p>
  </div>
);

/* ── Step card ── */
const StepCard = ({ num, title, desc }) => (
  <div style={s.stepCard}>
    <div style={s.stepNum}>{num}</div>
    <h3 style={s.stepTitle}>{title}</h3>
    <p style={s.stepDesc}>{desc}</p>
  </div>
);

/* ── Main component ── */
const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-6px); } }
        @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-12px); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .float { animation: float 4s ease-in-out infinite; }
        .nav-btn:hover { opacity:0.85 !important; transform:translateY(-1px); }
        .feat-card:hover { border-color:#6c63ff !important; transform:translateY(-4px); }
        .step-card:hover { background:#1e1e2e !important; }
        .plan-card:hover { border-color:#6c63ff !important; transform:translateY(-4px); }
        .cta-btn:hover { opacity:0.88 !important; transform:translateY(-2px); }
        .ghost-btn:hover { background:#1e1e2e !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ ...s.nav, background: scrolled ? 'rgba(10,10,16,0.96)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid #1e1e2e' : '1px solid transparent' }}>
        <div style={s.navLogo}>
          <div style={s.logoBox}>IS</div>
          <span style={s.logoName}>IntelliSupport</span>
        </div>
        <div style={s.navLinks}>
          <a href="#features" style={s.navLink}>Features</a>
          <a href="#how" style={s.navLink}>How it works</a>
          <a href="#pricing" style={s.navLink}>Pricing</a>
        </div>
        <div style={s.navActions}>
          <Link to="/login" className="nav-btn ghost-btn" style={s.ghostBtn}>Sign in</Link>
          <Link to="/register" className="nav-btn cta-btn" style={s.ctaBtn}>Start free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        {/* Background glow */}
        <div style={s.glow1}/>
        <div style={s.glow2}/>

        <div className="fade-up" style={{ animationDelay:'0s', textAlign:'center', position:'relative', zIndex:2 }}>
          <div style={s.heroBadge}>
            <span style={s.badgeDot}/>
            RAG-powered · Multi-tenant · Built for scale
          </div>
        </div>

        <h1 className="fade-up" style={{ ...s.heroTitle, animationDelay:'0.1s' }}>
          Customer support that<br/>
          <em style={s.heroEm}>actually knows</em> your business
        </h1>

        <p className="fade-up" style={{ ...s.heroSub, animationDelay:'0.2s' }}>
          Deploy an AI chatbot trained on your own docs in minutes.<br/>
          Resolve 80% of queries instantly — no human needed.
        </p>

        <div className="fade-up" style={{ ...s.heroActions, animationDelay:'0.3s' }}>
          <Link to="/register" className="cta-btn" style={s.heroCta}>
            Start for free →
          </Link>
          <a href="#demo" className="ghost-btn" style={s.heroGhost}>
            See demo ↓
          </a>
        </div>

        <div className="fade-up" style={{ ...s.heroStats, animationDelay:'0.4s' }}>
          {[
            { val: 80, suffix:'%', label:'queries resolved by AI' },
            { val: 340, suffix:'%', label:'average first-year ROI' },
            { val: 2, suffix:'s', label:'avg response time' },
          ].map((s2, i) => (
            <div key={i} style={s.statItem}>
              <div style={s.statNum}><Counter target={s2.val} suffix={s2.suffix}/></div>
              <div style={s.statLabel}>{s2.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" style={s.demoSection}>
        <div style={s.demoInner}>
          <div style={s.demoText}>
            <div style={s.sectionTag}>Live demo</div>
            <h2 style={s.demoTitle}>Watch it answer from<br/>your real documents</h2>
            <p style={s.demoDesc}>
              Upload your FAQs, policies, and product docs. Your bot reads them,
              understands them, and answers customer questions accurately —
              no hallucinations, no guessing.
            </p>
            <div style={s.demoPoints}>
              {['Answers in under 2 seconds', 'Grounded in your content only', 'Works on any website instantly'].map((p, i) => (
                <div key={i} style={s.demoPoint}>
                  <span style={s.pointDot}/>
                  {p}
                </div>
              ))}
            </div>
            <Link to="/register" className="cta-btn" style={{ ...s.heroCta, display:'inline-block', marginTop:'1.5rem' }}>
              Try it yourself →
            </Link>
          </div>
          <div className="float" style={s.demoWidget}>
            <TypingDemo />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={s.featuresSection}>
        <div style={s.sectionTag}>Features</div>
        <h2 style={s.sectionTitle}>Everything your support<br/>team <em style={{ fontStyle:'italic', color:'#6c63ff' }}>wished</em> it had</h2>
        <p style={s.sectionSub}>One platform. From smart AI replies to human handoff to full analytics.</p>
        <div style={s.featGrid}>
          {[
            { icon:'🧠', title:'RAG Knowledge Base', desc:'Upload your docs and the bot answers from them — not the internet. Zero hallucinations.', delay:'0s' },
            { icon:'⚡', title:'Instant Web Widget', desc:'One script tag. Your branded chatbot appears on any website in seconds. No dev needed.', delay:'0.05s' },
            { icon:'👤', title:'Human Handoff', desc:"When the bot can't help, it escalates to a live agent with full chat context already attached.", delay:'0.1s' },
            { icon:'📊', title:'Real-time Analytics', desc:'Resolution rates, top questions, CSAT scores — all in one clean dashboard.', delay:'0.15s' },
            { icon:'🌐', title:'Omnichannel', desc:'Web, WhatsApp, Slack, email — one bot, everywhere your customers are.', delay:'0.2s' },
            { icon:'🌐', title:'Omnichannel (Coming Soon)', desc:'Web widget available now. WhatsApp, Slack and email integrations coming in the next release.', delay:'0.2s' },,
          ].map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={s.howSection}>
        <div style={s.sectionTag}>How it works</div>
        <h2 style={s.sectionTitle}>Live in 3 steps</h2>
        <p style={s.sectionSub}>From signup to live chatbot in under 10 minutes.</p>
        <div style={s.stepsGrid}>
          <StepCard num="01" title="Upload your content" desc="Drop in your FAQs, help docs, product pages, or PDFs. Our AI reads and indexes everything automatically." />
          <div style={s.stepArrow}>→</div>
          <StepCard num="02" title="Customize your bot" desc="Set the bot's name, color, and welcome message to match your brand. Takes 2 minutes in the dashboard." />
          <div style={s.stepArrow}>→</div>
          <StepCard num="03" title="Embed and go live" desc="Copy one line of code into your website. Your AI support agent is live for every visitor — instantly." />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={s.pricingSection}>
        <div style={s.sectionTag}>Pricing</div>
        <h2 style={s.sectionTitle}>Simple, honest pricing</h2>
        <p style={s.sectionSub}>Start free. Scale as you grow. No hidden fees.</p>
        <div style={s.plansGrid}>
          {[
            {
              name: 'Starter', price: '$0', period: '/month',
              desc: 'Perfect for getting started.',
              features: ['1 chatbot', '500 messages/month', '20 documents', 'Web widget', 'Email support'],
              cta: 'Get started free', featured: false
            },
            {
              name: 'Growth', price: '$49', period: '/month',
              desc: 'For growing companies.',
              features: ['5 chatbots', '10,000 messages/month', 'Unlimited documents', 'Human handoff', 'Analytics dashboard', 'WhatsApp + Slack', 'Priority support'],
              cta: 'Start 14-day trial', featured: true
            },
            {
              name: 'Enterprise', price: 'Custom', period: '',
              desc: 'For large teams.',
              features: ['Unlimited chatbots', 'Unlimited messages', 'SSO + SAML', 'SLA guarantees', 'Dedicated onboarding', 'Custom integrations'],
              cta: 'Contact sales', featured: false
            }
          ].map((plan, i) => (
            <div key={i} className="plan-card" style={{
              ...s.planCard,
              borderColor: plan.featured ? '#6c63ff' : '#1e1e2e',
              background: plan.featured ? 'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(79,70,229,0.06))' : 'var(--surface,#13131a)'
            }}>
              {plan.featured && <div style={s.popularBadge}>Most popular</div>}
              <div style={s.planName}>{plan.name}</div>
              <div style={s.planPrice}>
                {plan.price}<span style={s.planPeriod}>{plan.period}</span>
              </div>
              <p style={s.planDesc}>{plan.desc}</p>
              <ul style={s.planFeatures}>
                {plan.features.map((f, j) => (
                  <li key={j} style={s.planFeature}>
                    <span style={s.featureDot}/>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="cta-btn"
                style={{
                  ...s.planBtn,
                  background: plan.featured ? '#6c63ff' : 'transparent',
                  border: plan.featured ? 'none' : '1px solid #2a2a3e',
                  color: plan.featured ? '#fff' : '#aaa'
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={s.ctaBanner}>
        <div style={s.ctaGlow}/>
        <h2 style={s.ctaBannerTitle}>
          Start resolving queries in minutes
        </h2>
        <p style={s.ctaBannerSub}>Free to start. No credit card. No engineers needed.</p>
        <div style={s.ctaBannerActions}>
          <Link to="/register" className="cta-btn" style={s.heroCta}>Create free account →</Link>
          <Link to="/login" className="ghost-btn" style={s.heroGhost}>Sign in</Link>
        </div>
      </section>
          
      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerTop}>
          <div style={s.footerBrand}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'0.75rem' }}>
              <div style={s.logoBox}>IS</div>
              <span style={s.logoName}>IntelliSupport</span>
            </div>
            <p style={s.footerTagline}>AI customer support for every business.</p>
          </div>
          <div style={s.footerLinks}>
            {[
              { heading:'Product', links:['Features','Pricing','How it works','Demo'] },
              { heading:'Company', links:['About','Blog','Careers','Contact'] },
              { heading:'Legal', links:['Privacy','Terms','Security'] }
            ].map((col, i) => (
              <div key={i} style={s.footerCol}>
                <div style={s.footerColHead}>{col.heading}</div>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={s.footerLink}>{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={s.footerBottom}>
          <span>© 2026 IntelliSupport. All rights reserved.</span>
          <span style={{ color:'#333' }}>Built with ❤️ for better support</span>
        </div>
      </footer>
    </div>
  );
};

/* ── Styles ── */
const s = {
  page: { background:'#0a0a10', color:'#e8e8f0', fontFamily:"'DM Sans',sans-serif", fontWeight:300, overflowX:'hidden' },
  nav: { position:'fixed', top:0, left:0, right:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 3rem', transition:'all 0.3s' },
  navLogo: { display:'flex', alignItems:'center', gap:'10px' },
  logoBox: { width:'34px', height:'34px', borderRadius:'9px', background:'linear-gradient(135deg,#6c63ff,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'800', color:'#fff', fontFamily:"'Syne',sans-serif" },
  logoName: { fontSize:'1rem', fontWeight:'700', color:'#fff', fontFamily:"'Syne',sans-serif", letterSpacing:'-0.01em' },
  navLinks: { display:'flex', gap:'2rem' },
  navLink: { color:'#888', fontSize:'0.875rem', fontWeight:'400', textDecoration:'none', transition:'color 0.2s' },
  navActions: { display:'flex', gap:'0.75rem', alignItems:'center' },
  ghostBtn: { background:'transparent', border:'1px solid #2a2a3e', color:'#ccc', padding:'0.5rem 1.1rem', borderRadius:'8px', fontSize:'0.875rem', fontWeight:'400', textDecoration:'none', transition:'all 0.2s', display:'inline-block' },
  ctaBtn: { background:'linear-gradient(135deg,#6c63ff,#4f46e5)', border:'none', color:'#fff', padding:'0.55rem 1.25rem', borderRadius:'8px', fontSize:'0.875rem', fontWeight:'500', textDecoration:'none', transition:'all 0.2s', display:'inline-block', cursor:'pointer' },
  hero: { minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'8rem 2rem 5rem', position:'relative' },
  glow1: { position:'absolute', top:'15%', left:'50%', transform:'translateX(-50%)', width:'600px', height:'400px', background:'radial-gradient(ellipse,rgba(108,99,255,0.15) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 },
  glow2: { position:'absolute', bottom:'10%', right:'10%', width:'300px', height:'300px', background:'radial-gradient(ellipse,rgba(79,70,229,0.08) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 },
  heroBadge: { display:'inline-flex', alignItems:'center', gap:'8px', border:'1px solid #2a2a3e', borderRadius:'100px', padding:'0.35rem 1rem', fontSize:'0.78rem', color:'#888', background:'rgba(255,255,255,0.03)', marginBottom:'2rem' },
  badgeDot: { width:'6px', height:'6px', borderRadius:'50%', background:'#6c63ff', display:'inline-block', animation:'pulse 2s infinite' },
  heroTitle: { fontFamily:"'Syne',sans-serif", fontSize:'clamp(2.8rem,6vw,5.5rem)', fontWeight:'800', lineHeight:1.08, letterSpacing:'-0.03em', maxWidth:'860px', marginBottom:'1.5rem', position:'relative', zIndex:2 },
  heroEm: { fontStyle:'italic', background:'linear-gradient(135deg,#6c63ff,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  heroSub: { fontSize:'1.1rem', color:'#777', maxWidth:'520px', margin:'0 auto 2.5rem', lineHeight:1.7, position:'relative', zIndex:2 },
  heroActions: { display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'3.5rem', position:'relative', zIndex:2 },
  heroCta: { background:'linear-gradient(135deg,#6c63ff,#4f46e5)', color:'#fff', border:'none', borderRadius:'10px', padding:'0.85rem 2rem', fontSize:'1rem', fontWeight:'500', textDecoration:'none', transition:'all 0.2s', display:'inline-block', cursor:'pointer' },
  heroGhost: { background:'transparent', border:'1px solid #2a2a3e', color:'#ccc', borderRadius:'10px', padding:'0.85rem 2rem', fontSize:'1rem', fontWeight:'400', textDecoration:'none', transition:'all 0.2s', display:'inline-block' },
  heroStats: { display:'flex', gap:'3.5rem', justifyContent:'center', flexWrap:'wrap', position:'relative', zIndex:2 },
  statItem: { textAlign:'center' },
  statNum: { fontFamily:"'Syne',sans-serif", fontSize:'2.25rem', fontWeight:'800', color:'#fff', lineHeight:1 },
  statLabel: { fontSize:'0.8rem', color:'#666', marginTop:'4px' },
  demoSection: { padding:'6rem 2rem', maxWidth:'1100px', margin:'0 auto' },
  demoInner: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' },
  demoText: { display:'flex', flexDirection:'column', gap:'1rem' },
  sectionTag: { fontSize:'0.75rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'#6c63ff', fontWeight:'500', marginBottom:'0.5rem' },
  demoTitle: { fontFamily:"'Syne',sans-serif", fontSize:'clamp(1.75rem,3vw,2.5rem)', fontWeight:'800', lineHeight:1.15, letterSpacing:'-0.02em', color:'#fff' },
  demoDesc: { fontSize:'0.95rem', color:'#777', lineHeight:1.7 },
  demoPoints: { display:'flex', flexDirection:'column', gap:'0.6rem', marginTop:'0.5rem' },
  demoPoint: { display:'flex', alignItems:'center', gap:'10px', fontSize:'0.875rem', color:'#aaa' },
  pointDot: { width:'6px', height:'6px', borderRadius:'50%', background:'#6c63ff', flexShrink:0 },
  demoWidget: { display:'flex', justifyContent:'center' },
  featuresSection: { padding:'6rem 2rem', maxWidth:'1100px', margin:'0 auto', textAlign:'center' },
  sectionTitle: { fontFamily:"'Syne',sans-serif", fontSize:'clamp(1.75rem,4vw,3rem)', fontWeight:'800', lineHeight:1.15, letterSpacing:'-0.02em', color:'#fff', marginBottom:'1rem', marginTop:'0.5rem' },
  sectionSub: { color:'#666', fontSize:'1rem', maxWidth:'480px', margin:'0 auto 3.5rem', lineHeight:1.7 },
  featGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1px', background:'#1a1a24', border:'1px solid #1a1a24', borderRadius:'16px', overflow:'hidden' },
  featCard: { background:'#0d0d12', padding:'2rem', textAlign:'left', transition:'all 0.25s', cursor:'default' },
  featIcon: { fontSize:'1.75rem', marginBottom:'1rem' },
  featTitle: { fontSize:'1rem', fontWeight:'600', color:'#fff', marginBottom:'0.5rem', fontFamily:"'Syne',sans-serif" },
  featDesc: { fontSize:'0.875rem', color:'#666', lineHeight:1.6 },
  howSection: { padding:'6rem 2rem', maxWidth:'1000px', margin:'0 auto', textAlign:'center', background:'#0d0d12', borderTop:'1px solid #1a1a24', borderBottom:'1px solid #1a1a24' },
  stepsGrid: { display:'flex', alignItems:'flex-start', justifyContent:'center', gap:'1rem', marginTop:'3rem', flexWrap:'wrap' },
  stepCard: { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:'14px', padding:'2rem', maxWidth:'240px', textAlign:'left', flex:1, minWidth:'200px', transition:'background 0.2s', cursor:'default' },
  stepNum: { fontFamily:"'Syne',sans-serif", fontSize:'2.5rem', fontWeight:'800', color:'#2a2a3e', lineHeight:1, marginBottom:'1rem' },
  stepTitle: { fontSize:'1rem', fontWeight:'600', color:'#fff', marginBottom:'0.5rem', fontFamily:"'Syne',sans-serif" },
  stepDesc: { fontSize:'0.85rem', color:'#666', lineHeight:1.6 },
  stepArrow: { fontSize:'1.5rem', color:'#2a2a3e', paddingTop:'3rem', flexShrink:0 },
  pricingSection: { padding:'6rem 2rem', maxWidth:'1000px', margin:'0 auto', textAlign:'center' },
  plansGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1rem', marginTop:'3rem', textAlign:'left' },
  planCard: { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:'14px', padding:'2rem', position:'relative', transition:'all 0.25s', cursor:'default' },
  popularBadge: { position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#6c63ff,#4f46e5)', color:'#fff', fontSize:'0.72rem', fontWeight:'600', padding:'3px 14px', borderRadius:'100px', whiteSpace:'nowrap' },
  planName: { fontSize:'1rem', fontWeight:'700', color:'#fff', marginBottom:'0.5rem', fontFamily:"'Syne',sans-serif" },
  planPrice: { fontFamily:"'Syne',sans-serif", fontSize:'2.5rem', fontWeight:'800', color:'#fff', lineHeight:1.1, marginBottom:'0.5rem' },
  planPeriod: { fontFamily:"'DM Sans',sans-serif", fontSize:'0.875rem', color:'#666', fontWeight:'300' },
  planDesc: { fontSize:'0.85rem', color:'#666', marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #1e1e2e' },
  planFeatures: { listStyle:'none', display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'1.75rem' },
  planFeature: { fontSize:'0.875rem', color:'#888', display:'flex', alignItems:'center', gap:'8px' },
  featureDot: { width:'5px', height:'5px', borderRadius:'50%', background:'#6c63ff', flexShrink:0 },
  planBtn: { display:'block', textAlign:'center', padding:'0.75rem', borderRadius:'8px', fontSize:'0.875rem', fontWeight:'500', textDecoration:'none', transition:'all 0.2s', cursor:'pointer' },
  ctaBanner: { padding:'7rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' },
  ctaGlow: { position:'absolute', inset:0, background:'radial-gradient(ellipse 50% 70% at 50% 50%,rgba(108,99,255,0.12) 0%,transparent 70%)', pointerEvents:'none' },
  ctaBannerTitle: { fontFamily:"'Syne',sans-serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:'800', color:'#fff', marginBottom:'1rem', letterSpacing:'-0.02em', position:'relative', zIndex:1 },
  ctaBannerSub: { color:'#666', fontSize:'1rem', marginBottom:'2.5rem', position:'relative', zIndex:1 },
  ctaBannerActions: { display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', position:'relative', zIndex:1 },
  footer: { borderTop:'1px solid #1a1a24', padding:'3rem 3rem 2rem' },
  footerTop: { display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'2rem', marginBottom:'2rem' },
  footerBrand: { maxWidth:'220px' },
  footerTagline: { fontSize:'0.85rem', color:'#555', lineHeight:1.6 },
  footerLinks: { display:'flex', gap:'3rem', flexWrap:'wrap' },
  footerCol: { display:'flex', flexDirection:'column', gap:'0.6rem' },
  footerColHead: { fontSize:'0.78rem', fontWeight:'600', color:'#fff', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.25rem' },
  footerLink: { fontSize:'0.85rem', color:'#555', textDecoration:'none', transition:'color 0.2s' },
  footerBottom: { display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem', paddingTop:'1.5rem', borderTop:'1px solid #1a1a24', fontSize:'0.8rem', color:'#444' }
};

export default Home;
