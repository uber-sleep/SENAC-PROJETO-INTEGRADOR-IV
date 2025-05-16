import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useAuth } from "@contexts/Auth";
import { useNavigate } from "react-router";

export const SignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    await signIn({ email: "bruno.duarte314@gmail.com", password: "123" });
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bem vindo</CardTitle>
            <CardDescription>
              Produtos orgânicos, do produtor direto para sua mesa!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form>
              <div className="grid w-full items-center gap-4 ">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    placeholder="Digite seu e-mail"
                    type="email"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    placeholder="Digite sua senha"
                    type="password"
                  />
                </div>
              </div>
            </form>

            <Button className="w-full" onClick={handleSignIn}>
              Entrar
            </Button>
          </CardContent>

          <div className="px-8 flex justify-center items-center gap-4">
            <div className="w-full h-0.5 bg-border rounded-2xl"></div>

            <h3 className="text-muted-foreground text-sm text-nowrap">
              Ainda não é membro?
            </h3>

            <div className="w-full h-0.5 bg-border rounded-2xl"></div>
          </div>

          <CardFooter className="flex flex-col justify-center gap-4">
            <Button className="w-full" variant="outline" onClick={handleSignUp}>
              Cadastre-se
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
