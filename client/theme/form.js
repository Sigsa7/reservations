import styled from 'styled-components';

const Label = styled.label`
  font-size: .875rem;
  font-weight: 500;
  padding-bottom: .25rem;
`;

const Form = styled.form`
  padding-top: .75rem;
  margin: .5em;
  display: block;
  clear: both;
  border-top: 1px solid #d8d9db;
`;

const Select = styled.select`
  cursor: pointer;
  font-family: inherit;
  background-color: #fff;
  font-size: .875rem;
  display: block;
  outline: none;
  border: none;
      border-bottom-color: #d8d9db;
      border-bottom-style: none;
      border-bottom-width: medium;
  width: 100%;
  height: 35px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  border-bottom: 1px solid #d8d9db;

  &:hover, &:focus {
    border-bottom: 2px solid #da3743;
  }
`;

const CalendarInput = styled.input`
  cursor: pointer;
  -webkit-box-flex: 1;
  -ms-flex: 1 50%;
  flex: 1 50%;
  width: 130px;
  background-color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 35px;
  padding-top: 2px;
  border: 0;
  border-bottom: 1px solid #d8d9db;

  &:hover, &:focus {
    border-bottom: 2px solid #da3743;
  }
`;

export {
  Label,
  Form,
  Select,
  CalendarInput,
};
