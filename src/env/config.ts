export const getEnvSafely = (envKey: string, defaultValue?: string): string => {
  const envVal = process.env[envKey] || defaultValue;
  if (!envVal && defaultValue === undefined) {
    console.warn(`Environment variable ${envKey} is not set.`);
  }
  return envVal || '';
};

