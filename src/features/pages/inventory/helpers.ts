export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString || dateString === "--") return "--";
  
  const date = new Date(dateString);
  // Validar si la fecha es válida
  if (isNaN(date.getTime())) return "--";

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short", 
  }).replace('.', '');
};