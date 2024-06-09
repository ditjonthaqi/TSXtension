export class Result<TValue, TError extends Error> {
	public readonly value?: TValue;
	public readonly error?: TError;
	private readonly _isSuccess: boolean;

	private constructor(isSuccess: boolean, value?: TValue, error?: TError) {
		this._isSuccess = isSuccess;
		this.value = value;
		this.error = error;
	}

	public static value<TValue, TError extends Error>(
		value: TValue,
	): Result<TValue, TError> {
		return new Result<TValue, TError>(true, value, undefined);
	}

	public static error<TValue, TError extends Error>(
		error: TError,
	): Result<TValue, TError> {
		return new Result<TValue, TError>(false, undefined, error);
	}

	public hasValue(): this is Result<TValue, TError> & {
        value: TValue;
        error: undefined;
        } {
		return this._isSuccess;
	}

	public hasError(): this is Result<TValue, TError> & {
        value: undefined;
        error: TError;
        } {
		return !this._isSuccess;
	}
}
