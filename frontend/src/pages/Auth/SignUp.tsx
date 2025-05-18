import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "@contexts/Auth";

import {
  formatDocumentNumber,
  formatPhone,
  formatZipCode,
  unformatDocumentNumber,
  unformatPhone,
  unformatZipCode,
} from "@utils/formatters";

import { countryStates } from "@constants";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

type FormSchema = z.infer<typeof formSchema>;

const formSchema = z
  .object({
    firstName: z.string().min(1, "O nome é obrigatório").trim(),
    lastName: z.string().min(1, "O sobrenome é obrigatório").trim(),
    document: z
      .string()
      .min(1, "O CPF / CNPJ é obrigatório.")
      .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, "");
        return replacedDoc.length === 11 || replacedDoc.length === 14;
      }, "O formato do CPF / CNPJ é inválido.")
      .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, "");
        return !!Number(replacedDoc);
      }, "O CPF / CNPJ deve conter apenas números."),
    stateRegistration: z.string().optional(),
    phone: z
      .string()
      .min(1, "O telefone é obrigatório.")
      .min(11, "O número de telefone é inválido.")
      .max(11, "O número de telefone é inválido."),
    email: z
      .string()
      .min(1, "O e-mail é obrigatório.")
      .email("O formato do e-mail é inválido.")
      .trim(),
    password: z
      .string()
      .min(1, "A senha é obrigatória.")
      .refine((value) => value.trim().length > 0, {
        message: "A senha não pode conter apenas espaços.",
      }),
    confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória."),
    cep: z.string().min(1, "O CEP é obrigatório.").min(8, "O CEP é inválido."),
    street: z.string().min(1, "O nome da rua ou avenida é obrigatório."),
    adressNumber: z.string().optional(),
    addressComplement: z.string().optional(),
    neighborhood: z.string().min(1, "O bairro é obrigatório."),
    city: z.string().min(1, "O nome da cidade é obrigatório."),
    state: z.string().min(1, "O estado é obrigatório."),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem.",
        path: ["confirmPassword"],
      });
    }
  });

export const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      document: "",
      stateRegistration: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      cep: "",
      street: "",
      adressNumber: "",
      addressComplement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });
  const { handleSubmit, control, getValues, watch } = form;

  const handleSignUp = async (values: FormSchema) => {
    const {
      firstName,
      lastName,
      document,
      stateRegistration,
      phone,
      email,
      password,
      cep,
      street,
      adressNumber,
      addressComplement,
      neighborhood,
      city,
      state,
    } = values;

    await signUp({
      name: `${firstName} ${lastName}`,
      cpf_cnpj: document,
      certificate_id: stateRegistration,
      phone: `+55${phone}`,
      email,
      password,
      address: `${street} ${adressNumber ? `, ${adressNumber}` : undefined} ${
        addressComplement ? `, ${addressComplement}` : undefined
      } - ${neighborhood}, ${city} - ${state}, ${cep}`,
    });
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  watch("document");

  return (
    <div className="min-h-[calc(100vh-72px)] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Crie sua conta</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para se cadastrar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(handleSignUp)} className="space-y-5">
                <div className="grid w-full items-center gap-4 ">
                  <div className="flex flex-col w-full justify-between gap-4 md:flex-row">
                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="firstName">Nome *</FormLabel>

                            <FormControl>
                              <Input
                                id="firstName"
                                placeholder="Digite seu nome"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="lastName">
                              Sobrenome *
                            </FormLabel>

                            <FormControl>
                              <Input
                                id="lastName"
                                placeholder="Digite seu sobrenome"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full justify-between gap-4 md:flex-row">
                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="document"
                        render={({
                          field: { onChange, value, ...fieldRest },
                        }) => (
                          <FormItem>
                            <FormLabel htmlFor="document">
                              CPF / CNPJ *
                            </FormLabel>

                            <FormControl>
                              <Input
                                id="document"
                                placeholder="Digite seu CPF ou CNPJ"
                                value={formatDocumentNumber(value)}
                                onChange={(e) => {
                                  onChange(
                                    unformatDocumentNumber(e.target.value)
                                  );
                                }}
                                {...fieldRest}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="stateRegistration"
                        disabled={getValues("document").length < 14}
                        render={({ field: { value, ...fieldRest } }) => (
                          <FormItem>
                            <FormLabel htmlFor="stateRegistration">
                              Inscrição estadual
                            </FormLabel>

                            <FormControl>
                              <Input
                                id="stateRegistration"
                                placeholder="Digite o código de inscrição estadual"
                                value={
                                  getValues("document").length < 14 ? "" : value
                                }
                                type="number"
                                {...fieldRest}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full justify-between gap-4 md:flex-row">
                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="email">E-mail *</FormLabel>

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

                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="phone"
                        render={({
                          field: { onChange, value, ...fieldRest },
                        }) => (
                          <FormItem>
                            <FormLabel htmlFor="phone">Telefone *</FormLabel>

                            <FormControl>
                              <Input
                                id="phone"
                                placeholder="Digite seu telefone"
                                value={formatPhone(value)}
                                onChange={(e) => {
                                  onChange(unformatPhone(e.target.value));
                                }}
                                {...fieldRest}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full justify-between gap-4 md:flex-row">
                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="password">Senha *</FormLabel>

                            <FormControl>
                              <Input
                                id="password"
                                placeholder="Digite sua senha"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="confirmPassword">
                              Confirme sua senha *
                            </FormLabel>

                            <FormControl>
                              <Input
                                id="confirmPassword"
                                placeholder="Digite a mesma senha"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full justify-between gap-4 md:flex-row">
                  <div className="w-full flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="cep"
                      render={({
                        field: { onChange, value, ...fieldRest },
                      }) => (
                        <FormItem>
                          <FormLabel htmlFor="cep">CEP *</FormLabel>

                          <FormControl>
                            <Input
                              id="cep"
                              placeholder="Digite seu CEP"
                              value={formatZipCode(value)}
                              onChange={(e) => {
                                onChange(unformatZipCode(e.target.value));
                              }}
                              {...fieldRest}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="street">
                            Rua / Avenida *
                          </FormLabel>

                          <FormControl>
                            <Input
                              id="street"
                              placeholder="Digite o nome da rua ou avenida"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full justify-between gap-4 md:flex-row">
                  <div className="w-full flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="adressNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="adressNumber">Número</FormLabel>

                          <FormControl>
                            <Input
                              id="adressNumber"
                              type="number"
                              placeholder="Digite o número do endereço"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="addressComplement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="addressComplement">
                            Complemento
                          </FormLabel>

                          <FormControl>
                            <Input
                              id="addressComplement"
                              placeholder="Digite complemento"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full justify-between gap-4 md:flex-row">
                  <div className="w-full flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="neighborhood">Bairro *</FormLabel>

                          <FormControl>
                            <Input
                              id="neighborhood"
                              placeholder="Digite o nome do bairro"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="city">Cidade *</FormLabel>

                          <FormControl>
                            <Input
                              id="city"
                              placeholder="Digite o nome da cidade"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="state">Estado *</FormLabel>

                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl id="state">
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent
                              id="state"
                              side="bottom"
                              avoidCollisions={false}
                            >
                              {countryStates.map(({ label, value }) => (
                                <SelectItem value={value} key={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button className="w-full" type="submit">
                  Cadastrar
                </Button>
              </form>
            </Form>
          </CardContent>

          <div className="px-8 flex justify-center items-center gap-4">
            <div className="w-full h-0.5 bg-border rounded-2xl"></div>

            <h3 className="text-muted-foreground text-sm text-nowrap">
              Já tem uma conta?
            </h3>

            <div className="w-full h-0.5 bg-border rounded-2xl"></div>
          </div>

          <CardFooter className="flex flex-col justify-center gap-4">
            <Button className="w-full" variant="outline" onClick={handleSignIn}>
              Entre aqui
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
