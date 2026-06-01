import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Edit2, Check, X, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLinks();
    }
  }, [isAuthenticated]);

  const fetchLinks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error("Error fetching links:", error);
    } else {
      setLinks(data || []);
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Very basic protection for demonstration. 
    // In production, use Supabase Auth (email/password).
    if (password === 'cais123') {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta");
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    
    if (!title || !url) return alert("Título e URL são obrigatórios");

    const linkData = {
      title,
      subtitle,
      url,
      image_url: imageUrl,
      order: parseInt(order)
    };

    if (editingId) {
      const { data, error } = await supabase
        .from('links')
        .update(linkData)
        .eq('id', editingId)
        .select();

      if (error) {
        alert("Erro ao editar: " + error.message);
      } else {
        setLinks(links.map(l => l.id === editingId ? data[0] : l));
        cancelEdit();
      }
    } else {
      const { data, error } = await supabase
        .from('links')
        .insert([{ ...linkData, active: true }])
        .select();

      if (error) {
        alert("Erro ao adicionar: " + error.message);
      } else {
        setLinks([...links, data[0]]);
        cancelEdit();
      }
    }
  };

  const handleEdit = (link) => {
    setEditingId(link.id);
    setTitle(link.title);
    setSubtitle(link.subtitle || '');
    setUrl(link.url);
    setImageUrl(link.image_url || '');
    setOrder(link.order || 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle(''); setSubtitle(''); setUrl(''); setImageUrl(''); setOrder(0);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar?")) return;

    const { error } = await supabase.from('links').delete().eq('id', id);
    
    if (error) {
      alert("Erro ao deletar: " + error.message);
    } else {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  const toggleActive = async (id, currentStatus) => {
    const { error } = await supabase
      .from('links')
      .update({ active: !currentStatus })
      .eq('id', id);

    if (error) {
      alert("Erro ao atualizar: " + error.message);
    } else {
      setLinks(links.map(l => l.id === id ? { ...l, active: !currentStatus } : l));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center">
              <LogIn className="w-6 h-6 text-brand-blue" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-center text-brand-blue mb-6">Login CMS</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de acesso" 
            className="w-full px-4 py-3 border border-border rounded-lg mb-4 outline-none focus:border-brand-gold"
          />
          <Button type="submit" className="w-full bg-brand-blue text-white">Entrar</Button>
          <p className="text-xs text-center text-muted-foreground mt-4">Senha provisória: cais123</p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">Gerenciador de Links</h1>
            <p className="text-muted-foreground">Adicione ou edite os materiais do seu Linktree</p>
          </div>
          <Link to="/links">
            <Button variant="outline" className="border-brand-blue text-brand-blue">Ver Linktree</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-border h-fit">
            <h2 className="text-xl font-semibold text-brand-blue mb-6">{editingId ? "Editar Link" : "Novo Link"}</h2>
            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-brand-blue mb-1 block">Título *</label>
                <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md outline-none focus:border-brand-gold" placeholder="Ex: Guia de Imposto de Renda" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-blue mb-1 block">Subtítulo (Opcional)</label>
                <input value={subtitle} onChange={e=>setSubtitle(e.target.value)} className="w-full px-3 py-2 border rounded-md outline-none focus:border-brand-gold" placeholder="Ex: Baixe grátis" />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-blue mb-1 block">URL do Link *</label>
                <input required value={url} onChange={e=>setUrl(e.target.value)} type="url" className="w-full px-3 py-2 border rounded-md outline-none focus:border-brand-gold" placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-blue mb-1 block">URL da Imagem de Fundo (Opcional)</label>
                <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} type="url" className="w-full px-3 py-2 border rounded-md outline-none focus:border-brand-gold" placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-blue mb-1 block">Ordem (Ex: 1, 2, 3)</label>
                <input type="number" value={order} onChange={e=>setOrder(e.target.value)} className="w-full px-3 py-2 border rounded-md outline-none focus:border-brand-gold" />
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" className="flex-1 bg-brand-gold hover:bg-[#c9a55e] text-brand-blue font-semibold">
                  {editingId ? "Salvar Alterações" : <><Plus className="w-4 h-4 mr-2" /> Adicionar Link</>}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={cancelEdit} className="border-border text-muted-foreground hover:bg-slate-100">
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de Links */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-border">
             <h2 className="text-xl font-semibold text-brand-blue mb-6">Links Ativos</h2>
             
             {loading ? (
               <div className="text-center py-10 text-muted-foreground">Carregando links...</div>
             ) : links.length === 0 ? (
               <div className="text-center py-10 border-2 border-dashed rounded-lg border-border text-muted-foreground">
                 Nenhum link cadastrado ainda.
               </div>
             ) : (
               <div className="space-y-4">
                 {links.map(link => (
                   <div key={link.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${link.active ? 'border-border bg-white' : 'border-slate-200 bg-slate-50 opacity-70'}`}>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden shrink-0">
                          {link.image_url ? (
                            <img src={link.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">#</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-brand-blue flex items-center gap-2">
                            {link.title} 
                            {!link.active && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">Inativo</span>}
                          </h3>
                          <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline truncate max-w-[200px] block">{link.url}</a>
                        </div>
                     </div>
                     
                     <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(link)}
                          className="p-2 rounded-md hover:bg-blue-100 text-blue-600 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleActive(link.id, link.active)}
                          className={`p-2 rounded-md transition-colors ${link.active ? 'hover:bg-amber-100 text-amber-600' : 'hover:bg-emerald-100 text-emerald-600'}`}
                          title={link.active ? "Desativar" : "Ativar"}
                        >
                          {link.active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(link.id)} className="p-2 rounded-md hover:bg-rose-100 text-rose-600 transition-colors" title="Deletar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
