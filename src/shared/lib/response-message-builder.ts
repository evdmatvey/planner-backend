type ResponseMessageBuilderParams = Record<string, string>;
export type ResponseMessageBuilderStatus = 'create' | 'update' | 'delete';
type ResponseMessageBuilder = (params: ResponseMessageBuilderParams) => string;
export type ResponseMessageBuilders = Partial<
  Record<ResponseMessageBuilderStatus, ResponseMessageBuilder>
>;

export const responseMessageBuilder = (
  messageBuilders: ResponseMessageBuilders,
  status: ResponseMessageBuilderStatus,
  params: ResponseMessageBuilderParams,
) => {
  const builder = messageBuilders[status];

  return builder(params);
};
