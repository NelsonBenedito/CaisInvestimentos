import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

const Linktree = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('active', true)
          .order('order', { ascending: true });

        if (error) {
          console.error("Error fetching links:", error);
          // Fallback data for demonstration if table doesn't exist yet
          setLinks([
            { id: 1, title: "Guia do Imposto de Renda 2026", subtitle: "Tudo que você precisa saber", url: "#", image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60" },
            { id: 2, title: "Expert XP", subtitle: "Garanta aqui seu ingresso", url: "#", image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60" },
          ]);
        } else if (data && data.length > 0) {
          setLinks(data);
        } else {
           setLinks([
            { id: 1, title: "Guia do Imposto de Renda 2026", subtitle: "Tudo que você precisa saber", url: "#", image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60" },
            { id: 2, title: "Expert XP", subtitle: "Garanta aqui seu ingresso", url: "#", image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60" },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center sm:py-5 px-0 relative overflow-hidden font-sans z-0">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-20"
      >
        <source src="/linktreeBackground.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/60 -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto grid w-full max-w-[600px] grid-rows-[1fr_auto] min-h-[100lvh] sm:min-h-[calc(100lvh-2.5rem)] sm:bg-white/5 sm:backdrop-blur-xl sm:border sm:border-white/10 sm:rounded-[2.5rem] p-8 sm:p-10 z-10 shadow-none sm:shadow-2xl"
      >
        <div className="flex flex-col items-center">
          {/* Logo */}
          <Link to="/" className="mb-6 hover:scale-105 transition-transform mt-4 sm:mt-0">
            <img src="/CAIS-Principal.svg" alt="Cais Investimentos" className="w-48 brightness-0 invert" />
          </Link>
          
          <p className="text-white/70 text-center mb-10 font-light text-lg tracking-wide">
            O maior e mais admirado veículo de economia e finanças
          </p>

          {/* Links Container */}
          <div className="w-full flex flex-col gap-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              links.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative w-full h-[140px] rounded-2xl overflow-hidden flex shadow-lg hover:shadow-brand-gold/20 hover:-translate-y-1 transition-all border border-white/10 hover:border-brand-gold/40"
                >
                  {/* Background Image */}
                  {link.image_url ? (
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={link.image_url} 
                        alt={link.title} 
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-r from-[#0a1128] via-[#0a1128]/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-blue to-[#0a1128]" />
                  )}

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col justify-center h-full w-full">
                    {link.subtitle && (
                      <span className="text-brand-gold text-xs font-bold uppercase tracking-wider mb-1">
                        {link.subtitle}
                      </span>
                    )}
                    <h3 className="text-white text-xl md:text-2xl font-semibold leading-tight drop-shadow-md">
                      {link.title}
                    </h3>
                  </div>
                </motion.a>
              ))
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-auto pt-12 pb-4 text-center w-full flex justify-center text-xs text-white/30">
          <span>© {new Date().getFullYear()} Cais Investimentos</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Linktree;
