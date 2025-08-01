export const convertBytesToHumanReadable = (bytes: number | null | undefined): string | null => {
  if (bytes === null || bytes === undefined) {
    return null;
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  let unitIndex = 0;

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  return `${bytes.toFixed(2)} ${units[unitIndex]}`;
};
