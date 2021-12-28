import React from 'react';

export const copyToClipboard = (data: string, message: string) => {
  const el = document.createElement('textarea');
  el.value = data;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert(message)
};

const SaveJSONButton = (props: { data: { portfolio: Array<any> } }): JSX.Element => {
  let latest: string | null = null;
  if (typeof window !== 'undefined') {
    latest = localStorage.getItem('latest');
  }
  const fromLocal = () => {
    latest ? copyToClipboard(latest, 'Copied most recent index to clipboard') : alert('Couldn\'t find previous index');
  }
  const click = () => {
    if (!props.data || props.data.portfolio.length === 0) {
      alert('Nothing to Copy')
    } else {
      const portfolio = JSON.stringify(props.data.portfolio);
      copyToClipboard(portfolio, 'copied JSON to clipboard');
      localStorage.setItem('latest', portfolio);
    }
  }
  return (
    <>
      <button
        type="button"
        className="btn btn-primary" 
        onClick={click}>Export to JSON
      </button>
      {
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!latest} 
          onClick={fromLocal}>Load Most Recent Index
        </button>
      }
    </>
  )
}

export default SaveJSONButton;