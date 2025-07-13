import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, MessageCircle, Trophy, Star, Sparkles, Brain, Target, Users, Award } from "lucide-react";
import heroTeacher from "@/assets/hero-teacher.jpg";

const Index = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [userCoins, setUserCoins] = useState(150);
  const [currentStreak, setCurrentStreak] = useState(7);

  const subjects = [
    { name: "Matemática", icon: "🔢", color: "bg-blue-100" },
    { name: "Português", icon: "📚", color: "bg-green-100" },
    { name: "Ciências", icon: "🔬", color: "bg-purple-100" },
    { name: "História", icon: "🏛️", color: "bg-yellow-100" },
    { name: "Geografia", icon: "🌍", color: "bg-orange-100" },
    { name: "Inglês", icon: "🇺🇸", color: "bg-red-100" }
  ];

  const achievements = [
    { name: "Primeira Pergunta", icon: "🎯", unlocked: true },
    { name: "Sequência de 7 Dias", icon: "🔥", unlocked: true },
    { name: "Explorador", icon: "🗺️", unlocked: false },
    { name: "Estudioso", icon: "📖", unlocked: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tutor AI Amigo</h1>
              <p className="text-sm text-muted-foreground">Seu professor particular digital</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>{userCoins} moedas</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-warning" />
              <span>{currentStreak} dias</span>
            </Badge>
            <Button size="sm">Entrar</Button>
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

            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Chat com Professor IA</CardTitle>
                    <CardDescription>
                      Digite sua dúvida ou digite "Oi" para começar
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ex: Como resolver equações do segundo grau? ou Me ajude com este exercício de português..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      📸 Enviar Foto
                    </Button>
                    <Button variant="outline" size="sm">
                      🎤 Falar
                    </Button>
                  </div>
                  <Button disabled={!chatMessage.trim()}>
                    Enviar Pergunta
                  </Button>
                </div>
              </CardContent>
            </Card>
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
              {/* Conquistas */}
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-success" />
                    <span>Suas Conquistas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          achievement.unlocked 
                            ? 'border-success bg-success/10' 
                            : 'border-muted bg-muted/50 opacity-60'
                        }`}
                      >
                        <div className="text-2xl mb-2">{achievement.icon}</div>
                        <p className="text-sm font-medium">{achievement.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas */}
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Seu Progresso</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sequência atual</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      🔥 {currentStreak} dias
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Moedas acumuladas</span>
                    <Badge className="text-lg px-3 py-1">
                      <Sparkles className="h-4 w-4 mr-1" />
                      {userCoins}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Perguntas respondidas</span>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      💬 23
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <Button variant="success" className="w-full">
                      <Trophy className="h-4 w-4 mr-2" />
                      Ver Todas as Conquistas
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                <h4 className="text-lg font-bold">Tutor AI Amigo</h4>
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
            <p>© 2024 Tutor AI Amigo. Feito com ❤️ para estudantes brasileiros.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
