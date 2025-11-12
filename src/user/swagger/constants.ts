export const UserSummaryConstants = {
  UPDATE: 'Обновление профиля пользователя',
  GET_PROFILE: 'Получение профиля пользователя',
};

export const UserRouteConstants = {
  UPDATE: {
    OK: 'Данные профиля пользователя успешно обновлены',
  },
  GET_PROFILE: {
    OK: 'Профиль пользователя успешно получен',
  },
};

export const UserDtoDescriptionConstants = {
  NAME: 'Строка, состоящая минимум из 4-х символов или null',
  CREATED_AT: 'Дата регистрации пользователя в формате ISO 8601',
  EMAIL: 'Адрес электронной почты',
  PASSWORD: 'Строка, состоящая минимум из 6-ти символов',
};
