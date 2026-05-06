export function resolveCompanyScope(
  selected?: string[],
  defaultCompanyCodes?: string[]
): string[] {
  if (selected && selected.length > 0) {
    return [...selected].sort();
  }

  if (defaultCompanyCodes && defaultCompanyCodes.length > 0) {
    return [...defaultCompanyCodes].sort();
  }

  return [];
}

