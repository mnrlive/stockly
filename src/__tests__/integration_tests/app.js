import '@testing-library/jest-dom';

import React from 'react';
import {render as rtlRender, screen, fireEvent} from '@testing-library/react';
import {
  HashRouter as Router, Switch, Route,
} from 'react-router-dom';
import App from '../../components/App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from '../../reducers';
import { toggleDisplayMain } from '../../actions';
import StocksApi from '../../api/stocksApi';

const initialStateBase = {
  stocks: [],
  displayMainContent: true,
  activeStock: {},
};
const storeBase = createStore(rootReducer, initialStateBase);

function render(
  ui,
  {
    initialState = initialStateBase,
    store = storeBase,
    ...renderOptions
  } = {},
) {
  function Wrapper({children}) {
    return <Provider store={store}> {children} </Provider>
  }
  return rtlRender(ui, {wrapper: Wrapper, ...renderOptions})
}


test('show logo image when App is rendered', () => {
  render(<App />);
  expect(screen.findByAltText('stockly logo')).toBeDefined();
});

test('show input filter when the App is rendered', () => {
  render(<App />);
  expect(screen.getByPlaceholderText('Search for stocks')).toBeDefined();
});


test('show above the fold element when website is rendered for the first time', () => {
  render(<App />);
  expect(screen.getByTestId('mainContent')).toBeDefined();
});

test('hide above the fold element after redux store displayMainContent is set to true', () => {
  render(<App />);
  expect(screen.getByTestId('mainContent')).toBeDefined();
  storeBase.dispatch(toggleDisplayMain(false));
  expect(screen.getByTestId('mainContent').style.display).toBe('none');

});

test('show top 3 most gainer stocks symbols', () => {
  render(<App />);
  StocksApi.getMostGainersList().then(data => {
    data = data.slice(0,3);
    data.forEach(stock => {
      expect(screen.getByText(stock.ticker)).toBeDefined();
    });
  })
});

test('show top 3 most loser stocks symbols', async () => {
  render(<App />);
  StocksApi.getMostLosersList().then(data => {
    data = data.slice(0,3);    
    data.forEach(stock => {
      expect(screen.getByText(stock.ticker)).toBeDefined();
    });
  })
});
