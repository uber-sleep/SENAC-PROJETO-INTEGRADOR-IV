import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { formatCurrency, unformatCurrency } from "@utils/formatters";

import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "@components/ui/textarea";
import { api } from "@services/api";
import { toast } from "react-toastify";

type FormSchema = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").trim(),
  description: z.string().optional(),
  price: z.string().min(1, "O preço é obrigatório."),
  stockQuantity: z.string().min(1, "A quantidade é obrigatória."),
  category: z.string().min(1, "A categoria é obrigatória."),
});

export const CreateProduct = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      stockQuantity: "",
      category: "",
    },
  });
  const { handleSubmit, control, reset } = form;

  const handleCreateProduct = async (values: FormSchema) => {
    try {
      await api.post("products", { ...values, imageUtf: "" });

      reset();
      toast.success("O produto foi criado com sucesso.");
    } catch (error) {
      toast.error("Ocorreu um erro ao criar o produto.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Crie seu produto</CardTitle>
            <CardDescription>
              Este é o seu espaço, cadastre seu produto!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(handleCreateProduct)}
                className="space-y-5"
              >
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col w-full justify-between gap-4 md:flex-row">
                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="name">Nome *</FormLabel>

                            <FormControl>
                              <Input
                                id="name"
                                placeholder="Digite o nome"
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
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="category">
                              Tipo do produto *
                            </FormLabel>

                            <FormControl>
                              <Input
                                id="category"
                                placeholder="Digite o tipo do produto"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col space-y-1.5">
                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="description">Descrição</FormLabel>

                          <FormControl>
                            <Textarea
                              id="description"
                              placeholder="Digite a descrição"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col w-full justify-between gap-4 md:flex-row">
                    <div className="w-full flex flex-col space-y-1.5">
                      <FormField
                        control={control}
                        name="stockQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="stockQuantity">
                              Quantidade *
                            </FormLabel>

                            <FormControl>
                              <Input
                                id="stockQuantity"
                                placeholder="Digite a quantidade de estoque"
                                type="number"
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
                        name="price"
                        render={({
                          field: { onChange, value, ...fieldRest },
                        }) => (
                          <FormItem>
                            <FormLabel htmlFor="price">Preço *</FormLabel>

                            <FormControl>
                              <Input
                                id="price"
                                placeholder="Digite o preço"
                                value={formatCurrency(value)}
                                onChange={(e) => {
                                  onChange(unformatCurrency(e.target.value));
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
                </div>

                <Button className="w-full" type="submit">
                  Cadastrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
