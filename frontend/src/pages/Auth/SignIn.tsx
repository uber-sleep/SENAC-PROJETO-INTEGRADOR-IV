import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "react-router";

import { useAuth } from "@contexts/Auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useForm } from "react-hook-form";

type FormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
  email: z
    .string()
    .min(1, "* O e-mail é obrigatório")
    .email("* O formato do e-mail é inválido")
    .trim(),
  password: z
    .string()
    .min(1, "* A senha é obrigatória")
    .refine((value) => value.trim().length > 0, {
      message: "A senha não pode conter apenas espaços.",
    }),
});

export const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control } = form;

  console.log("123123");

  const handleSignIn = async (values: FormSchema) => {
    console.log(values);

    await signIn(values);
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
            <CardDescription>Entre com suas credenciais para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(handleSignIn)} className="space-y-5">
                <div className="grid w-full items-center gap-4 ">
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="email"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email">E-mail</FormLabel>

                          <FormControl>
                            <Input
                              id="email"
                              placeholder="Digite seu e-mail"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password">Senha</FormLabel>

                          <FormControl>
                            <Input
                              id="password"
                              placeholder="Digite sua senha"
                              type="password"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button className="w-full" type="submit">
                  Entrar
                </Button>
              </form>
            </Form>
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
