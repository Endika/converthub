import { isErr, ok, type Result } from '../../../shared-kernel/domain/Result';
import type { InvalidTipInputError } from '../domain/errors/InvalidTipInputError';
import type { TipInput, TipResult } from '../domain/model/TipCalculation';
import type { RateConverterPort } from '../domain/ports/out/RateConverterPort';
import type { TipCalculator } from '../domain/services/TipCalculator';

export class CalculateTipUseCase {
  constructor(
    private readonly calculator: TipCalculator,
    private readonly rateConverter: RateConverterPort,
  ) {}

  execute(input: TipInput): Result<TipResult, InvalidTipInputError> {
    const local = this.calculator.calculate(input);
    if (isErr(local)) return local;

    const inHome = (amount: number): number | null =>
      this.rateConverter.convert(
        amount,
        input.billCurrency,
        input.homeCurrency,
      );

    return ok({
      ...local.value,
      tipAmountHome: inHome(local.value.tipAmount),
      totalHome: inHome(local.value.total),
      perPersonTotalHome: inHome(local.value.perPersonTotal),
    });
  }
}
