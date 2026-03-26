import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
const SEGMENTS = [
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
];

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
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const leaveTimer = useRef(null);

  const handleMouseEnter = (menu) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300 bg-white border-b border-border shadow-sm group"
        onMouseLeave={handleMouseLeave}
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
            <a href="#solucoes" className="hover:text-brand-gold transition-colors flex items-center h-full gap-1">A Cais <ChevronDown className="w-4 h-4" /></a>

            {/* Mega Menu Trigger */}
            <div
              className={cn("flex items-center h-full cursor-pointer hover:text-brand-gold transition-colors gap-1 border-b-2", activeMenu === 'investimentos' ? "border-brand-gold text-brand-gold" : "border-transparent")}
              onMouseEnter={() => handleMouseEnter('investimentos')}
            >
              Investimentos <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", activeMenu === 'investimentos' && "rotate-180")} />
            </div>

            <a href="#equipe" className="hover:text-brand-gold transition-colors flex items-center h-full gap-1">Seja parceiro <ChevronDown className="w-4 h-4" /></a>
            <a href="#simulador" className="hover:text-brand-gold transition-colors flex items-center h-full gap-1">Simular Investimentos <ChevronDown className="w-4 h-4" /></a>
          </div>

          <div className="flex items-center h-full gap-6">
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
              onMouseEnter={() => handleMouseEnter('investimentos')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto min-h-[420px]">
                {/* Left Column - Navigation Links */}
                <div className="w-full lg:w-[25%] py-8 border-r border-slate-100 pl-6 lg:pl-20 pr-8 bg-slate-50/50">
                  <div className="flex flex-col gap-1">
                    {[
                      "Fundos de Investimento", "Renda Fixa", "Renda Variável",
                      "Fundos Imobiliários", "Previdência Privada", "Alternativos",
                      "Câmbio e Remessas", "Seguro de Vida", "Offshore"
                    ].map((item, idx) => (
                      <a key={idx} href="#solucoes" className="flex items-center justify-between text-[13px] py-3 text-brand-blue/80 hover:text-brand-blue font-semibold border-b border-border/40 hover:border-brand-blue/30 transition-all group">
                        {item}
                        <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-all text-brand-gold -translate-x-2 group-hover:translate-x-0" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Center Column - Featured Item */}
                <div className="w-full lg:w-[48%] p-10 flex flex-col gap-6 justify-center">
                  <div className="w-full h-[220px] rounded-xl overflow-hidden shadow-sm relative group cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
                      alt="Conta Corrente BTG Pactual"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-blue/90 via-transparent to-transparent flex flex-col justify-end p-6">
                      <span className="text-white text-xs font-bold uppercase tracking-wider mb-1">Destaque</span>
                      <span className="text-white font-semibold text-lg">Soluções Completas para seu Patrimônio</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-brand-blue mb-2">Para Você</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl font-light">
                      Conta corrente, cartão exclusivo, investimentos e advisory. Descubra os benefícios de ser um cliente Cais Investimentos conectado com a tecnologia BTG Pactual.
                    </p>
                  </div>
                </div>

                {/* Right Column - CTAs */}
                <div className="w-full lg:w-[27%] flex flex-col h-auto">
                  <div className="flex-1 bg-brand-blue p-10 flex flex-col justify-center group cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-blue group-hover:bg-[#081b2e] transition-colors z-0" />
                    <div className="relative z-10">
                      <h4 className="text-white font-semibold text-[17px] mb-2">Abra sua conta de investimentos</h4>
                      <p className="text-white/70 text-sm mb-6 leading-relaxed font-light">Os melhores produtos do mercado na palma da mão.</p>
                      <ArrowRight className="w-5 h-5 text-white group-hover:text-brand-gold group-hover:translate-x-2 transition-all" />
                    </div>
                  </div>
                  <div className="flex-1 bg-[#0d2a45] p-10 flex flex-col justify-center group cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#0d2a45] group-hover:bg-[#071829] transition-colors z-0" />
                    <div className="relative z-10 border-t border-white/10 pt-6 mt-[-24px]">
                      <h4 className="text-white font-semibold text-[17px] mb-2">Advisory Estratégico</h4>
                      <p className="text-white/70 text-sm mb-6 leading-relaxed font-light">Soluções sofisticadas de reestruturação de dívida (Debt) e M&A.</p>
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
              <a href="#solucoes" onClick={() => setIsOpen(false)}>A Cais</a>
              <a href="#investimentos" onClick={() => setIsOpen(false)}>Investimentos</a>
              <a href="#equipe" onClick={() => setIsOpen(false)}>Seja parceiro</a>
              <a href="#simulador" onClick={() => setIsOpen(false)}>Simular Investimentos</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  return (
    <section className="relative w-full flex flex-col md:flex-row mt-20 min-h-[500px] lg:min-h-[550px] bg-brand-blue overflow-hidden">
      <div className="w-full md:w-[50%] lg:w-[55%] flex flex-col justify-center px-6 lg:px-20 py-20 lg:py-24 text-white z-10">
        <FadeIn direction="right">
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-medium mb-6 leading-[1.2] text-white tracking-tight">
            Invista com atendimento personalizado e produtos de alto nível
          </h1>
          <p className="text-white/80 text-base lg:text-lg mb-10 max-w-xl font-light leading-relaxed">
            Entre para a nova era de investimentos e tenha a carteira ideal para as suas necessidades e objetivos com a solidez do maior Banco de Investimentos da América Latina.
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
              Acompanhamento de Mercado
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              Monitoramento racional de ativos para decisões de alta performance em tempo real.
            </p>
          </FadeIn>
          <FadeIn direction="left">
            <Button variant="outline" className="border-border text-brand-blue bg-white shadow-sm font-medium">
              Ver todos os ativos
            </Button>
          </FadeIn>
        </div>

        {!marketData.loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">Maiores Altas</h3>
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
                <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider">Maiores Baixas</h3>
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
            <span className="text-muted-foreground text-sm">Carregando dados de mercado...</span>
          </div>
        )}
      </div>
    </section>
  );
};

const AdvisorySection = () => {
  return (
    <section id="assessoria" className="py-24 bg-white md:px-20 border-t border-border">
      <div className="container px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-medium text-brand-blue mb-4">
              Sua estratégia, nossa expertise
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Soluções especializadas para proteger e impulsionar o seu patrimônio pessoal e a saúde financeira do seu negócio.
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
              Assessoria Pessoal de Investimentos
            </h3>

            <p className="text-muted-foreground font-light leading-relaxed mb-4">
              Nosso time de especialistas analisa seu perfil de risco, seus objetivos de curto e longo prazo, e constrói uma estratégia de investimento sob medida.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed mb-6">
              Seja você um investidor iniciante ou experiente, estamos ao seu lado para maximizar seus retornos com segurança e responsabilidade.
            </p>

            <p className="text-brand-blue font-medium mb-8">
              Com a Cais, você navega no mercado financeiro com confiança.
            </p>

            <ul className="space-y-4 mb-2 mt-auto">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                </div>
                <span className="text-sm font-medium text-brand-blue">Serviço personalizado</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                </div>
                <span className="text-sm font-medium text-brand-blue">Metas financeiras individuais</span>
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
              Assessoria Empresarial de Investimentos
            </h3>

            <p className="text-white/80 font-light leading-relaxed mb-4">
              Nossa assessoria empresarial é desenhada para ajudar sua organização a otimizar a gestão de seus recursos financeiros.
            </p>
            <p className="text-white/80 font-light leading-relaxed mb-6">
              Trabalhamos junto à sua equipe para criar estratégias que protejam e ampliem o patrimônio da empresa, diversificando investimentos e garantindo a sustentabilidade financeira no longo prazo.
            </p>

            <p className="text-brand-gold font-medium mb-8">
              Com a Cais, sua empresa encontra o caminho certo para crescer de forma sólida e segura no mercado financeiro.
            </p>

            <ul className="space-y-4 mb-2 mt-auto">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                </div>
                <span className="text-sm font-medium text-white">Eficiente e estratégica</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                </div>
                <span className="text-sm font-medium text-white">Promove crescimento sustentável</span>
              </li>
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const CardSection = () => {
  return (
    <section id="cartoes" className="py-24 bg-white md:px-20 border-t border-border">
      <div className="container px-6 flex flex-col items-center">

        {/* Top Half: Ultrablue Focus */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-24 w-full max-w-[1200px]">
          <div className="w-full lg:w-1/2">
            <FadeIn direction="right">
              <h2 className="text-3xl md:text-5xl font-medium text-brand-blue mb-6 leading-tight">
                Cartão Ultrablue BTG Pactual
              </h2>
              <p className="text-brand-blue/80 text-lg font-light mb-8 leading-relaxed max-w-xl">
                Vá mais longe com até 3,5 pontos por dólar gasto ou até 1,7% de cashback em todas as suas compras no crédito, concierge dedicado para apoiar o planejamento de viagens, eventos e celebrações, acessos ilimitados às Salas VIP LoungeKey e muito mais.
              </p>
              <Button className="bg-[#1853a8] hover:bg-[#124185] text-white font-medium py-6 px-10 text-base rounded-md transition-all shadow-md">
                Seja Ultrablue
              </Button>
            </FadeIn>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <FadeIn direction="left" delay={0.2} className="relative group">
              <div className="absolute inset-0 bg-[#0d2a45]/20 blur-3xl rounded-full scale-90 group-hover:scale-105 transition-transform duration-700" />
              <img
                src="./public/cartao-ultrablue.png"
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
              title: "Conta corrente digital",
              desc: "Uma conta corrente completa e sem taxa de manutenção com dicas valiosas sobre suas finanças."
            },
            {
              icon: <CreditCard className="w-8 h-8 text-[#1853a8]" strokeWidth={1.2} />,
              title: "Cartão de Crédito",
              desc: "Diferentes opções de cartão para você personalizar e escolher os benefícios que mais combinam com você."
            },
            {
              icon: <Star className="w-8 h-8 text-[#1853a8]" strokeWidth={1.2} />,
              title: "Cartão Black",
              desc: "O cartão de crédito Black em que você escolhe os benefícios e não paga anuidade ao manter R$ 30 mil investidos com a gente."
            },
            {
              icon: <Globe className="w-8 h-8 text-[#1853a8]" strokeWidth={1.2} />,
              title: "Conta de Não Residente (CNR)",
              desc: "O serviço ideal para quem quer ter uma conta no Brasil, morando em outro país."
            }
          ].map((feature, idx) => (
            <FadeIn
              key={feature.title}
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
                <span className="text-sm font-medium">Saiba mais</span>
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
                Simule seus <span className="text-brand-gold">Investimentos</span>
              </h2>
              <p className="text-white/80 text-lg font-light mb-8 leading-relaxed">
                Descubra o potencial do seu patrimônio com a tecnologia e a expertise do BTG Pactual. Construa cenários personalizados e planeje seu futuro financeiro com precisão.
              </p>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 text-sm text-white/70 font-medium bg-white/5 py-2 px-4 rounded-full border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-brand-gold" />
                  Tecnologia BTG Pactual
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
                <h3 className="text-xl text-white font-semibold mb-4">Acesse o Simulador Oficial</h3>
                <p className="text-sm text-white/70 font-light mb-8 leading-relaxed">
                  Uma ferramenta completa para projetar rentabilidades e comparar ativos do mercado.
                </p>
                <a
                  href="https://simulador.btgpactual.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button className="w-full bg-brand-gold hover:bg-[#c9a55e] text-brand-blue font-semibold py-6 text-base rounded-md transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-gold/20 hover:-translate-y-1">
                    Iniciar Simulação <ExternalLink size={18} />
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

const TeamSection = () => (
  <section id="equipe" className="py-24 bg-white md:px-20">
    <div className="container px-6">
      <div className="text-center mb-16">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-medium text-brand-blue mb-4">
            Nosso Capital Intelectual
          </h2>
          <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Liderança estratégica composta por especialistas C-Level focados na alta gestão de fortunas.
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
                <p className="text-brand-gold font-semibold text-sm mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const LeadCaptureSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', capital: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section id="contato" className="py-24 bg-brand-blue relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-b from-brand-blue to-brand-blue/90 border-l border-white/5 skew-x-12 translate-x-32 hidden lg:block" />

      <div className="container px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
              Dê o próximo passo para o seu <span className="text-brand-gold">futuro financeiro.</span>
            </h2>
            <p className="text-white/80 text-lg font-light mb-10 leading-relaxed max-w-lg">
              Deixe seus dados e um dos nossos assessores entrará em contato para entender suas demandas e apresentar soluções sob medida para o seu patrimônio.
            </p>
            <div className="flex items-center gap-6 mt-12 border-t border-white/10 pt-8">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-gold shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">Atendimento Exclusivo</h4>
                <p className="text-sm text-white/60 font-light">Especialistas dedicados aos seus objetivos.</p>
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
                  <h3 className="text-2xl font-semibold text-brand-blue mb-4">Solicitação enviada!</h3>
                  <p className="text-muted-foreground font-light mb-8">Nossa equipe entrará em contato em breve.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="text-brand-blue border-border">
                    Enviar nova mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-semibold text-brand-blue mb-6">Solicite um contato</h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-blue">Nome Completo</label>
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
                      <label className="text-sm font-medium text-brand-blue">E-mail</label>
                      <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 rounded-md border border-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-brand-blue">WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-3 rounded-md border border-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-blue">Patrimônio para Investimento</label>
                    <select
                      className="w-full px-4 py-3 rounded-md border border-border bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all text-muted-foreground"
                      onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                    >
                      <option value="">Selecione uma opção...</option>
                      <option value="Ate 500k">Até R$ 500 mil</option>
                      <option value="500k a 1M">R$ 500 mil a R$ 1 Milhão</option>
                      <option value="1M a 5M">R$ 1 Milhão a R$ 5 Milhões</option>
                      <option value="Acima de 5M">Acima de R$ 5 Milhões</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full bg-brand-gold hover:bg-[#c9a55e] text-brand-blue font-semibold py-6 text-base rounded-md mt-4 transition-all">
                    Solicitar contato de assessor
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Seus dados estão confidenciais e protegidos.
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

const Footer = () => (
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
            Orientação e precisão institucional em parceria estratégica com a Necton | BTG Pactual.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-blue transition-all"><Instagram size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-blue transition-all"><Linkedin size={18} /></a>
          </div>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-white font-semibold mb-8">Nossas Sedes</h4>
          <div className="space-y-6">
            <div className="text-white/70 text-sm font-light space-y-1">
              <p className="text-white font-medium">Vitória / Região (ES)</p>
              <p>Av. Frederico Grulke, 934, Sala 102</p>
              <p className="text-brand-gold font-medium pt-1">(27) 99714-9473</p>
            </div>
            <div className="text-white/70 text-sm font-light space-y-1">
              <p className="text-white font-medium">Recife (PE)</p>
              <p>Rua Laurindo Coelho, 174, Sala 3</p>
              <p className="text-brand-gold font-medium pt-1">(81) 99601-9115</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-white font-semibold mb-8">Atendimento Institucional</h4>
          <div className="space-y-4">
            <div className="text-white/70 text-sm font-light space-y-1">
              <p className="text-white font-medium">Ouvidoria BTG Pactual</p>
              <p className="text-brand-gold font-medium text-lg pt-1">0800 7220 048</p>
              <a href="https://www.btgpactual.com/ouvidoria" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors underline pt-2">btgpactual.com/ouvidoria</a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10">
        <p className="text-xs text-white/40 text-center lg:text-left">
          © {new Date().getFullYear()} Cais Investimentos. Todos os direitos reservados.
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

const App = () => {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground font-inter selection:bg-brand-pink selection:text-brand-blue transition-colors duration-300">
      <Navbar />
      <Hero />
      <StockTicker stocks={[]} /> {/* Empty array will just show nothing initially until Brapi fetches, or we can move the state up if we want it global */}

      {/* Quick stats section under hero */}
      <section className="py-12 bg-white border-b border-border">
        <div className="container px-6 lg:px-20 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {[
            { label: 'Custódia Segura', value: 'BTG Pactual', icon: <ShieldCheck className="w-6 h-6" /> },
            { label: 'Assessoria Especialista', value: 'CEA | CFP®', icon: <Users className="w-6 h-6" /> },
            { label: 'Escritório Destaque', value: 'Top 10 Necton', icon: <Award className="w-6 h-6" /> },
            { label: 'Presença Nacional', value: 'ES & PE', icon: <Globe className="w-6 h-6" /> }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center px-4">
              <div className="text-brand-blue mb-3">{item.icon}</div>
              <span className="text-base font-semibold text-brand-blue mb-1">{item.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

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
