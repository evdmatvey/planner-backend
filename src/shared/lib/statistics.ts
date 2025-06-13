type DatasetSize = 'smallDataset' | 'mediumDataset' | 'largeDataset';
type DatasetSizeBound = {
  min: number;
  max: number;
};

const excludedDataPercentByDatasetSize: Record<DatasetSize, number> = {
  smallDataset: 0,
  mediumDataset: 0.1,
  largeDataset: 0.05,
};

const datasetSizeConfig: Record<DatasetSize, DatasetSizeBound> = {
  smallDataset: {
    min: 0,
    max: 4,
  },
  mediumDataset: {
    min: 5,
    max: 20,
  },
  largeDataset: {
    min: 21,
    max: Number.POSITIVE_INFINITY,
  },
};

export class Statistics<T> {
  private _datasetSize: DatasetSize;
  private _datasetLength: number;

  public constructor(
    private readonly _data: T[],
    private readonly _measuringValueKey: keyof T,
  ) {
    this._datasetSize = this._estimateDatasetSize();
    this._datasetLength = this._data.length;
    this._data = this._data.sort(
      (a, b) =>
        Number(a[this._measuringValueKey]) - Number(b[this._measuringValueKey]),
    );
  }

  public getMean() {
    const calculationInterval = this._getMeanCalculationInterval();
    let sum = 0;

    for (let i = calculationInterval.start; i < calculationInterval.end; i++) {
      sum += Number(this._data[i][this._measuringValueKey]);
    }

    const summedDataCount = calculationInterval.end - calculationInterval.start;

    return sum / summedDataCount;
  }

  public getDeviationPercent(value: number) {
    const mean = this.getMean();
    const deviation = Math.abs(value - mean) / mean;

    return deviation * 100;
  }

  private _estimateDatasetSize(): DatasetSize {
    const datasetSizes = Object.entries(datasetSizeConfig);

    for (const [datasetSize, bounds] of datasetSizes) {
      if (this._datasetLength > bounds.min && this._datasetLength <= bounds.max)
        return datasetSize as DatasetSize;
    }

    return 'mediumDataset';
  }

  private _getMeanCalculationInterval() {
    const excludedDataCount = this._getExcludedDataCount();

    return {
      start: excludedDataCount,
      end: this._datasetLength - excludedDataCount,
    };
  }

  private _getExcludedDataCount() {
    const excludedDataCount =
      excludedDataPercentByDatasetSize[this._datasetSize] * this._datasetLength;

    return Math.ceil(excludedDataCount);
  }
}
