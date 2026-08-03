import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Mail, Send, CheckCircle2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useCreateLead } from "@/hooks/useLeads";

const schema = z.object({
  email: z.string().email("Email inválido"),
});

type Values = z.infer<typeof schema>;

interface MaterialRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  materialName: string;
  origem: string;
  metadata?: Record<string, any>;
}

export function MaterialRequestModal({
  open,
  onOpenChange,
  title = "Receber material por e-mail",
  description = "Informe seu e-mail e enviaremos o material em seguida.",
  materialName,
  origem,
  metadata,
}: MaterialRequestModalProps) {
  const { createLead, isLoading } = useCreateLead();
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultValues = useMemo<Values>(() => ({ email: "" }), []);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      setIsSuccess(false);
      form.reset(defaultValues);
    }
  }, [open, form, defaultValues]);

  const onSubmit = async (values: Values) => {
    try {
      const result = await createLead({
        nome: `Solicitação de material: ${materialName}`,
        email: values.email,
        origem,
        metadata: {
          material: materialName,
          ...metadata,
        },
      });

      if (!result.success) {
        throw new Error("Falha ao registrar solicitação");
      }

      setIsSuccess(true);
      toast.success("Perfeito! Vamos enviar o material no seu e-mail.");

      setTimeout(() => {
        onOpenChange(false);
      }, 1200);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível enviar. Tente novamente.");
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (isLoading) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="text-center py-10">
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-xl font-bold">Solicitação enviada</DialogTitle>
            <DialogDescription className="mt-2">
              Você vai receber o material no e-mail informado.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
              <DialogDescription className="text-base">{description}</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Seu e-mail
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading || !form.formState.isValid}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Receber por e-mail
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

