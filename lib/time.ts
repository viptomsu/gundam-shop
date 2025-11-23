export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    // If it's just a number, assume seconds
    const parsed = parseInt(duration);
    if (!isNaN(parsed)) return parsed;
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 24 * 60 * 60;
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }
}
