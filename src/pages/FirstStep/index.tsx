import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { Field, ErrorText, Form, Button } from './styles';

const phoneRegex = /^0\d{3} \d{3} \d{3}$/;
// Разрешаем любые буквы Юникода, диакритику (\p{M}), пробелы, дефис и апостроф
const nameRegex = /^[\p{L}\p{M}'\- ]+$/u;

const schema = z.object({
  phone: z.string().regex(phoneRegex, 'Формат: 0XXX XXX XXX'),
  firstName: z
    .string()
    .trim()
    .min(1, 'Обязательное поле')
    .regex(nameRegex, 'Введите буквы'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Обязательное поле')
    .regex(nameRegex, 'Введите буквы'),
  gender: z.enum(['Мужской', 'Женский'], { required_error: 'Выберите пол' }),
});

type FormSchema = z.infer<typeof schema>;

function getErrMsg(err: unknown): string | undefined {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as any).message;
    return typeof m === 'string' ? m : undefined;
  }
  return undefined;
}

export default function FirstStep() {
  const navigate = useNavigate();
  const { setFormValues, data } = useFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: data.phone ?? '',
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      gender: (data.gender as any) ?? undefined, // важно: undefined, не ''
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = (values: FormSchema) => {
    setFormValues(values);
    navigate('/step2');
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Личные данные</h2>

      <Field>
        <label htmlFor="phone">Телефон</label>
        <input
          id="phone"
          type="tel"
          placeholder="0XXX XXX XXX"
          {...register('phone')}
        />
        {getErrMsg(errors.phone) && <ErrorText>{getErrMsg(errors.phone)}</ErrorText>}
      </Field>

      <Field>
        <label htmlFor="firstName">Имя</label>
        <input
          id="firstName"
          type="text"
          inputMode="text"
          {...register('firstName', {
            // нормализуем пробелы, но НЕ удаляем цифры — чтобы схема показала "Введите буквы"
            setValueAs: (v: string) =>
              typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : v,
          })}
        />
        {getErrMsg(errors.firstName) && <ErrorText>{getErrMsg(errors.firstName)}</ErrorText>}
      </Field>

      <Field>
        <label htmlFor="lastName">Фамилия</label>
        <input
          id="lastName"
          type="text"
          inputMode="text"
          {...register('lastName', {
            setValueAs: (v: string) =>
              typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : v,
          })}
        />
        {getErrMsg(errors.lastName) && <ErrorText>{getErrMsg(errors.lastName)}</ErrorText>}
      </Field>

      <Field>
        <label htmlFor="gender">Пол</label>
        <select id="gender" {...register('gender')}>
          <option value="">Выберите пол</option>
          <option value="Мужской">Мужской</option>
          <option value="Женский">Женский</option>
        </select>
        {getErrMsg(errors.gender) && <ErrorText>{getErrMsg(errors.gender)}</ErrorText>}
      </Field>

      <Button type="submit">Далее</Button>
    </Form>
  );
}
