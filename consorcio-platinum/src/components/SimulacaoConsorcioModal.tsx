import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCreateLead } from "@/hooks/useLeads";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Home, Car, TrendingUp, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type TipoConsorcio = "imoveis" | "automoveis" | "investimento";

const baseSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().refine(
    (val) => val.replace(/\D/g, "").length >= 10,
    { message: "Telefone deve ter pelo menos 10 dígitos" }
  ),
});

const imoveisSchema = baseSchema.extend({
  tipoImovel: z.string().min(1, "Selecione o tipo de imóvel"),
  valorDesejado: z.string().optional(),
  regiao: z.string().optional(),
  mensagem: z.string().optional(),
});

const automoveisSchema = baseSchema.extend({
  tipoVeiculo: z.string().min(1, "Selecione o tipo de veículo"),
  valorDesejado: z.string().optional(),
  novoOuUsado: z.string().optional(),
  mensagem: z.string().optional(),
});

const investimentoSchema = baseSchema.extend({
  valorAproximado: z.string().optional(),
  prazoDesejado: z.string().optional(),
  objetivoInvestimento: z.string().optional(),
  mensagem: z.string().optional(),
});

type ImoveisValues = z.infer<typeof imoveisSchema>;
type AutomoveisValues = z.infer<typeof automoveisSchema>;
type InvestimentoValues = z.infer<typeof investimentoSchema>;

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
};

interface SimulacaoConsorcioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIPOS = [
  { id: "imoveis" as const, label: "Imóveis", icon: Home },
  { id: "automoveis" as const, label: "Automóveis", icon: Car },
  { id: "investimento" as const, label: "Investimento", icon: TrendingUp },
] as const;

export const SimulacaoConsorcioModal = ({
  open,
  onOpenChange,
}: SimulacaoConsorcioModalProps) => {
  const [step, setStep] = useState<"selecao" | "formulario">("selecao");
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoConsorcio | null>(null);
  const { createLead, isLoading } = useCreateLead();
  const [isSuccess, setIsSuccess] = useState(false);

  const imoveisForm = useForm<ImoveisValues>({
    resolver: zodResolver(imoveisSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      tipoImovel: "",
      valorDesejado: "",
      regiao: "",
      mensagem: "",
    },
  });

  const automoveisForm = useForm<AutomoveisValues>({
    resolver: zodResolver(automoveisSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      tipoVeiculo: "",
      valorDesejado: "",
      novoOuUsado: "",
      mensagem: "",
    },
  });

  const investimentoForm = useForm<InvestimentoValues>({
    resolver: zodResolver(investimentoSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      valorAproximado: "",
      prazoDesejado: "",
      objetivoInvestimento: "",
      mensagem: "",
    },
  });

  const handleSelectTipo = (tipo: TipoConsorcio) => {
    setTipoSelecionado(tipo);
    setStep("formulario");
  };

  const handleVoltar = () => {
    setStep("selecao");
    setTipoSelecionado(null);
    imoveisForm.reset();
    automoveisForm.reset();
    investimentoForm.reset();
  };

  const handleClose = () => {
    if (!isLoading) {
      setStep("selecao");
      setTipoSelecionado(null);
      setIsSuccess(false);
      imoveisForm.reset();
      automoveisForm.reset();
      investimentoForm.reset();
      onOpenChange(false);
    }
  };

  const onSubmit = async (
    data: ImoveisValues | AutomoveisValues | InvestimentoValues
  ) => {
    if (!tipoSelecionado) return;

    const result = await createLead({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      mensagem: data.mensagem,
      origem: `simulacao_${tipoSelecionado}`,
      tipoConsorcio: tipoSelecionado,
      metadata: { tipoConsorcio: tipoSelecionado, ...data },
    });

    if (result.success) {
      setIsSuccess(true);
      toast.success("Recebemos seus dados. Entraremos em contato em breve.");
      setTimeout(() => handleClose(), 2200);
    } else {
      toast.error("Não foi possível enviar. Tente novamente.");
    }
  };

  const renderForm = () => {
    if (!tipoSelecionado) return null;

    if (tipoSelecionado === "imoveis") {
      return (
        <Form {...imoveisForm}>
          <form
            onSubmit={imoveisForm.handleSubmit((d) => onSubmit(d))}
            className="space-y-4"
          >
            <FormField
              control={imoveisForm.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={imoveisForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={imoveisForm.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      {...field}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={imoveisForm.control}
              name="tipoImovel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de imóvel *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={imoveisForm.control}
              name="valorDesejado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor aproximado desejado</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: R$ 300.000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={imoveisForm.control}
              name="regiao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Região ou cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: São Paulo, SP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={imoveisForm.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem adicional</FormLabel>
                  <FormControl>
                    <Input placeholder="Alguma observação?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleVoltar}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Enviar
              </Button>
            </div>
          </form>
        </Form>
      );
    }

    if (tipoSelecionado === "automoveis") {
      return (
        <Form {...automoveisForm}>
          <form
            onSubmit={automoveisForm.handleSubmit((d) => onSubmit(d))}
            className="space-y-4"
          >
            <FormField
              control={automoveisForm.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={automoveisForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={automoveisForm.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      {...field}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={automoveisForm.control}
              name="tipoVeiculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de veículo *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="carro">Carro</SelectItem>
                      <SelectItem value="moto">Moto</SelectItem>
                      <SelectItem value="caminhao">Caminhão</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={automoveisForm.control}
              name="valorDesejado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor aproximado desejado</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: R$ 80.000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={automoveisForm.control}
              name="novoOuUsado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Novo ou usado?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="usado">Usado</SelectItem>
                      <SelectItem value="indiferente">Indiferente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={automoveisForm.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem adicional</FormLabel>
                  <FormControl>
                    <Input placeholder="Alguma observação?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleVoltar}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Enviar
              </Button>
            </div>
          </form>
        </Form>
      );
    }

    if (tipoSelecionado === "investimento") {
      return (
        <Form {...investimentoForm}>
          <form
            onSubmit={investimentoForm.handleSubmit((d) => onSubmit(d))}
            className="space-y-4"
          >
            <FormField
              control={investimentoForm.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={investimentoForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={investimentoForm.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      {...field}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={investimentoForm.control}
              name="valorAproximado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor aproximado para investir</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: R$ 50.000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={investimentoForm.control}
              name="prazoDesejado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo desejado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="12">12 meses</SelectItem>
                      <SelectItem value="24">24 meses</SelectItem>
                      <SelectItem value="36">36 meses</SelectItem>
                      <SelectItem value="48">48 meses</SelectItem>
                      <SelectItem value="60">60 meses ou mais</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={investimentoForm.control}
              name="objetivoInvestimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo do investimento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="reserva">Reserva de emergência</SelectItem>
                      <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                      <SelectItem value="patrimonio">Formação de patrimônio</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={investimentoForm.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem adicional</FormLabel>
                  <FormControl>
                    <Input placeholder="Alguma observação?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleVoltar}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Enviar
              </Button>
            </div>
          </form>
        </Form>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Enviado com sucesso!</h3>
            <p className="text-muted-foreground">
              Obrigado. Em breve entraremos em contato.
            </p>
          </div>
        ) : step === "selecao" ? (
          <>
            <DialogHeader>
              <DialogTitle>Simular consórcio</DialogTitle>
              <DialogDescription>
                Escolha o tipo de consórcio:
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3 mt-4">
              {TIPOS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleSelectTipo(id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                    "hover:border-primary hover:bg-primary/5 hover:shadow-md",
                    "border-border text-left"
                  )}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-semibold text-lg">{label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                Simular consórcio de{" "}
                {tipoSelecionado === "imoveis"
                  ? "Imóveis"
                  : tipoSelecionado === "automoveis"
                  ? "Automóveis"
                  : "Investimento"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados para recebermos sua solicitação.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">{renderForm()}</div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
