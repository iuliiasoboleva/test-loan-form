import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ConfirmModal from '../../components/ConfirmModal';
import { addDummyProduct } from '../../api/dummyjson';
import { Marks, Value, Btns, Row, Field, ErrorText, Form, Button } from './styles';

// Обоснование Zod: типобезопасная валидация контролов range + строгие границы
const schema = z.object({
  loanAmount: z.number().min(200, 'Минимум $200').max(1000, 'Максимум $1000'),
  loanTerm: z.number().min(10, 'Минимум 10 дней').max(30, 'Максимум 30 дней'),
});

type FormSchema = z.infer<typeof schema>;

function getErrMsg(err: unknown): string | undefined {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as any).message;
    return typeof m === 'string' ? m : undefined;
  }
  return undefined;
}

export default function Step3() {
  const navigate = useNavigate();
  const { data, setFormValues } = useFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      loanAmount: typeof data.loanAmount === 'number' ? data.loanAmount : 200,
      loanTerm: typeof data.loanTerm === 'number' ? data.loanTerm : 10,
    },
  });

  // Показываем текущие значения рядом с ползунками
  const amount = watch('loanAmount');
  const term = watch('loanTerm');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const onBack = () => {
    // сохраняем значения, чтобы при возвращении не терялись
    setFormValues({
      loanAmount: amount,
      loanTerm: term,
    });
    navigate('/step2');
  };

  const onSubmit = async (values: FormSchema) => {
    // сохраняем значения в общий стейт
    setFormValues(values);

    // По ТЗ отправляем только title = firstName + ' ' + lastName
    const title = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim();
    try {
      await addDummyProduct(title);

      // Формируем текст модалки: "Поздравляем, <Фамилия> <Имя>. Вам одобрена <сумма> на <срок> дней."
      const msg = `Поздравляем, ${data.lastName ?? ''} ${data.firstName ?? ''}. Вам одобрена $${values.loanAmount} на ${values.loanTerm} дней.`;
      setModalMsg(msg);
      setModalOpen(true);
    } catch (e: any) {
      alert(e?.message || 'Ошибка отправки. Попробуйте позже.');
    }
  };

  // Для плавного UX — метки шагов
  const amountMarks = useMemo(() => [200, 400, 600, 800, 1000], []);
  const termMarks = useMemo(() => [10, 15, 20, 25, 30], []);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Параметры займа</h2>

        <Field>
          <Row>
            <label htmlFor="loanAmount">Сумма займа</label>
            <Value>${amount}</Value>
          </Row>
          <input
            id="loanAmount"
            type="range"
            min={200}
            max={1000}
            step={100}
            // важно: valueAsNumber для чисел
            {...register('loanAmount', { valueAsNumber: true })}
          />
          <Marks>
            {amountMarks.map((m) => (
              <span key={m}>${m}</span>
            ))}
          </Marks>
          {getErrMsg(errors.loanAmount) && <ErrorText>{getErrMsg(errors.loanAmount)}</ErrorText>}
        </Field>

        <Field>
          <Row>
            <label htmlFor="loanTerm">Срок займа</label>
            <Value>{term} дней</Value>
          </Row>
          <input
            id="loanTerm"
            type="range"
            min={10}
            max={30}
            step={1}
            {...register('loanTerm', { valueAsNumber: true })}
          />
          <Marks>
            {termMarks.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </Marks>
          {getErrMsg(errors.loanTerm) && <ErrorText>{getErrMsg(errors.loanTerm)}</ErrorText>}
        </Field>

        <Btns>
          <Button type="button" onClick={onBack}>
            Назад
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Подать заявку
          </Button>
        </Btns>
      </Form>

      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMsg}
      />
    </>
  );
}
