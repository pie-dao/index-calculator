/* eslint-disable jsx-a11y/accessible-emoji */
import { Form, Field } from 'react-final-form'
import { IndexCalculator } from '../../src/classes/IndexCalculator'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'

const onSubmit = async (values: any) => {
  const { portfolio, computeWeights } = values

  const indexCalculator = new IndexCalculator(portfolio)
  await indexCalculator.pullData(false, portfolio)
  indexCalculator.computeAll({
    adjustedWeight: computeWeights,
    sentimentWeight: false,
    computeWeights: computeWeights,
  })
  console.log('idx', JSON.stringify(indexCalculator.dataSet))
}

export default function IndexForm() {
  const initialFormState = { portfolio: [{}] }

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
            <FieldArray name="portfolio">
              {({ fields }) =>
                fields.map((name, index) => (
                  <div className="flex space-x-3 items-end" key={name}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Name</span>
                      </label>
                      <Field
                        className="input input-primary input-bordered"
                        name={`${name}.name`}
                        component="input"
                        placeholder="Name"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Coingecko ID</span>
                      </label>
                      <Field
                        className="input input-primary input-bordered"
                        name={`${name}.coingeckoId`}
                        component="input"
                        placeholder="Coingecko ID"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Ratio</span>
                      </label>
                      <Field
                        className="input input-primary input-bordered"
                        name={`${name}.RATIO`}
                        component="input"
                        placeholder="Ratio"
                        type="number"
                      />
                    </div>
                    {fields.length! > 1 && index !== 0 && (
                      <button type="button" onClick={() => fields.remove(index)} className="btn btn-square btn-ghost">
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
                    )}
                  </div>
                ))
              }
            </FieldArray>
            <div className="form-control items-center">
              <label className="label">
                <span className="label-text">Compute Weights</span>
              </label>
              <Field
                className="checkbox my-3"
                name={`computeWeights`}
                component="input"
                type="checkbox"
                placeholder="Ratio"
              />
            </div>

            <div className="justify-start space-x-2 mt-5 card-actions">
              <button className="btn btn-primary" type="button" onClick={() => push('portfolio', undefined)}>
                Add Coin
              </button>
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
