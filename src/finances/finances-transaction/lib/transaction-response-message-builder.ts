import {
  ResponseMessageBuilderStatus,
  ResponseMessageBuilders,
  responseMessageBuilder,
} from '@/shared/lib/response-message-builder';

type TransactionMessageBuilderParams = { label: string };

const transactionMessageBuilders: ResponseMessageBuilders = {
  create: ({ label }: TransactionMessageBuilderParams) =>
    `Транзакция "${label}" успешно создана!`,
  update: ({ label }: TransactionMessageBuilderParams) =>
    `Транзакция "${label}" успешно обновлена!`,
  delete: ({ label }: TransactionMessageBuilderParams) =>
    `Транзакция "${label}" успешно удалена!`,
};

export const transactionResponseMessageBuilder = (
  label: string,
  type: ResponseMessageBuilderStatus,
) => {
  return responseMessageBuilder(transactionMessageBuilders, type, { label });
};
