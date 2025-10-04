import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { getProductCategories, CategoryOption } from '../../api/dummyjson';
import { Field, ErrorText, Form, Button, Helper, RetryButton, Row } from './styles';

// Обоснование Zod: строгие схемы на клиенте + типобезопасность для RHF
const schema = z.object({
  workplace: z.string().min(1, 'Выберите место работы'),
  address: z.string().min(1, 'Обязательное поле'),
});

type FormSchema = z.infer<typeof schema>;

function getErrMsg(err: unknown): string | undefined {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as any).message;
    return typeof m === 'string' ? m : undefined;
  }
  return undefined;
}

export default function Step2() {
  const navigate = useNavigate();
  const { data, setFormValues } = useFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      workplace: (data.workplace as any) ?? '',
      address: data.address ?? '',
    },
  });

  // Категории (кешируются внутри api/dummyjson.ts)
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState<boolean>(true);
  const [catsError, setCatsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingCats(true);
      setCatsError(null);
      try {
        const list = await getProductCategories();
        if (active) setCategories(list);
      } catch (e: any) {
        if (active) setCatsError(e?.message || 'Ошибка загрузки категорий');
      } finally {
        if (active) setLoadingCats(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onBack = () => {
    // сохраняем текущие введённые значения, чтобы не потерять при переходе
    const values = (reset as any)._formValues as FormSchema | undefined;
    if (values) setFormValues(values);
    navigate('/step1');
  };

  const onSubmit = (values: FormSchema) => {
    setFormValues(values);
    navigate('/step3');
  };

  const canRenderSelect = useMemo(() => !loadingCats && !catsError, [loadingCats, catsError]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Адрес и место работы</h2>

      <Field>
        <label htmlFor="workplace">Место работы</label>
        {!canRenderSelect && (
          <Helper>
            {loadingCats && 'Загружаем категории...'}
            {catsError && (
              <>
                {catsError}{' '}
                <RetryButton
                  type="button"
                  onClick={() => {
                    setCatsError(null);
                    setLoadingCats(true);
                    getProductCategories()
                      .then(setCategories)
                      .catch((e) => setCatsError(e?.message || 'Ошибка загрузки категорий'))
                      .finally(() => setLoadingCats(false));
                  }}
                >
                  Повторить
                </RetryButton>
              </>
            )}
          </Helper>
        )}

        {canRenderSelect && (
          <select id="workplace" {...register('workplace')}>
            <option value="">Выберите категорию</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        )}
        {getErrMsg(errors.workplace) && <ErrorText>{getErrMsg(errors.workplace)}</ErrorText>}
      </Field>

      <Field>
        <label htmlFor="address">Адрес проживания</label>
        <input id="address" type="text" {...register('address')} placeholder="Улица, дом, квартира" />
        {getErrMsg(errors.address) && <ErrorText>{getErrMsg(errors.address)}</ErrorText>}
      </Field>

      <Row>
        <Button type="button" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" disabled={isSubmitting || !canRenderSelect}>
          Далее
        </Button>
      </Row>
    </Form>
  );
}
