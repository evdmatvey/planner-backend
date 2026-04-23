export const TagSummaryConstants = {
  GET_ONE: 'Получение тега пользователя по id',
  GET_ALL: 'Получение тегов пользователя',
  CREATE: 'Создание тега пользователем',
  UPDATE: 'Обновление тега пользователем',
  DELETE: 'Удаление тега пользователем',
};

export const TagRouteConstants = {
  GET_ONE: {
    OK: 'Тег пользователя успешно получен',
  },
  GET_ALL: {
    OK: 'Теги пользователя успешно получены',
  },
  CREATE: {
    OK: 'Тег успешно создан пользователем',
  },
  UPDATE: {
    OK: 'Тег успешно обновлен пользователем',
  },
  DELETE: {
    OK: 'Тег успешно удалён пользователем',
  },
};

export const TagDtoDescriptionConstants = {
  TITLE: 'Название тега',
  COLOR: 'Цвет указанный в необходимом формате ("ACCENT" | "RED")',
};
