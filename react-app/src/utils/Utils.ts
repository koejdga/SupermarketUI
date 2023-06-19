export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateToTime(date: Date): string {
  return new Date(date).toLocaleTimeString("uk-UA");
}

export function convertStringToDate(dateString: string): Date {
  const [day, month, year] = dateString.split(" ");

  const monthMap: { [key: string]: number } = {
    січня: 1,
    лютого: 2,
    березня: 3,
    квітня: 4,
    травня: 5,
    червня: 6,
    липня: 7,
    серпня: 8,
    вересня: 9,
    жовтня: 10,
    листопада: 11,
    грудня: 12,
  };

  const monthNumber = monthMap[month];

  const date = new Date(Number(year), monthNumber, parseInt(day, 10));

  return date;
}

export function formatDateForDb(date: Date): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
