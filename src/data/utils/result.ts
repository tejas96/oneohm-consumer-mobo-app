/**
 * Result Utility — Functional programming Result (Either) pattern
 *
 * Used for handling processes where failures are standard, expected outcomes
 * (e.g., OTP validation, network requests, validation) and should not crash the runtime.
 *
 * Layer: data/utils
 * Dependency direction: None (leaf node)
 */

export class Result<T, E = Error> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(isSuccess: boolean, value?: T, error?: E) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;

    Object.freeze(this);
  }

  public get value(): T {
    if (!this.isSuccess) {
      throw new Error(
        'Cannot retrieve value from a failed Result. Use result.error instead.',
      );
    }
    return this._value as T;
  }

  public get error(): E {
    if (this.isSuccess) {
      throw new Error('Cannot retrieve error from a successful Result.');
    }
    return this._error as E;
  }

  /**
   * Create a successful Result instance.
   */
  public static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  /**
   * Create a failed Result instance.
   */
  public static fail<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }
}
