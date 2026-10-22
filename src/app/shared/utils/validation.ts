// Правила валидации из ТЗ
export const NAME_PATTERN = /^[А-ЯЁ][а-яё]*(?: [А-ЯЁ][а-яё]*)*$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[A-ZА-ЯЁ]).{8,}$/;
