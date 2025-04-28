import { Statistics } from '../Statistics';

type DataItem = {
  value: number;
};

describe('Statistics', () => {
  const key: keyof DataItem = 'value';

  describe('getMean', () => {
    it('calculates mean excluding data according to excludedDataPercentByDatasetSize', () => {
      const data = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: 9 },
        { value: 10 },
      ];

      const stats = new Statistics<DataItem>(data, key);
      const mean = stats.getMean();

      expect(mean).toBeCloseTo(5.5);
    });

    it('calculates mean correctly for smallDataset (no exclusion)', () => {
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }];

      const stats = new Statistics<DataItem>(data, key);
      const mean = stats.getMean();

      expect(mean).toBe(25);
    });
  });

  describe('getDeviationPercent', () => {
    it('calculates deviation percent correctly', () => {
      const data = [
        { value: 10 },
        { value: 20 },
        { value: 30 },
        { value: 40 },
        { value: 50 },
      ];

      const stats = new Statistics<DataItem>(data, key);

      const deviationPercent = stats.getDeviationPercent(45);

      expect(deviationPercent).toBeCloseTo(50);
    });
  });
});
