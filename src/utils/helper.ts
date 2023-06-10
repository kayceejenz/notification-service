export const _throwOrContinue = (error: unknown, retries: number) => {
  if (retries <= 0) {
    throw error;
  }
};
