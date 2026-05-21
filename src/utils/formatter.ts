export function formatBytes(bytes: number, decimals = 1) {
  if (!bytes || bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return "Data Inválida";

  const day = date.getDate().toString().padStart(2, '0');
  
  const months = [
    "JAN", "FEV", "MAR", "ABR", "MAI", "JUN", 
    "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
  ];
  
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}