import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Lock } from 'lucide-react';
import { useConquistas } from '@/hooks/useConquistas';
import { useProfile } from '@/hooks/useProfile';

export const ConquistasDisplay = () => {
  const { conquistas, getAvailableConquistas } = useConquistas();
  const { profile } = useProfile();

  const availableConquistas = getAvailableConquistas();
  const unlockedBadges = conquistas.map(c => c.badge);

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {/* Troféu animado ao desbloquear conquista */}
          <Award className="h-5 w-5 text-success animate-spin-slow" />
          <span>Suas Conquistas</span>
          {/* Badge de conquistas com pulso ao hover */}
          <Badge variant="secondary" className="transition-all hover:scale-110 hover:shadow-lg animate-pulse focus:outline-none">{conquistas.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableConquistas.map((conquista, index) => {
            const isUnlocked = unlockedBadges.includes(conquista.badge);
            
            return (
              <div
                key={index}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  isUnlocked
                    ? 'border-success bg-success/10 shadow-glow'
                    : 'border-muted bg-muted/30 opacity-60'
                }`}
              >
                <div className="text-2xl mb-2">
                  {isUnlocked ? conquista.badge : <Lock className="h-6 w-6 mx-auto" />}
                </div>
                <p className="text-xs font-medium mb-1">{conquista.name}</p>
                <p className="text-xs text-muted-foreground">{conquista.descricao}</p>
                {isUnlocked && (
                  <Badge variant="secondary" className="mt-2 text-xs bg-success/20 text-success">
                    Desbloqueada!
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {conquistas.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm" className="bg-success/10 text-success border-success/20">
              <Trophy className="h-4 w-4 mr-2" />
              Ver Histórico de Conquistas
            </Button>
          </div>
        )}

        {conquistas.length === 0 && (
          <div className="text-center mt-6 p-4 bg-muted/30 rounded-lg">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Comece fazendo perguntas para desbloquear suas primeiras conquistas!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};