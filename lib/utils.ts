import clsx from "clsx";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

function parseDateInput(input: string) {
  const yearMonthMatch = input.match(/^(\d{4})-(\d{2})$/);

  if (yearMonthMatch) {
    const year = Number.parseInt(yearMonthMatch[1], 10);
    const month = Number.parseInt(yearMonthMatch[2], 10);
    return new Date(year, month - 1, 1);
  }

  const dateOnlyMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnlyMatch) {
    const year = Number.parseInt(dateOnlyMatch[1], 10);
    const month = Number.parseInt(dateOnlyMatch[2], 10);
    const day = Number.parseInt(dateOnlyMatch[3], 10);
    return new Date(year, month - 1, day);
  }

  return new Date(input);
}

export function formatDate(input: string) {
  const parsed = parseDateInput(input);

  if (Number.isNaN(parsed.valueOf())) {
    return input;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function formatMonthYear(input: string) {
  const parsed = parseDateInput(input);

  if (Number.isNaN(parsed.valueOf())) {
    return input;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short"
  });
}
