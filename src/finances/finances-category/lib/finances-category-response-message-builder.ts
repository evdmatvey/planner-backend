import {
  ResponseMessageBuilderStatus,
  ResponseMessageBuilders,
  responseMessageBuilder,
} from '@/shared/lib/response-message-builder';

type FinancesCategoryMessageBuilderParams = { title: string };

const financesCategoryMessageBuilders: ResponseMessageBuilders = {
  create: ({ title }: FinancesCategoryMessageBuilderParams) =>
    `Категория "${title}" успешно создана!`,
  update: ({ title }: FinancesCategoryMessageBuilderParams) =>
    `Категория "${title}" успешно обновлена!`,
  delete: ({ title }: FinancesCategoryMessageBuilderParams) =>
    `Категория "${title}" успешно удалена!`,
};

export const financesCategoryResponseMessageBuilder = (
  title: string,
  type: ResponseMessageBuilderStatus,
) => {
  return responseMessageBuilder(financesCategoryMessageBuilders, type, {
    title,
  });
};
