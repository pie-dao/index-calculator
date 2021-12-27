import React from 'react';

export const copyToClipboard = (data: string) => {
  const el = document.createElement('textarea');
  el.value = data;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert('Saved JSON to clipboard.')
};

const SaveJSONButton = (props: { data: { portfolio: Array<any> } }): JSX.Element => {
  const click = () => {
    const portfolio = JSON.stringify(props.data.portfolio);
    copyToClipboard(portfolio);
  }
  return (
    <button
      type="button"
      className="btn btn-primary" 
      onClick={click}>Save Index as JSON
    </button>
  )
}

export default SaveJSONButton;