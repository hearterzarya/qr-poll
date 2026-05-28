export function priorityLabel(priority: string): string {
  switch (priority) {
    case "P1":
      return "Critical";
    case "P2":
      return "High";
    default:
      return "Normal";
  }
}
