export function generateBarcode(): string {
  const now = new Date();
  const yyyy = now.getFullYear().toString();
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");
  const seq = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `HKM-${yyyy}${mm}${dd}-${seq}`;
}
