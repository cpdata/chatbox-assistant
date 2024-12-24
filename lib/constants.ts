export const REQUIRED_ENV_VARS = {
  OPENAI_API_KEY: 'OpenAI API Key',
  OPENAI_ASSISTANT_ID: 'OpenAI Assistant ID',
} as const;

export const IS_DISPLAY_MODE =
  process.env.ENVIRONMENT == 'display' ? true : true;

export const AVAILABLE_ASSISTANTS = IS_DISPLAY_MODE
  ? [
      { id: 'mock_asst_1', name: 'Customer Support' },
      { id: 'mock_asst_2', name: 'Technical Advisor' },
    ]
  : [
      {
        id: process.env.OPENAI_ASSISTANT_ID || 'asst_1',
        name: 'General Assistant',
      },
      { id: 'asst_2', name: 'Code Helper' },
      { id: 'asst_3', name: 'Writing Assistant' },
    ];
