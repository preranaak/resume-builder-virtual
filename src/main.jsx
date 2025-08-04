import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CssBaseline } from '@mui/material'
import { FormContext, initialResumeData } from './hooks/useForm.js'
const AppWrapper = ({children}) => {
  const [formData, setFormData] = useState(initialResumeData);
  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline />
    <AppWrapper>
      <App />
    </AppWrapper>
  </React.StrictMode>,
)

