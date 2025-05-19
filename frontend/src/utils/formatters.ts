export const formatDocumentNumber = (value: string) => {
  const cleanedValue = value.replace(/\D/g, ""); // remove caracteres não numéricos

  if (cleanedValue.length <= 11) {
    // CPF
    return cleanedValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  } else {
    // CNPJ
    return cleanedValue
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
};

export const unformatDocumentNumber = (cpf: string): string => {
  return cpf.replace(/\D/g, "").slice(0, 14);
};

export const formatPhone = (value: string) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");

  return value;
};

export const unformatPhone = (phone: string): string => {
  return phone.replace(/\D/g, "").slice(0, 11);
};

export const formatZipCode = (value: string) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");

  return value;
};

export const unformatZipCode = (zipCode: string): string => {
  return zipCode.replace(/\D/g, "").slice(0, 8);
};

export const formatCurrency = (value: string | number): string => {
  const cents =
    typeof value === "number"
      ? value
      : parseInt(String(value).replace(/\D/g, ""), 10) || 0;

  const reais = cents / 100;

  return reais.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const unformatCurrency = (value: string): string => {
  return value.replace(/\D/g, "").trim();
};

export const centsToAmount = (value: number | string): string => {
  const cents =
    typeof value === "string"
      ? parseInt(value.replace(/\D/g, ""), 10) || 0
      : value;

  return String(cents / 100);
};
