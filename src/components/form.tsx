/* eslint-disable jsx-a11y/accessible-emoji */
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { IndexCalculator } from '../classes/IndexCalculator'
import { convertToStoreData, StoreContext } from '../context/StoreContext'
import { useContext, useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Option } from './ui/SelectSearch'
import { Store } from '@/types/store'
import SaveJSONButton from './ui/SaveJSON'

const hasExpectedFields = (index: IndexCalculator): boolean => {
  return Boolean(index.SHARPERATIO && index.STDEV && index.VARIANCE);
}

const ERROR_MESSAGES = {
  INVALIDJSON: 'Json is not valid, use a validator',
  INCORRECTCOINID: 'One or more of the Coingecko IDs was not recognised, try again. The [Coin ID] can be found in the coingecko url: https://www.coingecko.com/en/coins/[Coin ID], or by using the search bar',
  NOTENOUGHDATA: 'Some of the Coins listed do not have enough data to compute performance metrics, please try another coin.',
}

const onSubmit = async (values: any, router: NextRouter, setStore?: (store: Store) => void) => {
  try {
    const {
      portfolio,
      computeWeights,
      maxWeight,
      sentimentScore,
      useJson,
      textarea,
      sentimentWeight
    } = values;
    let stop = false;
    let data;
    try {
      data = useJson ? JSON.parse(textarea) : portfolio;
    } catch (e) {
      stop = true;
      alert(ERROR_MESSAGES.INVALIDJSON)
    }
    if(stop) return;
    const indexCalculator = new IndexCalculator(data, maxWeight ? maxWeight : '1', sentimentScore ? sentimentWeight : '0.0')
    try {
      await indexCalculator.pullData(data)
    } catch {
      throw new Error(ERROR_MESSAGES.INCORRECTCOINID)
    }
    indexCalculator.computeAll({
      adjustedWeight: computeWeights,
      sentimentWeight: sentimentScore,
      computeWeights: computeWeights,
    });
    if (!hasExpectedFields(indexCalculator)) throw new Error(ERROR_MESSAGES.NOTENOUGHDATA);
    const newStoreData = convertToStoreData(indexCalculator);
    if (newStoreData && setStore) {
      setStore(newStoreData);
      router.push('/dashboard');
    };
  } catch (err) {
    console.warn(err);
    alert(err)
  }
}

export default function IndexForm(props: { coin: Option, submit: number }) {
  const initialFormState = {
    portfolio: [{
      name: 'Ethereum',
      coingeckoId: 'ethereum',
      RATIO: '0.3'
    }], 
    computeWeights: false,
    sentimentScore: false,
    useJson: false
  }
  const { setStore } = useContext(StoreContext);
  const router = useRouter();
  return (
    <Form
      initialValuesEqual={() => true}
      onSubmit={(v) => onSubmit(v, router, setStore)}
      initialValues={initialFormState}
      mutators={{
        ...arrayMutators,
      }}
      render={({
        handleSubmit,
        form: {
          mutators: { push, pop },
        },
        pristine,
        form,
        submitting,
        values,
      }) => {

        useEffect(() => {
          const { label, value } = props.coin;
          if (label && value) {
            push('portfolio', {
              name: props.coin.label,
              coingeckoId: props.coin.value
            });  
          };
        }, [props.coin, props.submit]);
      
        return (
          <form onSubmit={handleSubmit}>
            { values && values.useJson ?
              <div className="items-end mb-4 w-full h-full">
                <div className="form-control">
                  <Field
                    className="input input-primary w-full h-full input-bordered textarea"
                    name={`textarea`}
                    component="textarea"
                  />
                </div>
              </div>
            : <>
                <FieldArray name="portfolio">
                  {({ fields }) => fields.map((name, index) => (
                    <div className="flex space-x-3 items-end mb-4" key={name}>
                      <div className="form-control">
                        <Field
                          className="input input-primary input-bordered"
                          name={`${name}.name`}
                          component="input"
                          placeholder="Name" />
                      </div>
                      <div className="form-control">
                        <Field
                          className="input input-primary input-bordered min-w-95"
                          name={`${name}.coingeckoId`}
                          placeholder="Coingecko ID"
                          component="input"
                          />
                      </div>
                      {values && values.computeWeights === false ?
                        <div className="form-control">
                          <Field
                            className={`input input-primary input-bordered`}
                            name={`${name}.RATIO`}
                            component="input"
                            placeholder="Ratio"
                            type="number"
                            validate={values.computesWeights} />
                        </div>
                        : ''}
                      {values && values.sentimentScore ?
                        <div className="form-control">
                          <Field
                            className={`input input-primary input-bordered`}
                            name={`${name}.sentimentScore`}
                            component="input"
                            placeholder="Score"
                            type="number" />
                        </div>
                        : ''}
                      <button
                        type="button"
                        onClick={() => fields.remove(index)}
                        className={`btn btn-square btn-ghost`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-6 h-6 stroke-current text-error"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </FieldArray>
                <div className="justify-start space-x-2 my-1 card-actions">
                  <button className="btn btn-primary" type="button" onClick={() => {
                    push('portfolio', undefined)}
                  }>
                    Add Coin Manually
                  </button>
                </div>
              </>
              }
              <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1"
                    name="computeWeights"
                    component="input"
                    type="checkbox"
                    placeholder="Ratio"
                    id="computeWeights" />
                  <label htmlFor="computeWeights" className="label">
                    <span className="label-text">Compute Weights Automatically</span>
                  </label>
                </div>
                <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1"
                    name="sentimentScore"
                    component="input"
                    type="checkbox"
                    placeholder="Ratio"
                    id="sentimentScore" />
                  <label htmlFor="sentimentScore" className="label">
                    <span className="label-text">Use Sentiment Score</span>
                  </label>
                </div>
                { values && values.sentimentScore ? 
                <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1"
                    name="sentimentWeight"
                    component="input"
                    placeholder="1"
                    id="sentimentWeight" />
                  <label htmlFor="sentimentWeight" className="label">
                    <span className="label-text">Sentiment Weights</span>
                  </label>
                </div>
                : '' }
                <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1"
                    name="useJson"
                    component="input"
                    type="checkbox"
                    placeholder=""
                    id="useJson" />
                  <label htmlFor="sentimentScore" className="label">
                    <span className="label-text">Use Json</span>
                  </label>
                </div>
                <div className="form-control items-center flex-row">
                  <Field
                    className="checkbox my-3 mr-1 w-10 text-center text-black"
                    name="maxWeight"
                    component="input"
                    placeholder="1"
                    id="maxWeight" />
                  <label htmlFor="maxWeight" className="label">
                    <span className="label-text">Max Weights</span>
                  </label>
                </div>
                <div className="card-actions justify-between">
                  <SaveJSONButton data={form.getState().values} />
                  <div className="justify-end space-x-2">
                  <button className="btn btn-primary" type="submit" disabled={submitting || pristine}>
                    Submit
                  </button>
                  <button className="btn btn-primary" type="button" onClick={form.reset} disabled={submitting || pristine}>
                    Reset
                  </button>
                </div>

                </div>
          </form>
        )
      }}
    />
  )
}
