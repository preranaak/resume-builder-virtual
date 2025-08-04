import { createContext, useContext, useState } from 'react';
export const initialResumeData = {
    personalDetails: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: '',
      photo: null
    },
    workExperience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    education: [{
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    }],
    projects: [{
      name: '',
      description: '',
      technologies: '',
      link: ''
    }],
    skills: {
      technical: '',
      soft: ''
    },
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      link: ''
    }]
  };
export const FormContext = createContext({
    formData: initialResumeData,
    setFormData: () => {}
});
export const useForm = () => {
    const context = useContext(FormContext);
    if (!context) {
      throw new Error('useForm must be used within a FormProvider');
    }
  
    const { formData, setFormData } = context;
    return [formData, setFormData];
};


