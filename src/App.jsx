import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp, ShieldCheck,
  Menu, X, ChevronDown,
  Globe, Instagram, Linkedin, ExternalLink, MapPin, Award,
  ArrowRight, Briefcase, Users, CreditCard, Smartphone, Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BRAPI_TOKEN = import.meta.env.VITE_BRAPI_API_KEY;

// --- Data ---
/* const SEGMENTS = [
  {
    title: 'Investimentos',
    handle: 'cais.investimentos',
    desc: 'Wealth Management e estratégias sob medida no mercado financeiro global em parceria com a Necton | BTG Pactual.',
    icon: <TrendingUp size={28} />
  },
  {
    title: 'Consórcio',
    handle: 'cais.consorcio',
    desc: 'Planejamento inteligente e estruturado para a conquista de patrimônio imobiliário e veicular com eficiência.',
    icon: <ShieldCheck size={28} />
  },
  {
    title: 'Advisory',
    handle: 'cais.advisory',
    desc: 'Consultoria estratégica para fusões, aquisições e estruturação de capital para empresas de alta performance.',
    icon: <Briefcase size={28} />
  },
  {
    title: 'Stones',
    handle: 'cais.stones',
    desc: 'Experiência exclusiva em ativos reais e comercialização curada de gemas e pedras de alto valor agregado.',
    icon: <Award size={28} />
  },
  {
    title: 'Real Estate',
    handle: 'cais.realestate',
    desc: 'Curadoria de oportunidades e investimentos estratégicos no mercado imobiliário nacional e internacional.',
    icon: <MapPin size={28} />
  }
]; */

const TEAM = [
  {
    name: 'Wellington Nunes',
    role: 'Diretor de Investimentos',
    bio: 'Administrador de Empresas, Especialista em Investimentos CEA e Planejador Financeiro CFP®.',
    image: '/Wellington.png',
  },
  {
    name: 'Wallan Fromholz',
    role: 'Especialista em Agronegócios',
    bio: 'Especialista em soluções de Seguros e Logística voltadas ao setor Agro.',
    image: '/Wallan.png',
  },
  {
    name: 'Eduardo Brandão',
    role: 'Gestão de Processos',
    bio: 'Expressiva vivência em gestão corporativa de grandes companhias.',
    image: '/Eduardo.png',
  }
];

// --- Sub-components ---
const FadeIn = ({ children, direction = "up", delay = 0, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
        x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
      }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StockTicker = ({ stocks }) => (
  <div className="w-full bg-slate-50 border-b border-border py-2 overflow-hidden whitespace-nowrap">
    <div className="flex animate-marquee hover:pause-marquee">
      {[...stocks, ...stocks].map((stock, i) => (
        <div key={`${stock.ticker}-${i}`} className="inline-flex items-center gap-3 mx-6 group cursor-default">
          <span className="text-xs font-semibold text-brand-blue uppercase">{stock.stock}</span>
          <span className="text-[11px] text-muted-foreground font-medium">R$ {stock.close.toFixed(2)}</span>
          <span className={cn(
            "text-[11px] font-bold flex items-center gap-1",
            stock.change >= 0 ? "text-emerald-600" : "text-rose-600"
          )}>
            {stock.change >= 0 ? "▲" : "▼"} {Math.abs(stock.change).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 w-full z-50 transition-all duration-300 bg-white border-b border-border shadow-sm group"
      >
        <div className="px-6 lg:px-20 py-0 flex justify-between items-center h-20 relative z-50 bg-white">
          <div className="flex items-center h-full">
            <img
              src="/CAIS-Principal.svg"
              alt="Cais Logo"
              className="w-32 hover:opacity-80 transition-opacity cursor-pointer mt-1"
            />
          </div>

          <div className="hidden lg:flex gap-8 items-center h-full text-sm font-medium text-brand-blue">
            <a href="#" className="hover:text-brand-gold transition-colors flex items-center h-full gap-1" onClick={() => setActiveMenu(null)}>{t('navbar.a_cais')} <ChevronDown className="w-4 h-4" /></a>

            {/* Mega Menu Trigger */}
            <div
              className={cn("flex items-center h-full cursor-pointer hover:text-brand-gold transition-colors gap-1 border-b-2", activeMenu === 'investimentos' ? "border-brand-gold text-brand-gold" : "border-transparent")}
              onClick={() => setActiveMenu(activeMenu === 'investimentos' ? null : 'investimentos')}
            >
              {t('navbar.investimentos')} <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", activeMenu === 'investimentos' && "rotate-180")} />
            </div>

            <a href="#contato" className="hover:text-brand-gold transition-colors flex items-center h-full gap-1" onClick={() => setActiveMenu(null)}>{t('navbar.contato')} <ChevronDown className="w-4 h-4" /></a>
            <a href="#simulador" className="hover:text-brand-gold transition-colors flex items-center h-full gap-1" onClick={() => setActiveMenu(null)}>{t('navbar.simular_investimentos')} <ChevronDown className="w-4 h-4" /></a>
          </div>

          <div className="flex items-center h-full gap-6">
            <div className="flex gap-2">
              <button onClick={() => i18n.changeLanguage('pt')} className={cn("text-xs font-bold", i18n.language === 'pt' ? "text-brand-gold" : "text-brand-blue")}>PT</button>
              <button onClick={() => i18n.changeLanguage('en')} className={cn("text-xs font-bold", i18n.language === 'en' ? "text-brand-gold" : "text-brand-blue")}>EN</button>
              <button onClick={() => i18n.changeLanguage('es')} className={cn("text-xs font-bold", i18n.language === 'es' ? "text-brand-gold" : "text-brand-blue")}>ES</button>
            </div>
            <button className="lg:hidden text-brand-blue" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu === 'investimentos' && (
            <motion.div
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-20 left-0 w-full bg-white border-t border-border shadow-2xl overflow-hidden z-40"
            >
              <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto min-h-[420px]">
                {/* Left Column - Navigation Links */}
                <div className="w-full lg:w-[25%] py-8 border-r border-slate-100 pl-6 lg:pl-20 pr-8 bg-slate-50/50">
                  <div className="flex flex-col gap-1">
                    {[
                      "fundos_de_investimento", "renda_fixa", "renda_variavel",
                      "fundos_imobiliarios", "previdencia_privada", "alternativos",
                      "cambio_e_remessas", "seguro_de_vida", "offshore"
                    ].map((item, idx) => (
                      <a key={idx} href="#" className="flex items-center justify-between text-[13px] py-3 text-brand-blue/80 hover:text-brand-blue font-semibold border-b border-border/40 hover:border-brand-blue/30 transition-all group" onClick={() => setActiveMenu(null)}>
                        {t(`navbar.${item}`)}
                        <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-all text-brand-gold -translate-x-2 group-hover:translate-x-0" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Center Column - Featured Item */}
                <div className="w-full lg:w-[48%] p-10 flex flex-col gap-6 justify-center">
                  <div className="w-full h-[220px] rounded-xl overflow-hidden shadow-sm relative group cursor-pointer" onClick={() => setActiveMenu(null)}>
                    <img
                      src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
                      alt="Conta Corrente BTG Pactual"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-blue/90 via-transparent to-transparent flex flex-col justify-end p-6">
                      <span className="text-white text-xs font-bold uppercase tracking-wider mb-1">{t('navbar.destaque')}</span>
                      <span className="text-white font-semibold text-lg">{t('navbar.solucoes_completas')}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-brand-blue mb-2">{t('navbar.para_voce')}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl font-light">
                      {t('navbar.para_voce_desc')}
                    </p>
                  </div>
                </div>

                {/* Right Column - CTAs */}
                <div className="w-full lg:w-[27%] flex flex-col h-auto">
                  <div className="flex-1 bg-brand-blue p-10 flex flex-col justify-center group cursor-pointer relative overflow-hidden" onClick={() => setActiveMenu(null)}>
                    <div className="absolute inset-0 bg-brand-blue group-hover:bg-[#081b2e] transition-colors z-0" />
                    <div className="relative z-10">
                      <h4 className="text-white font-semibold text-[17px] mb-2">{t('navbar.abra_sua_conta')}</h4>
                      <p className="text-white/70 text-sm mb-6 leading-relaxed font-light">{t('navbar.melhores_produtos')}</p>
                      <ArrowRight className="w-5 h-5 text-white group-hover:text-brand-gold group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                  <div className="flex-1 bg-[#0d2a45] p-10 flex flex-col justify-center group cursor-pointer relative overflow-hidden" onClick={() => setActiveMenu(null)}>
                    <div className="absolute inset-0 bg-[#0d2a45] group-hover:bg-[#071829] transition-colors z-0" />
                    <div className="relative z-10 border-t border-white/10 pt-6 mt-[-24px]">
                      <h4 className="text-white font-semibold text-[17px] mb-2">{t('navbar.advisory_estrategico')}</h4>
                      <p className="text-white/70 text-sm mb-6 leading-relaxed font-light">{t('navbar.solucoes_sofisticadas')}</p>
                      <ArrowRight className="w-5 h-5 text-white group-hover:text-brand-gold group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 border-b border-border shadow-lg h-fit pb-8"
          >
            <div className="flex flex-col gap-6 text-base font-medium text-brand-blue">
              <a href="#" onClick={() => setIsOpen(false)}>A Cais</a>
              <a href="#investimentos" onClick={() => setIsOpen(false)}>Investimentos</a>
              <a href="#contato" onClick={() => setIsOpen(false)}>Fale Conosco</a>
              <a href="#simulador" onClick={() => setIsOpen(false)}>Simular Investimentos</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full flex flex-col md:flex-row mt-20 min-h-[500px] lg:min-h-[550px] bg-brand-blue overflow-hidden">
      <div className="w-full md:w-[50%] lg:w-[55%] flex flex-col justify-center px-6 lg:px-20 py-20 lg:py-24 text-white z-10">
        <FadeIn direction="right">
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-medium mb-6 leading-[1.2] text-white tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-white/80 text-base lg:text-lg mb-10 max-w-xl font-light leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </FadeIn>
      </div>

      <div className="w-full md:w-[50%] lg:w-[45%] relative min-h-[400px]">
        {/* Placeholder image simulating the professional hero image */}
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
          alt="Professional"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-90 grayscale-20"
        />
        {/* Gradient transition for desktop */}
        <div className="absolute inset-0 bg-linear-to-r from-brand-blue via-brand-blue/30 to-transparent hidden md:block w-40 left-0" />
      </div>
    </section>
  );
};



const MarketCard = ({ stock }) => (
  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md hover:border-brand-gold/50 transition-all bg-white group">
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-brand-blue">{stock.stock}</span>
      <span className="text-[10px] text-muted-foreground uppercase">{stock.name}</span>
    </div>
    <div className="text-right">
      <div className="text-sm font-semibold text-brand-blue">
        {stock.close.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>
      <div className={cn(
        "text-xs font-semibold flex items-center justify-end gap-1 mt-1",
        stock.change >= 0 ? "text-emerald-600" : "text-rose-600"
      )}>
        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
      </div>
    </div>
  </div>
);

const MarketIntelligence = () => {
  const { t } = useTranslation();
  const [marketData, setMarketData] = useState({ gainers: [], losers: [], loading: true });

  const fetchMarket = async () => {
    try {
      if (!BRAPI_TOKEN) return;
      const gRes = await fetch(`https://brapi.dev/api/quote/list?token=${BRAPI_TOKEN}&sortBy=change&sortOrder=desc&limit=4`);
      const lRes = await fetch(`https://brapi.dev/api/quote/list?token=${BRAPI_TOKEN}&sortBy=change&sortOrder=asc&limit=4`);
      const gData = await gRes.json();
      const lData = await lRes.json();

      setMarketData({
        gainers: gData.stocks || [],
        losers: lData.stocks || [],
        loading: false
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchMarket();
  }, []);

  return (
    <section id="mercado" className="py-24 bg-slate-50 border-t border-border md:px-20">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <FadeIn direction="right" className="max-w-xl">
            <h2 className="text-3xl md:text-4xl text-brand-blue font-medium mb-4">
              {t('market.title')}
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              {t('market.desc')}
            </p>
          </FadeIn>
          <FadeIn direction="left">
            <Button variant="outline" className="border-border text-brand-blue bg-white shadow-sm font-medium">
              {t('market.btn')}
            </Button>
          </FadeIn>
        </div>

        {!marketData.loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">{t('market.high')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {marketData.gainers.map(stock => (
                  <MarketCard key={stock.stock} stock={stock} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">{t('market.low')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {marketData.losers.map(stock => (
                  <MarketCard key={stock.stock} stock={stock} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">{t('market.loading')}</span>
          </div>
        )}
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <section id="sobre" className="py-24 bg-slate-50 md:px-20 border-t border-border">
      <div className="container px-6">
        <FadeIn direction="up">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-brand-blue mb-8">
              {t('about.title')}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
              <p>{t('about.p1')}</p>
              <p className="font-medium text-brand-gold text-xl pt-4">{t('about.p2')}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const AdvisorySection = () => {
  const { t } = useTranslation();
  return (
    <section id="assessoria" className="py-24 bg-white md:px-20 border-t border-border">
      <div className="container px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-medium text-brand-blue mb-4">
              {t('advisory.title')}
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              {t('advisory.subtitle')}
            </p>
          </FadeIn>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Assessoria Pessoal */}
          <FadeIn className="flex-1 bg-slate-50 border border-border rounded-3xl p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />

            <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-8">
              <Users className="w-7 h-7 text-brand-blue" />
            </div>

            <h3 className="text-2xl font-semibold text-brand-blue mb-4">
              {t('advisory.personal.title')}
            </h3>

            <p className="text-muted-foreground font-light leading-relaxed mb-4">
              {t('advisory.personal.p1')}
            </p>
            <p className="text-muted-foreground font-light leading-relaxed mb-6">
              {t('advisory.personal.p2')}
            </p>

            <p className="text-brand-blue font-medium mb-8">
              {t('advisory.personal.p3')}
            </p>

            <ul className="space-y-4 mb-2 mt-auto">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                </div>
                <span className="text-sm font-medium text-brand-blue">{t('advisory.personal.li1')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                </div>
                <span className="text-sm font-medium text-brand-blue">{t('advisory.personal.li2')}</span>
              </li>
            </ul>
          </FadeIn>

          {/* Assessoria Empresarial */}
          <FadeIn delay={0.2} className="flex-1 bg-brand-blue rounded-3xl p-10 shadow-2xl relative overflow-hidden group flex flex-col">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-gold/10 rounded-t-full rounded-bl-full blur-2xl -z-10" />

            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/5">
              <Briefcase className="w-7 h-7 text-brand-gold" />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-4">
              {t('advisory.business.title')}
            </h3>

            <p className="text-white/80 font-light leading-relaxed mb-4">
              {t('advisory.business.p1')}
            </p>
            <p className="text-white/80 font-light leading-relaxed mb-6">
              {t('advisory.business.p2')}
            </p>

            <p className="text-brand-gold font-medium mb-8">
              {t('advisory.business.p3')}
            </p>

            <ul className="space-y-4 mb-2 mt-auto">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                </div>
                <span className="text-sm font-medium text-white">{t('advisory.business.li1')}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                </div>
                <span className="text-sm font-medium text-white">{t('advisory.business.li2')}</span>
              </li>
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const CardSection = () => {
  const { t } = useTranslation();
  return (
    <section id="cartoes" className="py-24 bg-white md:px-20 border-t border-border">
      <div className="container px-6 flex flex-col items-center">

        {/* Top Half: Ultrablue Focus */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-24 w-full max-w-[1200px]">
          <div className="w-full lg:w-1/2">
            <FadeIn direction="right">
              <h2 className="text-3xl md:text-5xl font-medium text-brand-blue mb-6 leading-tight">
                {t('cards.title')}
              </h2>
              <p className="text-brand-blue/80 text-lg font-light mb-8 leading-relaxed max-w-xl">
                {t('cards.desc')}
              </p>
              <Button className="bg-[#1853a8] hover:bg-[#124185] text-white font-medium py-6 px-10 text-base rounded-md transition-all shadow-md">
                {t('cards.btn')}
              </Button>
            </FadeIn>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <FadeIn direction="left" delay={0.2} className="relative group">
              <div className="absolute inset-0 bg-[#0d2a45]/20 blur-3xl rounded-full scale-90 group-hover:scale-105 transition-transform duration-700" />
              <img
                src="/cartao-ultrablue.png"
                alt="Cartão Ultrablue BTG Pactual"
                className="w-full max-w-[480px] h-auto object-cover relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
              />
            </FadeIn>
          </div>
        </div>

        {/* Bottom Half: Features side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1200px]">
          {[
            {
              icon: <Smartphone className="w-8 h-8 text-[#1853a8]" strokeWidth={1.2} />,
              title: t('cards.f1.title'),
              desc: t('cards.f1.desc')
            },
            {
              icon: <CreditCard className="w-8 h-8 text-[#1853a8]" strokeWidth={1.2} />,
              title: t('cards.f2.title'),
              desc: t('cards.f2.desc')
            },
            {
              icon: <Star className="w-8 h-8 text-[#1853a8]" strokeWidth={1.2} />,
              title: t('cards.f3.title'),
              desc: t('cards.f3.desc')
            },
            {
              icon: <Globe className="w-8 h-8 text-[#1853a8]" strokeWidth={1.2} />,
              title: t('cards.f4.title'),
              desc: t('cards.f4.desc')
            }
          ].map((feature, idx) => (
            <FadeIn
              CaisInvestimento key={feature.title}
              delay={idx * 0.1}
              className="group flex flex-col p-8 bg-white border border-border hover:border-[#1853a8]/20 hover:shadow-xl transition-all duration-300 rounded-lg min-h-[300px]"
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-brand-blue mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-[14px] font-light leading-relaxed mb-auto">
                {feature.desc}
              </p>
              <div className="pt-8 mt-auto flex items-center gap-2 group-hover:text-[#1853a8] transition-colors cursor-pointer text-brand-blue/80">
                <span className="text-sm font-medium">{t('cards.saiba_mais')}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
};

const SimulatorSection = () => {
  const { t } = useTranslation();
  return (
    <section id="simulador" className="py-24 bg-white md:px-20 border-t border-border">
      <div className="container px-6">
        <div className="bg-brand-blue rounded-3xl p-10 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
          {/* Background Gradient & Effects */}
          <div className="absolute inset-0 bg-linear-to-r from-brand-blue via-[#0d2a45] to-brand-blue" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl" />

          <div className="relative z-10 lg:w-1/2">
            <FadeIn direction="right">
              <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
                {t('simulator.title')} <span className="text-brand-gold">{t('simulator.title_highlight')}</span>
              </h2>
              <p className="text-white/80 text-lg font-light mb-8 leading-relaxed">
                {t('simulator.desc')}
              </p>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 text-sm text-white/70 font-medium bg-white/5 py-2 px-4 rounded-full border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-brand-gold" />
                  {t('simulator.tech')}
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="relative z-10 lg:w-1/2 flex justify-center lg:justify-end">
            <FadeIn direction="left" delay={0.2}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl flex flex-col items-center text-center max-w-sm w-full mx-auto shadow-xl">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl text-white font-semibold mb-4">{t('simulator.box_title')}</h3>
                <p className="text-sm text-white/70 font-light mb-8 leading-relaxed">
                  {t('simulator.box_desc')}
                </p>
                <a
                  href="https://simulador.btgpactual.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button className="w-full bg-brand-gold hover:bg-[#c9a55e] text-brand-blue font-semibold py-6 text-base rounded-md transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-gold/20 hover:-translate-y-1">
                    {t('simulator.btn')} <ExternalLink size={18} />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const { t } = useTranslation();
  return (
    <section id="equipe" className="py-24 bg-white md:px-20">
      <div className="container px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-medium text-brand-blue mb-4">
              {t('team.title')}
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              {t('team.desc')}
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM.map((member, i) => (
            <FadeIn key={member.name} delay={i * 0.1}>
              <div className="group rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 bg-white">
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover  translate-y-15 scale-150 group-hover:scale-160 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-brand-blue mb-1">{member.name}</h3>
                  <p className="text-brand-gold font-semibold text-sm mb-4">{t(`team.m${i}.role`)}</p>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">
                    {t(`team.m${i}.bio`)}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const LeadCaptureSection = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', capital: '', honeypot: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mountTime] = useState(Date.now());

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Security Check 1: Honeypot (if bot fills the hidden field)
    if (formData.honeypot) {
      console.warn("Bot detected via honeypot.");
      return; 
    }

    // Security Check 2: Time-based bot detection (less than 2 seconds to fill form)
    if (Date.now() - mountTime < 2000) {
      console.warn("Submission too fast. Possible bot.");
      return;
    }

    setIsLoading(true);

    // Sanitize data
    const sanitizedData = {
      name: formData.name.trim().substring(0, 100),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim().replace(/[^\d()-\s+]/g, ''),
      capital: formData.capital
    };

    // Simulate API call with the sanitized data
    setTimeout(() => {
      console.log("Submitting secure data:", sanitizedData);
      setSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section id="contato" className="py-24 bg-brand-blue relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-b from-brand-blue to-brand-blue/90 border-l border-white/5 skew-x-12 translate-x-32 hidden lg:block" />

      <div className="container px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
              {t('contact.title1')} <span className="text-brand-gold">{t('contact.title2')}</span>
            </h2>
            <p className="text-white/80 text-lg font-light mb-10 leading-relaxed max-w-lg">
              {t('contact.desc')}
            </p>
            <div className="flex items-center gap-6 mt-12 border-t border-white/10 pt-8">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-gold shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">{t('contact.exclusive')}</h4>
                <p className="text-sm text-white/60 font-light">{t('contact.exclusive_desc')}</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-brand-blue mb-4">{t('contact.success')}</h3>
                  <p className="text-muted-foreground font-light mb-8">{t('contact.success_desc')}</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="text-brand-blue border-border">
                    {t('contact.new_msg')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-semibold text-brand-blue mb-6">{t('contact.form_title')}</h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-blue">{t('contact.name')}</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      className="w-full px-4 py-3 rounded-md border border-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-blue">{t('contact.email')}</label>
                      <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 rounded-md border border-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-blue">{t('contact.phone')}</label>
                      <input
                        type="tel"
                        required
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-3 rounded-md border border-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Honeypot Field (Hidden from humans) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website"
                      tabIndex="-1"
                      autoComplete="off"
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-blue">{t('contact.capital')}</label>
                    <select
                      className="w-full px-4 py-3 rounded-md border border-border bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all text-muted-foreground"
                      onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                    >
                      <option value="">{t('contact.select_default')}</option>
                      <option value="Ate 500k">Até R$ 500 mil</option>
                      <option value="500k a 1M">R$ 500 mil a R$ 1 Milhão</option>
                      <option value="1M a 5M">R$ 1 Milhão a R$ 5 Milhões</option>
                      <option value="Acima de 5M">Acima de R$ 5 Milhões</option>
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-brand-gold hover:bg-[#c9a55e] disabled:bg-slate-200 disabled:text-slate-400 text-brand-blue font-semibold py-6 text-base rounded-md mt-4 transition-all relative overflow-hidden"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
                        <span>{t('contact.sending') || 'Enviando...'}</span>
                      </div>
                    ) : (
                      t('contact.btn')
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {t('contact.privacy')}
                  </p>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-brand-blue pt-20 pb-10">
      <div className="container px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-16">
          <div className="md:col-span-5 space-y-8">
            <img
              src="/CAIS-Principal-Branco.svg"
              alt="Cais Footer Logo"
              className="h-10 w-auto"
            />
            <p className="text-base text-white/70 leading-relaxed font-light max-w-sm">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/cais.investimentos" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-blue transition-all"><Instagram size={18} /></a>
              <a href="https://www.linkedin.com/company/cais-investimentos/?originalSubdomain=br" target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-blue transition-all"><Linkedin size={18} /></a>
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-white font-semibold mb-8">{t('footer.hq')}</h4>
            <div className="space-y-6">
              <div className="text-white/70 text-sm font-light space-y-1">
                <p className="text-white font-medium">{t('footer.vitoria')}</p>
                <p>Av. Frederico Grulke, 934, Sala 102</p>
                <p className="text-brand-gold font-medium pt-1">(27) 99714-9473</p>
              </div>
              <div className="text-white/70 text-sm font-light space-y-1">
                <p className="text-white font-medium">{t('footer.recife')}</p>
                <p>Rua Laurindo Coelho, 174, Sala 3</p>
                <p className="text-brand-gold font-medium pt-1">(81) 99601-9115</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-8">{t('footer.service')}</h4>
            <div className="space-y-4">
              <div className="text-white/70 text-sm font-light space-y-1">
                <p className="text-white font-medium">{t('footer.ouvidoria')}</p>
                <p className="text-brand-gold font-medium text-lg pt-1">0800 7220 048</p>
                <a href="https://www.btgpactual.com/ouvidoria" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors underline pt-2">btgpactual.com/ouvidoria</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 pb-4 mb-4 border-t border-white/10 text-[10px] md:text-[11px] text-white/40 leading-relaxed font-light space-y-3 text-justify">
          <p>
            {t('footer.disclaimer.p1')}
            <a href="https://www.ancord.org.br/certificacao-e-credenciamento/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">{t('footer.disclaimer.p1_ancord')}</a>
            {t('footer.disclaimer.p1_ou')}
            <a href="https://www.necton.com.br/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">{t('footer.disclaimer.p1_necton')}</a>
            {t('footer.disclaimer.p1_end')}
          </p>
          <p>
            {t('footer.disclaimer.p2')}
          </p>
          <p>
            {t('footer.disclaimer.p3')}
            <a href="https://www.necton.com.br/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">{t('footer.disclaimer.p3_link')}</a>.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-4 border-top border-white/10">
          <p className="text-xs text-white/40 text-center lg:text-left">
            {t('footer.rights')}
          </p>
          <div className="flex gap-4 items-center h-4 opacity-50">
            <span className="border border-white/20 px-2 text-[10px] font-bold text-white rounded-sm">ANBIMA</span>
            <span className="border border-white/20 px-2 text-[10px] font-bold text-white rounded-sm">CVM</span>
            <span className="text-[10px] font-bold text-white uppercase">Necton | BTG Pactual</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground font-inter selection:bg-brand-pink selection:text-brand-blue transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      <Hero />
      <StockTicker stocks={[]} /> {/* Empty array will just show nothing initially until Brapi fetches, or we can move the state up if we want it global */}

      {/* Quick stats section under hero */}
      <section className="py-12 bg-white border-b border-border">
        <div className="container px-6 lg:px-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-slate-100">
          {[
            { label: t('stats.custodia.label'), value: t('stats.custodia.value'), icon: <ShieldCheck className="w-6 h-6" /> },
            { label: t('stats.assessoria.label'), value: t('stats.assessoria.value'), icon: <Users className="w-6 h-6" /> },
            { label: t('stats.escritorio.label'), value: t('stats.escritorio.value'), icon: <Award className="w-6 h-6" /> },
            { label: t('stats.presenca.label'), value: t('stats.presenca.value'), icon: <Globe className="w-6 h-6" /> }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4">
              <div className="text-brand-blue mb-3">{item.icon}</div>
              <span className="text-base font-semibold text-brand-blue mb-1">{item.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <AboutSection />
      <AdvisorySection />
      <CardSection />
      {/* <MarketIntelligence /> */}
      <SimulatorSection />
      <TeamSection />
      <LeadCaptureSection />
      <Footer />
    </div>
  );
};

export default App;
