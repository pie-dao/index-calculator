/* eslint-disable jsx-a11y/accessible-emoji */
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { IndexCalculator } from '../classes/IndexCalculator'
import { convertToStoreData, StoreContext } from '../context/StoreContext'
import { useContext } from 'react'
import { useRouter } from 'next/router'

const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};



export default function IndexForm() {

  const initialFormState = { portfolio: [{}], computeWeights: true,  sentimentScore: false, useJson: false}
  const { setStore } = useContext(StoreContext);
  const router = useRouter();
  const onSubmit = async (values: any) => {
    try {
      const { portfolio, computeWeights, maxWeight, sentimentScore, useJson, textarea, sentimentWeight } = values
      let stop = false;
      let data;
      try {
        data = useJson ? JSON.parse(textarea) : portfolio;
      } catch (e) {
        stop = true;
        alert('Json is not valid, use a validator')
      }
      
      if(stop) return;
      const indexCalculator = new IndexCalculator(data, maxWeight ? maxWeight : '1', sentimentScore ? sentimentWeight : '0.0')
      await indexCalculator.pullData(false, data)
      indexCalculator.computeAll({
        adjustedWeight: computeWeights,
        sentimentWeight: sentimentScore,
        computeWeights: computeWeights,
      })
      const portfolioString = JSON.stringify(indexCalculator.dataSet);
      console.log('Performance', indexCalculator.performance);
      console.log('idx', portfolioString);
      console.log('idx', indexCalculator);
      copyToClipboard(portfolioString);
      // alert('Copied to clipboard.')
      const newStoreData = convertToStoreData(indexCalculator.dataSet, indexCalculator.performance);
      if (newStoreData && setStore) {
        setStore(newStoreData);
        router.push('/dashboard');
      };
    } catch (err) {
      alert(`One or more of the Coingecko IDs was not recognised, try again. The [Coin ID] can be found in the coingecko url: https://www.coingecko.com/en/coins/[Coin ID]`);
    }
  }
  return (
    <Form
      onSubmit={onSubmit}
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
        return (
          <form onSubmit={handleSubmit}>
            { values.useJson ?
              <div className="flex space-x-3 items-end mb-4">
                <div className="form-control">
                  <Field
                    className="input input-primary input-bordered textarea"
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
                          className="input input-primary input-bordered"
                          name={`${name}.coingeckoId`}
                          component="input"
                          placeholder="Coingecko ID" />
                      </div>
                      {values.computeWeights === false ?
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
                      {values.sentimentScore ?
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
                        className={`btn btn-square btn-ghost ${fields.length! > 1 && index !== 0 ? '' : 'invisible'}`}
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
                  <button className="btn btn-primary" type="button" onClick={() => push('portfolio', undefined)}>
                    Add Coin
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
                    <span className="label-text">Compute Weights</span>
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
                { values.sentimentScore ? 
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
                    className="checkbox my-3 mr-1"
                    name="maxWeight"
                    component="input"
                    placeholder="1"
                    id="maxWeight" />
                  <label htmlFor="maxWeight" className="label">
                    <span className="label-text">Max Weights</span>
                  </label>
                </div>
                <div className="justify-end space-x-2 card-actions">
                  <button className="btn btn-primary" type="submit" disabled={submitting || pristine}>
                    Submit
                  </button>
                  <button className="btn btn-primary" type="button" onClick={form.reset} disabled={submitting || pristine}>
                    Reset
                  </button>
                </div>
          </form>
        )
      }}
    />
  )
}
