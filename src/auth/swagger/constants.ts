export const AuthSummaryConstants = {
  LOGIN: 'Авторизация',
  REGISTER: 'Регистрация',
  LOGOUT: 'Выход из системы',
  GET_NEW_TOKEN: 'Получение нового access токена по refresh',
};

export const AuthRouteConstants = {
  LOGIN: {
    OK: 'Успешно авторизован',
    UNAUTHORIZED: 'Неверный логин или пароль',
  },
  REGISTER: {
    OK: 'Аккаунт успешно создан',
    CONFLICT:
      'Регистрация требует уникальный email. Не должно быть пользователей с одинаковым email',
  },
  LOGOUT: {
    OK: 'Успешный выход из системы',
  },
  GET_NEW_TOKEN: {
    OK: 'Токены успешно обновлены',
    NOT_FOUND: 'Пользователь с id из refresh token не найден',
    UNAUTHORIZED: 'Неверный refresh токен',
  },
};
