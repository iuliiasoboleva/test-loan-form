export type FormData = {
  // Step 1
  phone: string;
  firstName: string;
  lastName: string;
  gender: 'Мужской' | 'Женский';

  // Step 2
  workplace: string; // категория из DummyJSON
  address: string;

  // Step 3
  loanAmount: number; // 200..1000
  loanTerm: number;   // 10..30
};
