import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { InvalidTipInputError } from '../errors/InvalidTipInputError';
import type { LocalTipResult, TipInput } from '../model/TipCalculation';

export class TipCalculator {
  calculate(input: TipInput): Result<LocalTipResult, InvalidTipInputError> {
    if (!(input.bill > 0) || !Number.isFinite(input.bill)) {
      return err(new InvalidTipInputError('bill', input.bill));
    }
    if (input.tipPercent < 0 || !Number.isFinite(input.tipPercent)) {
      return err(new InvalidTipInputError('tipPercent', input.tipPercent));
    }
    if (!Number.isInteger(input.splitBetween) || input.splitBetween < 1) {
      return err(new InvalidTipInputError('splitBetween', input.splitBetween));
    }

    const rawTip = (input.bill * input.tipPercent) / 100;
    let total = input.bill + rawTip;
    let tipAmount = rawTip;

    if (input.roundUp) {
      total = Math.ceil(total);
      tipAmount = total - input.bill;
    }

    const effectiveTipPercent = (tipAmount / input.bill) * 100;
    const perPersonBill = input.bill / input.splitBetween;
    const perPersonTip = tipAmount / input.splitBetween;
    const perPersonTotal = total / input.splitBetween;

    return ok({
      tipAmount,
      total,
      perPersonBill,
      perPersonTip,
      perPersonTotal,
      effectiveTipPercent,
    });
  }
}
