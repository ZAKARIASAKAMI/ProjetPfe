export function getApiErrorMessage(error, fallback = 'Une erreur est survenue.') {
  const data = error?.response?.data;
  if (data?.message && typeof data.message === 'string') {
    return data.message;
  }
  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat();
    if (messages.length > 0) {
      return messages.join(' ');
    }
  }
  return fallback;
}
