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
    const data = await IndexCalculator.prototype.fetchCoinData('ether');
    expect(data).toEqual(apiResponse);
  });


  it('computeMCAP', () => {

  });

  it('computeWeights', () => {

  });

  it('getTotal', () => {

  });

  it('getTokenLastPrice', () => {

  });

  it('computeTokenNumbers', () => {

  });

  it('computeBacktesting', () => {

  });

  it('computeCorrelation', () => {

  });

  it('computeCovariance', () => {

  });

  it('computeMCTR', () => {

  });

  it('computePerformance', () => {

  });

  it('computeSharpeRatio', () => {

  }); 
  
  it('computeInitialTokenAmounts', () => {

  });   
});