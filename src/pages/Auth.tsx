import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Brain, UserPlus, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    tipo: '' as 'aluno' | 'responsavel' | 'professor',
    idade: '',
    serie: '',
    regiao: '',
    objetivo: '',
  });

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (!error) {
      // User will be redirected automatically by the Navigate component
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (!signupData.tipo) {
      alert('Selecione o tipo de perfil');
      return;
    }

    setIsLoading(true);

    const profileData = {
      nome: signupData.nome,
      tipo: signupData.tipo,
      idade: signupData.idade ? parseInt(signupData.idade) : undefined,
      serie: signupData.serie || undefined,
      regiao: signupData.regiao || undefined,
      objetivo: signupData.objetivo || undefined,
    };

    const { error } = await signUp(signupData.email, signupData.password, profileData);
    
    if (!error) {
      // Reset form
      setSignupData({
        email: '',
        password: '',
        confirmPassword: '',
        nome: '',
        tipo: '' as 'aluno' | 'responsavel' | 'professor',
        idade: '',
        serie: '',
        regiao: '',
        objetivo: '',
      });
    }
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground">Tutor AI Amigo</h1>
              <p className="text-sm text-muted-foreground">Seu professor particular digital</p>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Entrar</span>
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Cadastrar</span>
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader className="text-center">
                  <CardTitle>Bem-vindo de volta!</CardTitle>
                  <CardDescription>
                    Entre para continuar seus estudos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Entrar
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader className="text-center">
                  <CardTitle>Criar conta</CardTitle>
                  <CardDescription>
                    Cadastre-se para começar a aprender
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-nome">Nome completo</Label>
                        <Input
                          id="signup-nome"
                          placeholder="Seu nome completo"
                          value={signupData.nome}
                          onChange={(e) => setSignupData(prev => ({ ...prev, nome: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-tipo">Tipo de perfil</Label>
                        <Select 
                          value={signupData.tipo} 
                          onValueChange={(value: 'aluno' | 'responsavel' | 'professor') => 
                            setSignupData(prev => ({ ...prev, tipo: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de perfil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aluno">👨‍🎓 Aluno</SelectItem>
                            <SelectItem value="responsavel">👨‍👩‍👧‍👦 Responsável</SelectItem>
                            <SelectItem value="professor">👨‍🏫 Professor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {signupData.tipo === 'aluno' && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label htmlFor="signup-idade">Idade</Label>
                              <Input
                                id="signup-idade"
                                type="number"
                                placeholder="12"
                                min="5"
                                max="18"
                                value={signupData.idade}
                                onChange={(e) => setSignupData(prev => ({ ...prev, idade: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="signup-serie">Série</Label>
                              <Select 
                                value={signupData.serie} 
                                onValueChange={(value) => setSignupData(prev => ({ ...prev, serie: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Série" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1ano">1º ano</SelectItem>
                                  <SelectItem value="2ano">2º ano</SelectItem>
                                  <SelectItem value="3ano">3º ano</SelectItem>
                                  <SelectItem value="4ano">4º ano</SelectItem>
                                  <SelectItem value="5ano">5º ano</SelectItem>
                                  <SelectItem value="6ano">6º ano</SelectItem>
                                  <SelectItem value="7ano">7º ano</SelectItem>
                                  <SelectItem value="8ano">8º ano</SelectItem>
                                  <SelectItem value="9ano">9º ano</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-regiao">Região/Estado</Label>
                            <Input
                              id="signup-regiao"
                              placeholder="Ex: São Paulo, SP"
                              value={signupData.regiao}
                              onChange={(e) => setSignupData(prev => ({ ...prev, regiao: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-objetivo">Objetivo de estudo (opcional)</Label>
                            <Textarea
                              id="signup-objetivo"
                              placeholder="Ex: Melhorar em matemática, preparar para prova..."
                              value={signupData.objetivo}
                              onChange={(e) => setSignupData(prev => ({ ...prev, objetivo: e.target.value }))}
                              rows={2}
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Senha</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirmar senha</Label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          placeholder="Digite a senha novamente"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Criar conta
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;