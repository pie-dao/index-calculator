import { IndexCalculator } from "@/classes/IndexCalculator";

export const copyToClipboard = (indexCalculator: IndexCalculator) => {
  const portfolioString = JSON.stringify(indexCalculator.dataSet);
  const el = document.createElement('textarea');
  el.value = portfolioString;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert('Copied to clipboard.')
};
