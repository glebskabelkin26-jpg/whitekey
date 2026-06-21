import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ChevronDown, DollarSign, Globe, Briefcase, Shield, Sparkles, Key, Plus } from 'lucide-react';

interface FadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}

const useFade = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return ref;
};

function Fade({ children, className = '', delay = '' }: FadeProps) {
  const ref = useFade();
  return (
    <div ref={ref} className={`fade-section ${delay} ${className}`}>
      {children}
    </div>
  );
}

// — Constellation SVG background
function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const pts: { x: number; y: number; vx: number; vy: number }[] = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
      });
    }

    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 200) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(189, 155, 96, ${0.045 * (1 - d / 200)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(189, 155, 96, 0.18)';
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}

// — Header
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <header id="main-header" className={scrolled ? 'scrolled' : ''}>
      {/* Logo */}
      <a
        href="#hero"
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '14px',
          color: '#BD9B60',
          letterSpacing: '10px',
          textDecoration: 'none',
          fontWeight: 500,
          textTransform: 'uppercase',
        }}
      >
        WHITEKEY
      </a>

      {/* Desktop navigation */}
      <nav
        className="desktop-nav"
        style={{ display: 'flex', alignItems: 'center', gap: '40px' }}
      >
        <a href="#services" className="nav-link">УСЛУГИ</a>
        <a href="#cases" className="nav-link">КЕЙСЫ</a>
        <a href="#faq" className="nav-link">FAQ</a>
        <a href="#contacts" className="nav-link">КОНТАКТЫ</a>

        <a
          href="https://t.me/WhiteKeyConcierge"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
          style={{
            padding: '10px 28px',
            fontSize: '9px',
            letterSpacing: '4px',
          }}
        >
          НАЧАТЬ ДИАЛОГ
        </a>
      </nav>

      {/* Hamburger button */}
      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Меню"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile overlay nav */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <a href="#services" onClick={close}>УСЛУГИ</a>
        <a href="#cases" onClick={close}>КЕЙСЫ</a>
        <a href="#faq" onClick={close}>FAQ</a>
        <a href="#contacts" onClick={close}>КОНТАКТЫ</a>
        <a
          href="https://t.me/WhiteKeyConcierge"
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
          style={{
            fontSize: '20px',
            letterSpacing: '5px',
            color: '#BD9B60',
          }}
        >
          НАЧАТЬ ДИАЛОГ
        </a>
      </nav>
    </header>
  );
}

// — Key icon (line art)
function KeyIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="#BD9B60"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="28"
      height="28"
    >
      <circle cx="13" cy="15" r="7" />
      <circle cx="13" cy="15" r="3" />
      <line x1="20" y1="15" x2="36" y2="15" />
      <line x1="31" y1="15" x2="31" y2="20" />
      <line x1="35" y1="15" x2="35" y2="19" />
    </svg>
  );
}

// — Hero
function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '100px',
      }}
    >
      <Constellation />

      {/* Subtle radial vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,8,12,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div className="hero-circle" style={{ marginBottom: '56px' }}>
          {/* WHITEKEY */}
          <h1
            className="hero-title"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '56px',
              fontWeight: 500,
              color: '#BD9B60',
              letterSpacing: '16px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            WHITEKEY
          </h1>

          {/* Sub-tagline */}
          <p
            className="hero-subtitle"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '8px',
              textTransform: 'uppercase',
              marginBottom: '36px',
            }}
          >
            ПРЕМИУМ КОНСЬЕРЖ СЕРВИС
          </p>

          {/* Global tagline */}
          <p
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '22px',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            ГЛОБАЛЬНЫЙ ЧАСТНЫЙ КОНСЬЕРЖ
          </p>

          {/* Philosophy */}
          <p
            className="hero-tagline"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '17px',
              fontStyle: 'italic',
              color: '#BD9B60',
              letterSpacing: '2px',
              marginBottom: '16px',
            }}
          >
            Открываем двери, о существовании которых вы не знали.
          </p>

          {/* Cities */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              marginBottom: '56px',
            }}
          >
            Дубай • Москва • Сочи
          </p>

          {/* CTA */}
          <a
            href="https://t.me/WhiteKeyConcierge"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{
              padding: '14px 40px',
              fontSize: '10px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            НАЧАТЬ ДИАЛОГ
          </a>
        </div>

        {/* Chevron (scroll indicator) */}
        <a
          href="#about"
          className="chevron-float"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            textDecoration: 'none',
            zIndex: 1,
          }}
        >
          <ChevronDown size={18} color="rgba(189,155,96,0.5)" strokeWidth={1} />
        </a>
      </div>
    </section>
  );
}

// — Section header
function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
      <p
        className="section-heading"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          color: '#BD9B60',
          letterSpacing: '8px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
      <div
        className="shimmer-line"
        style={{
          width: '40px',
          height: '1px',
          margin: '18px auto 0',
        }}
      />
    </div>
  );
}

// — About
function About() {
  return (
    <section
      id="about"
      className="section-pad"
      style={{ padding: '140px 24px', position: 'relative' }}
    >
      <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
        <Fade>
          <SectionHeader label="НЕ СЕРВИС. ФИЛОСОФИЯ ДОВЕРИЯ." />
        </Fade>

        <Fade delay="delay-1">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.58)',
              letterSpacing: '3px',
              lineHeight: '2',
              maxWidth: '700px',
              margin: '0 auto 32px',
            }}
          >
            WHITEKEY — это экосистема решений для людей, которые не привыкли ждать и объяснять. Мы сопровождаем вас в самых сложных вопросах: от финансовой свободы до личной безопасности, от переезда в новую страну до организации событий, которые останутся в истории.
          </p>
        </Fade>

        <Fade delay="delay-2">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.58)',
              letterSpacing: '3px',
              lineHeight: '2',
              maxWidth: '700px',
              margin: '0 auto 64px',
            }}
          >
            Наши эксперты в Дубае, Москве и Сочи работают как единый механизм, чтобы вы никогда не чувствовали себя один на один с бюрократией или неопределённостью.
          </p>
        </Fade>

        <Fade delay="delay-3">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: '80px',
                height: '1px',
                background: 'rgba(189,155,96,0.3)',
              }}
            />
            <p
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '20px',
                fontStyle: 'italic',
                color: '#BD9B60',
                letterSpacing: '2px',
                textAlign: 'center',
              }}
            >
              Мы не задаём вопросов. Мы находим ответы.
            </p>
            <div
              style={{
                flex: 1,
                maxWidth: '80px',
                height: '1px',
                background: 'rgba(189,155,96,0.3)',
              }}
            />
          </div>
        </Fade>
      </div>
    </section>
  );
}

// — Atmospheric photo strip
function AtmoStrip() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        backgroundImage:
          'url(https://images.pexels.com/photos/62693/pexels-photo-62693.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
      className="atmo-strip-bg"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
        }}
      />

      <p
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: '"Cormorant Garamond", serif',
          fontStyle: 'italic',
          fontSize: '20px',
          color: '#BD9B60',
          letterSpacing: '2px',
          margin: 0,
        }}
      >
        Вас не должны видеть. Вас должны знать.
      </p>

      <p
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '12px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          color: '#BD9B60',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        WHITEKEY
      </p>
    </section>
  );
}

// — Services
const SERVICES = [
  {
    Icon: DollarSign,
    title: 'ФИНАНСОВАЯ МОБИЛЬНОСТЬ',
    desc: 'Офшорные счета. SWIFT-переводы. Криптовалюты. Полная легализация активов.',
  },
  {
    Icon: Globe,
    title: 'ВИЗЫ И МИГРАЦИЯ',
    desc: 'Второе гражданство. ВНЖ. Виза. Загранпаспорта со сложной историей.',
  },
  {
    Icon: Briefcase,
    title: 'ЮРИДИЧЕСКАЯ ЗАЩИТА',
    desc: 'Открытие счетов по всему миру. Снятие блокировок по 115-ФЗ. Санкционный консалтинг.',
  },
  {
    Icon: Shield,
    title: 'БЕЗОПАСНОСТЬ И PRIVACY',
    desc: 'Защита от киберугроз и ЕС. Конфиденциальная юридическая поддержка.',
  },
  {
    Icon: Sparkles,
    title: 'ЛАЙФСТАЙЛ И ЭКСКЛЮЗИВ',
    desc: 'Ужин в стратосфере. Реклама на Times Square. Подъём на Эверест. Ювелирные изделия. Премиум-авто из Кореи. Закрытый шопинг — прямые поставки от производителей по лучшим ценам.',
  },
];

function Services() {
  return (
    <section id="services" className="section-pad" style={{ padding: '140px 24px' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <Fade>
          <SectionHeader label="ДОСТУП К ЗАКРЫТОМУ МИРУ" />
        </Fade>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {SERVICES.map(({ Icon, title, desc }, i) => (
            <Fade key={title} delay={`delay-${Math.min(i + 1, 4)}`}>
              <div className="service-card">
                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                  <Icon size={20} strokeWidth={1} color="rgba(189,155,96,0.7)" />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#BD9B60',
                      letterSpacing: '5px',
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '16px',
                      fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.5)',
                      letterSpacing: '1px',
                      lineHeight: 1.7,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>

        <Fade>
          <p
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '17px',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '2px',
              textAlign: 'center',
              marginTop: '60px',
            }}
          >
            Любая задача — от обыденной до немыслимой.<br />
            Мы не говорим «нет», Мы ищем «как».
          </p>
        </Fade>
      </div>
    </section>
  );
}

// — Why
const WHY = [
  {
    title: 'ДВА ЧАСОВЫХ ПОЯСА',
    desc: 'Ваш запрос не останется без ответа никогда. Дубай. Москва.',
  },
  {
    title: 'ЗАКРЫТЫЙ ДОСТУП',
    desc: 'Нас не найти в рекламе. Только личные рекомендации.',
  },
  {
    title: 'КОМАНДА ПРОФЕССИОНАЛОВ',
    desc: 'Юристы, финансисты, стратеги, организаторы.',
  },
  {
    title: '100% КОНФИДЕНЦИАЛЬНОСТЬ',
    desc: 'Ваши данные и планы остаются только между нами.',
  },
  {
    title: 'НИКАКОЙ БЮРОКРАТИИ',
    desc: 'Вы даёте задачу. Мы приносим результат.',
  },
];

function Why() {
  return (
    <section
      className="section-pad"
      style={{ padding: '140px 24px', background: 'rgba(10,10,28,0.5)' }}
    >
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <SectionHeader label="ПОЧЕМУ МИРОВАЯ ЭЛИТА ВЫБИРАЕТ НАС" />

        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {WHY.map(({ title, desc }, i) => (
            <Fade key={title} delay={`delay-${Math.min(i + 1, 4)}`}>
              <div className="why-point">
                {/* Gold dot */}
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#BD9B60',
                    flexShrink: 0,
                    marginTop: '6px',
                  }}
                />
                <div>
                  <h3
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.9)',
                      letterSpacing: '5px',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '16px',
                      fontStyle: 'italic',
                      color: 'rgba(255,255,255,0.45)',
                      letterSpacing: '1px',
                      lineHeight: 1.7,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

// — Cases
const CASES = [
  'Переезд семьи из 5 человек в Европу с полным юридическим сопровождением. 3 недели.',
  'Второе гражданство для предпринимателя со сложной историей доходов.',
  'Частный ужин на высоте 30 км для топ-менеджера международной корпорации.',
  'Разблокировка счетов на €2 млн и полная легализация.',
];

function Cases() {
  return (
    <section id="cases" className="section-pad" style={{ padding: '140px 24px' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <Fade>
          <SectionHeader label="РЕШЁННЫЕ ЗАДАЧИ" />
        </Fade>

        <div
          className="cases-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}
        >
          {CASES.map((text, i) => (
            <Fade key={i} delay={`delay-${Math.min(i + 1, 4)}`}>
              <div className="case-card" style={{ height: '100%' }}>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '9px',
                    color: 'rgba(189,155,96,0.5)',
                    letterSpacing: '5px',
                    textTransform: 'uppercase',
                    marginBottom: '20px',
                  }}
                >
                  КЕЙС {String(i + 1).padStart(2, '0')}
                </div>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '18px',
                    fontStyle: 'italic',
                    color: 'rgba(255,255,255,0.65)',
                    letterSpacing: '1px',
                    lineHeight: 1.7,
                  }}
                >
                  {text}
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

// — Family
function Family() {
  return (
    <section
      className="section-pad"
      style={{
        padding: '140px 24px',
        background: 'rgba(10,10,28,0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative marble-like texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(120deg, transparent, transparent 80px, rgba(189,155,96,0.012) 80px, rgba(189,155,96,0.012) 81px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '880px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Fade>
          <SectionHeader label="МЫ ДУМАЕМ О БУДУЩЕМ ВАШИХ ДЕТЕЙ" />
        </Fade>

        <Fade delay="delay-1">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '3px',
              lineHeight: 2,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            WHITEKEY работает с семьями, которые заботятся о каждом шаге своего ребёнка. Гражданство, образование, финансовая безопасность, доступ к лучшим медицинским и образовательным учреждениям мира — мы строим фундамент, на котором вырастет следующее поколение вашей династии.
          </p>
        </Fade>

        {/* Decorative key divider */}
        <Fade delay="delay-2">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              marginTop: '64px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '1px',
                background: 'rgba(189,155,96,0.25)',
              }}
            />
            <Key size={14} color="rgba(189,155,96,0.4)" strokeWidth={1} />
            <div
              style={{
                width: '60px',
                height: '1px',
                background: 'rgba(189,155,96,0.25)',
              }}
            />
          </div>
        </Fade>
      </div>
    </section>
  );
}

// — FAQ
const FAQ = [
  {
    q: 'КТО ВЫ ТАКИЕ?',
    a: 'Частный консьерж-офис. Мы не агентство, не платформа и не стартап. Мы — команда экспертов, которая решает задачи закрытого уровня. Нас не найти в поиске — к нам приходят по рекомендации.',
  },
  {
    q: 'КАК ВЫ ГАРАНТИРУЕТЕ КОНФИДЕНЦИАЛЬНОСТЬ?',
    a: 'Мы не храним ваши данные дольше, чем длится задача. Мы не ведём соцсети с кейсами. Мы не называем имён. Ваш запрос исчезает из нашей системы после выполнения. Это не маркетинг — это наша бизнес-модель.',
  },
  {
    q: 'СКОЛЬКО СТОЯТ ВАШИ УСЛУГИ?',
    a: 'Вы платите напрямую исполнителю (банку, клинике, юристу). Мы получаем комиссию от партнёра. Для вас финальная цена не меняется. В некоторых случаях мы берём фиксированный гонорар за координацию сложных проектов — это обсуждается до старта.',
  },
  {
    q: 'КАК БЫСТРО ВЫ РЕШАЕТЕ ЗАДАЧИ?',
    a: 'Стандартный срок первой реакции — 24 часа. Многие вопросы решаются за 2–5 дней. Срочные задачи (визы, переводы, блокировки) мы берём в работу немедленно, иногда с решением в течение нескольких часов.',
  },
  {
    q: 'С КАКИМИ СТРАНАМИ ВЫ РАБОТАЕТЕ?',
    a: 'Мы работаем глобально. Основные хабы: ОАЭ, ЕС, Великобритания, Турция, СНГ, Юго-Восточная Азия, Карибский бассейн. Если страны нет в нашем пуле — мы найдём локального партнёра за 48 часов.',
  },
  {
    q: 'ВЫ РАБОТАЕТЕ С ЛЮДЬМИ С САНКЦИЯМИ ИЛИ СЛОЖНОЙ ИСТОРИЕЙ?',
    a: 'Да. Это один из наших профилей. Мы помогаем с разблокировкой счетов, легализацией активов, получением виз и ВНЖ для клиентов с нетипичными обстоятельствами. Каждый случай анализируется индивидуально.',
  },
  {
    q: 'КТО КОНКРЕТНО БУДЕТ ВЕСТИ МОЮ ЗАДАЧУ?',
    a: 'Вы общаетесь с одним персональным менеджером. За ним стоит команда: юрист, финансист, логист, организатор — в зависимости от задачи. Вы не переключаетесь между десятью людьми. У вас один контакт.',
  },
  {
    q: 'КАК ПРОИСХОДИТ ОПЛАТА?',
    a: 'Поэтапно. Либо напрямую исполнителю, либо через защищённый платёж. Мы не требуем 100% предоплаты за сложные проекты. Условия фиксируются в договоре или меморандуме.',
  },
  {
    q: 'ЧТО, ЕСЛИ ЗАДАЧА НЕВЫПОЛНИМА?',
    a: 'Мы честно скажем об этом до того, как возьмём проект в работу. Мы не обещаем то, чего не можем сделать. Если решение существует — мы его найдём. Если нет — вы узнаете об этом первыми и бесплатно.',
  },
  {
    q: 'ВЫ РАБОТАЕТЕ ТОЛЬКО С МИЛЛИОНЕРАМИ?',
    a: 'Нет. Мы работаем с теми, кто ценит время, приватность и профессиональное исполнение. У нас есть задачи с бюджетом от нескольких тысяч долларов и проекты с семизначными чеками. Критерий не кошелёк, а сложность и требования к конфиденциальности.',
  },
  {
    q: 'МОЖНО ЛИ ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ БЕСПЛАТНО?',
    a: 'Первичный анализ задачи — да. Вы описываете запрос, мы оцениваем реалистичность, сроки и бюджет. Это бесплатно и ни к чему вас не обязывает. Детальная проработка с документами и планом действий — после согласования условий.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(189,155,96,0.15)',
        cursor: 'pointer',
        padding: '24px 0',
      }}
      onClick={() => setOpen((v) => !v)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: '#BD9B60',
            letterSpacing: '2px',
            margin: 0,
            flex: 1,
          }}
        >
          {q}
        </p>
        <Plus
          size={14}
          strokeWidth={1}
          color="#BD9B60"
          style={{
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform 0.35s ease',
            flexShrink: 0,
          }}
        />
      </div>
      <div
        style={{
          maxHeight: open ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.8,
            margin: '16px 0 0',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="section-pad" style={{ padding: '140px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Fade>
          <SectionHeader label="ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ" />
        </Fade>

        <Fade delay="delay-1">
          <div style={{ borderTop: '1px solid rgba(189,155,96,0.15)' }}>
            {FAQ.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

// — How to start
const STEPS = [
  {
    n: '01',
    title: 'ОПИШИТЕ ЗАДАЧУ',
    desc: 'Напишите в Telegram. Без форм и анкет.',
  },
  {
    n: '02',
    title: 'ПОЛУЧИТЕ РЕШЕНИЕ',
    desc: 'В течение 24 часов мы предложим план действий.',
  },
  {
    n: '03',
    title: 'ДЕЙСТВУЙТЕ',
    desc: 'Вы принимаете решение. Мы исполняем.',
  },
];

function HowToStart() {
  return (
    <section id="how" className="section-pad" style={{ padding: '140px 24px', background: 'rgba(10,10,28,0.5)' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <Fade>
          <SectionHeader label="КАК НАЧАТЬ" />
        </Fade>

        <Fade delay="delay-1">
          <div
            className="steps-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              alignItems: 'start',
            }}
          >
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                style={{
                  position: 'relative',
                  padding: '0 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Number circle */}
                <div
                  className="step-circle"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '1px solid rgba(189,155,96,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '16px',
                    color: '#BD9B60',
                    letterSpacing: '2px',
                    position: 'relative',
                    zIndex: 2,
                    background: '#08080C',
                  }}
                >
                  {s.n}
                </div>

                {/* Connector - starts right of this circle, ends left of next */}
                {i < STEPS.length - 1 && (
                  <div
                    className="step-connector"
                    style={{
                      position: 'absolute',
                      top: '28px',
                      left: 'calc(50% + 36px)',
                      width: 'calc(100% - 72px)',
                      height: '1px',
                      background: 'rgba(189,155,96,0.25)',
                      zIndex: 1,
                    }}
                  />
                )}

                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,1)',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}
                >
                  {s.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

// — Contacts
const OFFICES = [
  { city: 'ДУБАЙ', area: '' },
  { city: 'МОСКВА', area: '' },
  { city: 'СОЧИ', area: '' },
];

function Contacts() {
  return (
    <section id="contacts" className="section-pad" style={{ padding: '140px 24px' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
        <Fade>
          <SectionHeader label="НАЧАТЬ ДИАЛОГ" />
        </Fade>

        <Fade delay="delay-1">
          <div
            className="contact-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '24px',
              marginBottom: '64px',
            }}
          >
            {OFFICES.map(({ city }) => (
              <div key={city} className="contact-card">
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#BD9B60',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  {city}
                </p>
              </div>
            ))}
          </div>
        </Fade>

        <Fade delay="delay-2">
          <a
            href="https://t.me/WhiteKeyConcierge"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            НАПИСАТЬ МЕНЕДЖЕРУ
          </a>
        </Fade>

        <Fade delay="delay-3">
          <a
            href="mailto:info@whitekey.online"
            style={{
              display: 'inline-block',
              marginTop: '24px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#BD9B60',
              letterSpacing: '2px',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
          >
            info@whitekey.online
          </a>
        </Fade>
      </div>
    </section>
  );
}

// — Floating button
function FloatingButton() {
  return (
    <a
      href="https://t.me/WhiteKeyConcierge"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-btn"
    >
      НАЧАТЬ ДИАЛОГ
    </a>
  );
}

// — Footer
function Footer() {
  return (
    <footer id="contacts" style={{ padding: '0 24px 60px' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Shimmer divider */}
        <div
          className="shimmer-line"
          style={{
            width: '100%',
            height: '1px',
            marginBottom: '56px',
          }}
        />

        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '22px',
              fontWeight: 500,
              color: '#BD9B60',
              letterSpacing: '12px',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}
          >
            WHITEKEY
          </p>

          <a
            href="https://t.me/WhiteKeyConcierge"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 300,
              color: '#BD9B60',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'block',
              marginBottom: '12px',
              transition: 'color 0.35s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#BD9B60')}
          >
            Telegram: @whiteKeyConcierge
          </a>

          <a
            href="mailto:info@whitekey.online"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 300,
              color: '#BD9B60',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'block',
              marginBottom: '28px',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#BD9B60')}
          >
            info@whitekey.online
          </a>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '3px',
              marginBottom: '0',
            }}
          >
            © WHITEKEY. Все права защищены. Конфиденциальность — наш приоритет.
          </p>
        </div>
      </div>
    </footer>
  );
}

// — App
export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#08080C', color: '#fff' }}>
      <Header />
      <Hero />
      <About />
      <Services />
      <Why />
      <Cases />
      <HowToStart />
      <FAQSection />
      <Contacts />
      <Footer />
      <FloatingButton />
    </div>
  );
}
