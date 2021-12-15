import apiResponse from '../../stubs/coingecko-api-response.stub.json';
import { IndexCalculator } from '@/classes/IndexCalculator';


describe('Testing the index calculator logic', () => {
  beforeEach(() => {
    jest
      .spyOn(IndexCalculator.prototype, 'fetchCoinData')
      .mockResolvedValue(apiResponse);
  })
  
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Correctly mocks the outbound request', async () => {
    const data = await IndexCalculator.prototype.fetchCoinData(1);
    expect(data).toEqual(apiResponse);
  });
});