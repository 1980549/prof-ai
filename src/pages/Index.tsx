import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, MessageCircle, Trophy, Star, Sparkles, Brain, Target, Users, Award, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useConquistas } from "@/hooks/useConquistas";
import { useLimites } from "@/hooks/useLimites";
import { ChatDemo } from "@/components/ChatDemo";
import { ConquistasDisplay } from "@/components/ConquistasDisplay";
import { UserStats } from "@/components/UserStats";
import heroTeacher from "@/assets/hero-teacher.jpg";
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRef } from 'react';
import { CardsDeAcao } from '@/components/CardsDeAcao';
import { DepoimentosSocial } from '@/components/DepoimentosSocial';
import { SeloIAAutonoma } from '@/components/SeloIAAutonoma';

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { conquistas } = useConquistas();
  const { getLimitStatus } = useLimites();
  const [chatMessage, setChatMessage] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: profile?.nome || '',
    email: user?.email || '',
    tipo: profile?.tipo || 'aluno',
    idade: profile?.idade ? String(profile.idade) : '',
    serie: profile?.serie || '',
    regiao: profile?.regiao || '',
    objetivo: profile?.objetivo || '',
  });
  const { toast } = useToast();
  const nomeInputRef = useRef<HTMLInputElement>(null);

  // Atualiza form ao abrir modal de edição
  useEffect(() => {
    if (editProfileOpen && profile && user) {
      setEditForm({
        nome: profile.nome || '',
        email: user.email || '',
        tipo: profile.tipo || 'aluno',
        idade: profile.idade ? String(profile.idade) : '',
        serie: profile.serie || '',
        regiao: profile.regiao || '',
        objetivo: profile.objetivo || '',
      });
      setTimeout(() => nomeInputRef.current?.focus(), 100);
    }
  }, [editProfileOpen, profile, user]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.nome.trim()) {
      toast({ title: 'Nome obrigatório', description: 'Preencha seu nome.', variant: 'destructive' });
      return;
    }
    if (!editForm.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      toast({ title: 'Email inválido', description: 'Digite um email válido.', variant: 'destructive' });
      return;
    }
    setEditLoading(true);
    const updates = {
      nome: editForm.nome,
      tipo: editForm.tipo,
      idade: editForm.idade !== '' ? Number(editForm.idade) : undefined,
      serie: editForm.serie,
      regiao: editForm.regiao,
      objetivo: editForm.objetivo,
    };
    const { error } = await updateProfile(updates);
    setEditLoading(false);
    if (!error) {
      setEditProfileOpen(false);
      toast({ title: 'Perfil atualizado!', description: 'Suas informações foram salvas.' });
    }
  };

  // Redirect to auth if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  const subjects = [
    { name: "Matemática", icon: "🔢", color: "bg-blue-100" },
    { name: "Português", icon: "📚", color: "bg-green-100" },
    { name: "Ciências", icon: "🔬", color: "bg-purple-100" },
    { name: "História", icon: "🏛️", color: "bg-yellow-100" },
    { name: "Geografia", icon: "🌍", color: "bg-orange-100" },
    { name: "Inglês", icon: "🇺🇸", color: "bg-red-100" }
  ];

  // Get user data
  const userCoins = profile?.moedas || 0;
  const userConquistas = conquistas || [];
  const questionsLimit = getLimitStatus('perguntas_diarias');
  const currentStreak = 7; // This would come from a streak calculation

  const achievements = [
    { name: "Primeira Pergunta", icon: "🎯", unlocked: userConquistas.some(c => c.badge === '🎯') },
    { name: "Sequência de 7 Dias", icon: "🔥", unlocked: userConquistas.some(c => c.badge === '🔥') },
    { name: "Explorador", icon: "🗺️", unlocked: userConquistas.some(c => c.badge === '🏆') },
    { name: "Estudioso", icon: "📖", unlocked: userConquistas.some(c => c.badge === '📚') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Nome do app */}
          <Link to="/" className="flex items-center space-x-2 min-w-0">
            <div className="p-2 bg-gradient-primary rounded-xl flex-shrink-0">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">Prof AI</h1>
          </Link>
          {/* Botão/avatar de perfil */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Abrir menu do usuário"
              onClick={() => setProfileOpen(true)}
              className="rounded-full focus-visible:ring-2 focus-visible:ring-primary"
            >
              <User className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>
      {/* Modal de Perfil do Usuário */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Perfil do Usuário</DialogTitle>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">{profile?.nome}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-muted/50 rounded-lg p-2 text-center">
                <span className="block text-xs text-muted-foreground">Moedas</span>
                <span className="font-bold text-primary">{profile?.moedas ?? 0}</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-2 text-center">
                <span className="block text-xs text-muted-foreground">Dias</span>
                <span className="font-bold">{currentStreak}</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-2 text-center col-span-2">
                <span className="block text-xs text-muted-foreground">Perguntas restantes</span>
                <span className="font-bold">{questionsLimit.current}/{questionsLimit.max}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button variant="secondary" onClick={() => setEditProfileOpen(true)} className="flex-1">
                Editar Perfil
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setProfileOpen(false)}>
                Fechar
              </Button>
              <Button variant="destructive" onClick={signOut} className="flex-1">
                Sair
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Modal de Edição de Perfil */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Editar Perfil</DialogTitle>
          <form className="space-y-4 mt-2" onSubmit={handleEditSubmit} autoComplete="off">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                ref={nomeInputRef}
                value={editForm.nome}
                onChange={handleEditChange}
                required
                className="w-full"
                autoFocus
                placeholder="Seu nome completo"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={editForm.email}
                disabled
                className="w-full bg-muted/50 cursor-not-allowed"
                placeholder="Seu email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo de Conta</Label>
              <select
                id="tipo"
                name="tipo"
                value={editForm.tipo}
                onChange={handleEditChange}
                className="w-full rounded-lg border px-3 py-2 bg-background"
              >
                <option value="aluno">Aluno</option>
                <option value="responsavel">Responsável</option>
                <option value="professor">Professor</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                name="idade"
                type="number"
                min="0"
                value={editForm.idade}
                onChange={handleEditChange}
                className="w-full"
                placeholder="Sua idade"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="serie">Série</Label>
              <Input
                id="serie"
                name="serie"
                value={editForm.serie}
                onChange={handleEditChange}
                className="w-full"
                placeholder="Ex: 7º ano"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="regiao">Região</Label>
              <Input
                id="regiao"
                name="regiao"
                value={editForm.regiao}
                onChange={handleEditChange}
                className="w-full"
                placeholder="Ex: SP, RJ, MG..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="objetivo">Objetivo</Label>
              <Input
                id="objetivo"
                name="objetivo"
                value={editForm.objetivo}
                onChange={handleEditChange}
                className="w-full"
                placeholder="Ex: passar de ano, ENEM, reforço..."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditProfileOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" variant="success" className="flex-1" disabled={editLoading}>
                {editLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Selo IA Autônoma 24/7 - Etapa 3 do roadmap */}
              <div className="mb-2 flex justify-start">
                <SeloIAAutonoma />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  ✨ Seu Professor Digital Personalizado
                </Badge>
                <h2 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Aprenda com seu
                  <span className="text-primary block">Professor IA</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Tire suas dúvidas, reforce o aprendizado e conquiste seus objetivos educacionais 
                  com um tutor inteligente que se adapta ao seu ritmo e estilo de aprendizagem.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" variant="hero" className="flex-1 sm:flex-none">
                  <MessageCircle className="h-5 w-5" />
                  Começar a Conversar
                </Button>
                <Button size="xl" variant="outline" className="flex-1 sm:flex-none">
                  <BookOpen className="h-5 w-5" />
                  Ver Matérias
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Estudantes ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">95%</div>
                  <div className="text-sm text-muted-foreground">Satisfação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">24/7</div>
                  <div className="text-sm text-muted-foreground">Disponível</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-card rounded-3xl p-8 shadow-elegant">
                <img 
                  src={heroTeacher} 
                  alt="Professor digital amigável" 
                  className="w-full h-auto rounded-2xl shadow-card"
                />
                <div className="absolute -top-4 -right-4">
                  <div className="bg-success text-success-foreground p-3 rounded-2xl shadow-glow animate-bounce-gentle">
                    <Trophy className="h-6 w-6" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-glow animate-pulse">
                    <Sparkles className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Bloco de Depoimentos/Prova Social - Etapa 2 do roadmap */}
      <DepoimentosSocial />

      {/* Quick Chat Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Experimente agora mesmo!
              </h3>
              <p className="text-lg text-muted-foreground">
                Faça uma pergunta ou peça ajuda com algum exercício
              </p>
            </div>
            {/* Cards de Ação - Etapa 1 do roadmap */}
            <CardsDeAcao onSelecionarAcao={contexto => setChatMessage(contexto)} />
            {/* Chat principal */}
            <ChatDemo chatMessage={chatMessage} setChatMessage={setChatMessage} />
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Matérias Disponíveis
            </h3>
            <p className="text-lg text-muted-foreground">
              Suporte completo para todas as disciplinas do Ensino Fundamental
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((subject, index) => (
              <Card key={index} className="hover:shadow-card transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-card border-0">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${subject.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4`}>
                    {subject.icon}
                  </div>
                  <h4 className="font-semibold text-foreground">{subject.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Sistema de Recompensas
              </h3>
              <p className="text-lg text-muted-foreground">
                Ganhe moedas, conquiste badges e acompanhe seu progresso
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <ConquistasDisplay />
              <UserStats />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-bold">Prof AI</h4>
              </div>
              <p className="text-muted text-sm">
                Seu professor particular digital para um aprendizado personalizado e motivador.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Recursos</h5>
              <ul className="space-y-2 text-sm text-muted">
                <li>Chat com IA</li>
                <li>Exercícios Personalizados</li>
                <li>Sistema de Gamificação</li>
                <li>Histórico de Estudos</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Matérias</h5>
              <ul className="space-y-2 text-sm text-muted">
                <li>Todas as disciplinas</li>
                <li>Ensino Fundamental</li>
                <li>Suporte Multimídia</li>
                <li>Exercícios Práticos</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Segurança</h5>
              <ul className="space-y-2 text-sm text-muted">
                <li>Conteúdo Seguro</li>
                <li>Privacidade Garantida</li>
                <li>LGPD Compliance</li>
                <li>Filtros de Segurança</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted/20 mt-8 pt-8 text-center text-sm text-muted">
            <p>© 2024 Prof AI. Feito com ❤️ para estudantes brasileiros.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
