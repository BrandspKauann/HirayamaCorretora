import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useCreateLead } from '@/hooks/useLeads';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, User, Mail, Phone, Building2, Briefcase, MessageSquare, Sparkles, CreditCard, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const leadSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().refine(
    (val) => val.replace(/\D/g, '').length >= 10,
    { message: 'Telefone deve ter pelo menos 10 dígitos' }
  ),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  mensagem: z.string().optional(),
  quantidadeCartoes: z.string().optional(),
  principalDor: z.string().optional(),
  tipoConsorcio: z.string().optional(),
  principalObjetivo: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  origem?: string;
}

// Máscara de telefone
const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
};

export const LeadFormModal = ({
  open,
  onOpenChange,
  title = "Entre em Contato",
  description = "Preencha o formulário e entraremos em contato em breve.",
  origem = "formulario_site"
}: LeadFormModalProps) => {
  const { createLead, isLoading } = useCreateLead();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const isConsorcio = true; // Site focado em Consórcio Platinum

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: 'onChange', // Validação em tempo real
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      empresa: '',
      cargo: '',
      mensagem: '',
      quantidadeCartoes: '',
      principalDor: '',
      tipoConsorcio: '',
      principalObjetivo: '',
    },
  });

  // Calcular progresso do formulário
  const watchedValues = form.watch();
  useEffect(() => {
    const fields = isConsorcio 
      ? ['nome', 'email', 'telefone', 'empresa', 'cargo', 'mensagem', 'tipoConsorcio', 'principalObjetivo']
      : ['nome', 'email', 'telefone', 'empresa', 'cargo', 'mensagem', 'quantidadeCartoes', 'principalDor'];
    const filledFields = fields.filter(field => {
      const value = watchedValues[field as keyof LeadFormValues];
      return value && value.trim().length > 0;
    }).length;
    setFormProgress((filledFields / fields.length) * 100);
  }, [watchedValues]);

  const onSubmit = async (values: LeadFormValues) => {
    try {
      const result = await createLead({
        ...values,
        origem,
      });

      if (result.success) {
        setIsSuccess(true);
        form.reset();
        
        if (result.savedToDatabase) {
          toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        } else if (result.savedToLocalStorage) {
          toast.success('Mensagem recebida! Entraremos em contato em breve.', {
            description: 'Sua mensagem foi salva e será processada em breve.',
          });
        }

        setTimeout(() => {
          setIsSuccess(false);
          onOpenChange(false);
        }, 2000);
      } else {
        throw new Error('Não foi possível enviar a mensagem');
      }
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setIsSuccess(false);
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
            <div className="relative inline-block mb-6">
              <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto animate-in zoom-in duration-500" />
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-3 animate-in slide-in-from-bottom-4 duration-500">
              Mensagem Enviada! 🎉
            </h3>
            <p className="text-green-700 text-lg animate-in slide-in-from-bottom-4 duration-700">
              Entraremos em contato em breve.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-600">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Obrigado pelo seu interesse!</span>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {title}
              </DialogTitle>
              <DialogDescription className="text-base">{description}</DialogDescription>
              
              {/* Barra de progresso */}
              <div className="pt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${formProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(formProgress)}% preenchido
                </p>
              </div>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => {
                    const hasValue = field.value && field.value.length > 0;
                    const isValid = !form.formState.errors.nome && hasValue;
                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <User className={cn("h-4 w-4 transition-colors", isValid ? "text-green-500" : "text-muted-foreground")} />
                          Nome completo *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Seu nome completo" 
                              className={cn(
                                "transition-all duration-200 pl-10",
                                isValid && "border-green-500 focus-visible:ring-green-500",
                                form.formState.errors.nome && "border-red-500 focus-visible:ring-red-500"
                              )}
                              {...field} 
                            />
                            {isValid && (
                              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 animate-in zoom-in duration-200" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    const hasValue = field.value && field.value.length > 0;
                    const isValid = !form.formState.errors.email && hasValue && field.value.includes('@');
                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <Mail className={cn("h-4 w-4 transition-colors", isValid ? "text-green-500" : "text-muted-foreground")} />
                          Email *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="email" 
                              placeholder="seu@email.com" 
                              className={cn(
                                "transition-all duration-200 pl-10",
                                isValid && "border-green-500 focus-visible:ring-green-500",
                                form.formState.errors.email && "border-red-500 focus-visible:ring-red-500"
                              )}
                              {...field} 
                            />
                            {isValid && (
                              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 animate-in zoom-in duration-200" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => {
                    const hasValue = field.value && field.value.length > 0;
                    const isValid = !form.formState.errors.telefone && hasValue && field.value.replace(/\D/g, '').length >= 10;
                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <Phone className={cn("h-4 w-4 transition-colors", isValid ? "text-green-500" : "text-muted-foreground")} />
                          Telefone *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="(11) 99999-9999" 
                              className={cn(
                                "transition-all duration-200 pl-10",
                                isValid && "border-green-500 focus-visible:ring-green-500",
                                form.formState.errors.telefone && "border-red-500 focus-visible:ring-red-500"
                              )}
                              {...field}
                              onChange={(e) => {
                                const formatted = formatPhone(e.target.value);
                                field.onChange(formatted);
                              }}
                            />
                            {isValid && (
                              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 animate-in zoom-in duration-200" />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="empresa"
                    render={({ field }) => {
                      const hasValue = field.value && field.value.length > 0;
                      return (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Building2 className={cn("h-4 w-4 transition-colors", hasValue ? "text-primary" : "text-muted-foreground")} />
                            Empresa
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nome da empresa" 
                              className="transition-all duration-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => {
                      const hasValue = field.value && field.value.length > 0;
                      return (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <Briefcase className={cn("h-4 w-4 transition-colors", hasValue ? "text-primary" : "text-muted-foreground")} />
                            Cargo
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Seu cargo" 
                              className="transition-all duration-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isConsorcio ? (
                    <>
                      <FormField
                        control={form.control}
                        name="tipoConsorcio"
                        render={({ field }) => {
                          const hasValue = field.value && field.value.length > 0;
                          return (
                            <FormItem className="space-y-2">
                              <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                                <CreditCard className={cn("h-4 w-4 transition-colors", hasValue ? "text-primary" : "text-muted-foreground")} />
                                Tipo de consórcio
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className={cn(
                                    "transition-all duration-200",
                                    hasValue && "border-primary/50"
                                  )}>
                                    <SelectValue placeholder="Selecione o tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="automovel">Consórcio automóvel</SelectItem>
                                  <SelectItem value="imobiliario">Consórcio imobiliário</SelectItem>
                                  <SelectItem value="empresarial">Consórcio empresarial</SelectItem>
                                  <SelectItem value="investimento">Consórcio para investimento</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="principalObjetivo"
                        render={({ field }) => {
                          const hasValue = field.value && field.value.length > 0;
                          return (
                            <FormItem className="space-y-2">
                              <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                                <AlertCircle className={cn("h-4 w-4 transition-colors", hasValue ? "text-primary" : "text-muted-foreground")} />
                                Principal objetivo
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className={cn(
                                    "transition-all duration-200",
                                    hasValue && "border-primary/50"
                                  )}>
                                    <SelectValue placeholder="Selecione o objetivo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="casa-propria">Casa própria</SelectItem>
                                  <SelectItem value="veiculo">Veículo</SelectItem>
                                  <SelectItem value="investimento">Investimento</SelectItem>
                                  <SelectItem value="empresa">Para empresa</SelectItem>
                                  <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </>
                  ) : (
                    <>
                  <FormField
                    control={form.control}
                    name="quantidadeCartoes"
                    render={({ field }) => {
                      const hasValue = field.value && field.value.length > 0;
                      return (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <CreditCard className={cn("h-4 w-4 transition-colors", hasValue ? "text-primary" : "text-muted-foreground")} />
                            Quantidade de cartões
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn(
                                "transition-all duration-200",
                                hasValue && "border-primary/50"
                              )}>
                                <SelectValue placeholder="Selecione a quantidade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1 a 10 cartões</SelectItem>
                              <SelectItem value="11-50">11 a 50 cartões</SelectItem>
                              <SelectItem value="51-200">51 a 200 cartões</SelectItem>
                              <SelectItem value="201-500">201 a 500 cartões</SelectItem>
                              <SelectItem value="500+">Mais de 500 cartões</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="principalDor"
                    render={({ field }) => {
                      const hasValue = field.value && field.value.length > 0;
                      return (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                            <AlertCircle className={cn("h-4 w-4 transition-colors", hasValue ? "text-primary" : "text-muted-foreground")} />
                            Principal necessidade
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn(
                                "transition-all duration-200",
                                hasValue && "border-primary/50"
                              )}>
                                <SelectValue placeholder="Selecione a principal necessidade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="reducao-custos">Redução de custos</SelectItem>
                              <SelectItem value="otimizacao-fiscal">Otimização fiscal</SelectItem>
                              <SelectItem value="gestao-operacional">Gestão operacional</SelectItem>
                              <SelectItem value="comparativo-operadoras">Comparativo de operadoras</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                    </>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="mensagem"
                  render={({ field }) => {
                    const charCount = field.value?.length || 0;
                    const hasValue = charCount > 0;
                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                          <MessageSquare className={cn("h-4 w-4 transition-colors", hasValue ? "text-primary" : "text-muted-foreground")} />
                          Mensagem
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Como podemos ajudar sua empresa?"
                              className={cn(
                                "min-h-[120px] transition-all duration-200 resize-none",
                                hasValue && "border-primary/50"
                              )}
                              {...field}
                            />
                            {hasValue && (
                              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                                {charCount} caracteres
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 transition-all hover:scale-105"
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1 transition-all hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group"
                    disabled={isLoading || !form.formState.isValid}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Enviar Mensagem
                          <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Dica */}
                <p className="text-xs text-center text-muted-foreground pt-2 border-t">
                  💡 Preencha os campos obrigatórios para enviar
                </p>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
