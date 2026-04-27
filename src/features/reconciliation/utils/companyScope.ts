export function resolveCompanyScope(
    selected: string[] | undefined,
    all: string[] | undefined
  ): string[] | undefined {
    if (!selected || !all) {
      return undefined;
    }
  
    if (selected.length === 0) {
      return undefined;
    }

    const selectedSorted = [...selected].sort();
    const allSorted = [...all].sort();
  
    const isAllSelected =
      selectedSorted.length === allSorted.length &&
      selectedSorted.every((code, idx) => code === allSorted[idx]);
  
    return isAllSelected ? undefined : selectedSorted;
  }