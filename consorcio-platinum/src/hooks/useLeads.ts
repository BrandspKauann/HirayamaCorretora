import { useState } from "react";
import { useSubmit } from "@formspree/react";
import { isSubmissionError } from "@formspree/core";
import { FORMSPREE_FORM_ID } from "@/config/formspree";

export interface LeadData {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  mensagem?: string;
  quantidadeCartoes?: string;
  principalDor?: string;
  tipoConsorcio?: string;
  principalObjetivo?: string;
  origem?: string;
  metadata?: Record<string, unknown>;
}

function buildFormspreePayload(lead: LeadData): Record<string, string> {
  const origem = lead.origem || "formulario_site";
  const base: Record<string, string> = {
    nome: lead.nome,
    email: lead.email,
    _replyto: lead.email,
    _subject: `Consórcio — ${origem}`,
    origem,
    url: typeof window !== "undefined" ? window.location.href : "",
  };

  const optional = [
    ["telefone", lead.telefone],
    ["empresa", lead.empresa],
    ["cargo", lead.cargo],
    ["mensagem", lead.mensagem],
    ["quantidadeCartoes", lead.quantidadeCartoes],
    ["principalDor", lead.principalDor],
    ["tipoConsorcio", lead.tipoConsorcio],
    ["principalObjetivo", lead.principalObjetivo],
  ] as const;

  for (const [key, val] of optional) {
    if (val != null && String(val).trim() !== "") {
      base[key] = String(val);
    }
  }

  if (lead.metadata && Object.keys(lead.metadata).length > 0) {
    base.metadata = JSON.stringify(lead.metadata);
  }

  return base;
}

export const useCreateLead = () => {
  const submitToFormspree = useSubmit(FORMSPREE_FORM_ID);
  const [isLoading, setIsLoading] = useState(false);

  const createLead = async (leadData: LeadData) => {
    setIsLoading(true);
    try {
      const payload = buildFormspreePayload(leadData);
      const result = await submitToFormspree(payload);

      if (isSubmissionError(result)) {
        console.error("Formspree:", result);
        return {
          success: false,
          savedToDatabase: false,
          savedToLocalStorage: false,
        };
      }

      return {
        success: true,
        savedToDatabase: true,
        savedToLocalStorage: false,
      };
    } catch (e) {
      console.error("Erro ao enviar para Formspree:", e);
      return {
        success: false,
        savedToDatabase: false,
        savedToLocalStorage: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { createLead, isLoading };
};
