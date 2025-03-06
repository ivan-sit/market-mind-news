
// Configuration for API keys - keys are stored in localStorage

export const getAlphaVantageApiKey = (): string => {
  return localStorage.getItem('alpha_vantage_api_key') || '';
};

export const setAlphaVantageApiKey = (key: string): void => {
  localStorage.setItem('alpha_vantage_api_key', key);
};

// Re-export OpenAI key functions for consistency
export const getOpenAIApiKey = (): string => {
  return localStorage.getItem('openai_api_key') || '';
};

export const setOpenAIApiKey = (key: string): void => {
  localStorage.setItem('openai_api_key', key);
};
