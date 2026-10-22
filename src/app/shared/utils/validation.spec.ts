import { EMAIL_PATTERN, NAME_PATTERN, PASSWORD_PATTERN } from './validation';

describe('validation patterns', () => {
  it('name: only Russian words starting with a capital letter', () => {
    expect(NAME_PATTERN.test('Иван')).toBe(true);
    expect(NAME_PATTERN.test('Иван Петров')).toBe(true);
    expect(NAME_PATTERN.test('Алёна Ёлкина')).toBe(true);
    expect(NAME_PATTERN.test('иван')).toBe(false);
    expect(NAME_PATTERN.test('Иван петров')).toBe(false);
    expect(NAME_PATTERN.test('Ivan')).toBe(false);
    expect(NAME_PATTERN.test('Иван1')).toBe(false);
    expect(NAME_PATTERN.test('Иван  Петров')).toBe(false);
  });

  it('email: correct address format', () => {
    expect(EMAIL_PATTERN.test('test@gmail.com')).toBe(true);
    expect(EMAIL_PATTERN.test('test@gmail')).toBe(false);
    expect(EMAIL_PATTERN.test('test.gmail.com')).toBe(false);
    expect(EMAIL_PATTERN.test('te st@gmail.com')).toBe(false);
  });

  it('password: 8+ chars, one capital letter and one digit', () => {
    expect(PASSWORD_PATTERN.test('Password1')).toBe(true);
    expect(PASSWORD_PATTERN.test('Пароль123')).toBe(true);
    expect(PASSWORD_PATTERN.test('Pass1')).toBe(false);
    expect(PASSWORD_PATTERN.test('password1')).toBe(false);
    expect(PASSWORD_PATTERN.test('Password')).toBe(false);
  });
});
