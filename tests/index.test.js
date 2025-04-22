import React from 'react';
import { render } from '@testing-library/react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as reportWebVitals from './reportWebVitals';
import App from './App';
import './index';

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

jest.mock('./reportWebVitals', () => jest.fn());

describe('index.js', () => {
  let rootElement;

  beforeEach(() => {
   
    rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'root');
    document.body.appendChild(rootElement);


    jest.clearAllMocks();
  });

  afterEach(() => {

    document.body.removeChild(rootElement);
  });

  test('renders App component with BrowserRouter and StrictMode into root element', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(rootElement);

    require('./index');


    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);


    expect(ReactDOM.createRoot().render).toHaveBeenCalledWith(
      expect.anything()
    );

    render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
      { container: rootElement }
    );

    expect(rootElement.querySelector('div')).toBeInTheDocument(); 
  });

  test('calls reportWebVitals', () => {

    require('./index');

    expect(reportWebVitals).toHaveBeenCalled();
  });
});