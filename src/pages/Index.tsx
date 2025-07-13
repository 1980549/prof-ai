import { useState } from "react";
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

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const { profile } = useProfile();
  const { conquistas } = useConquistas();
  const { getLimitStatus } = useLimites();
  const [chatMessage, setChatMessage] = useState("");

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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Prof AI</h1>
                <p className="text-sm text-muted-foreground">Olá, {profile?.nome || 'Estudante'}!</p>
              </div>
            </Link>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>{userCoins} moedas</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-warning" />
              <span>{currentStreak} dias</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <MessageCircle className="h-3 w-3" />
              <span>{questionsLimit.current}/{questionsLimit.max} perguntas</span>
            </Badge>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
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

            <ChatDemo />
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
