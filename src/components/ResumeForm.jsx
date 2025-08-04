import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { useForm } from '../hooks/useForm';


const ResumeForm = () => {

  const [ctxFormData, setCtxFormData] = useForm();

  const [formData, setFormData] = useState(ctxFormData);
  
  const handlePersonalDetailsChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handlePersonalDetailsChangeOnBlur = (field) => (event) => {
    const value = event.target.value;
    setCtxFormData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (section, index, field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleArrayFieldChangeOnBlur = (section, index, field) => (event) => {
    const value = event.target.value;
    setCtxFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const handleAddItem = (section) => {
    const newItem = {
      workExperience: { company: '', position: '', startDate: '', endDate: '', description: '' },
      education: { institution: '', degree: '', field: '', graduationDate: '', gpa: '' },
      projects: { name: '', description: '', technologies: '', link: '' },
      certifications: { name: '', issuer: '', date: '', link: '' }
    }[section];

    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));

    setCtxFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };


  const handleRemoveItem = (section, index) => {
    if (index === 0 && formData[section].length === 1) {
      const emptyItem = {
        workExperience: { company: '', position: '', startDate: '', endDate: '', description: '' },
        education: { institution: '', degree: '', field: '', graduationDate: '', gpa: '' },
        projects: { name: '', description: '', technologies: '', link: '' },
        certifications: { name: '', issuer: '', date: '', link: '' }
      }[section];

      setFormData(prev => ({
        ...prev,
        [section]: [emptyItem]
      }));
      setCtxFormData(prev => ({
        ...prev,
        [section]: [emptyItem]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }));
      setCtxFormData(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }));
    }
  };


  const handleSkillsChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [field]: value
      }
    }));
  };

  const handleSkillsChangeOnBlur = (field) => (event) => {
    const value = event.target.value;
    setCtxFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills, 
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create a temporary image to get dimensions
        const img = new Image();
        img.onload = () => {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with reduced quality
          const resizedImage = canvas.toDataURL('image/jpeg', 0.7);
          
          setFormData(prev => ({
            ...prev,
            personalDetails: {
              ...prev.personalDetails,
              photo: resizedImage
            }
          }));
          
          setCtxFormData(prev => ({
            ...prev,
            personalDetails: {
              ...prev.personalDetails,
              photo: resizedImage
            }
          }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box component={Paper} p={3}>
      {/* Personal Details */}
      <Typography variant="h6" gutterBottom>
        Personal Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.personalDetails.name}
            onChange={handlePersonalDetailsChange('name')}
            margin="normal"
            onBlur={handlePersonalDetailsChangeOnBlur('name')}
           
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            value={formData.personalDetails.email}
            onChange={handlePersonalDetailsChange('email')}
            onBlur={handlePersonalDetailsChangeOnBlur('email')}
            margin="normal"
            
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            value={formData.personalDetails.phone}
            onChange={handlePersonalDetailsChange('phone')}
            onBlur={handlePersonalDetailsChangeOnBlur('phone')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            value={formData.personalDetails.location}
            onChange={handlePersonalDetailsChange('location')}
            onBlur={handlePersonalDetailsChangeOnBlur('location')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="LinkedIn"
            value={formData.personalDetails.linkedin}
            onChange={handlePersonalDetailsChange('linkedin')}
            onBlur={handlePersonalDetailsChangeOnBlur('linkedin')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="GitHub"
            value={formData.personalDetails.github}
            onChange={handlePersonalDetailsChange('github')}
            onBlur={handlePersonalDetailsChangeOnBlur('github')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Portfolio"
            value={formData.personalDetails.portfolio}
            onChange={handlePersonalDetailsChange('portfolio')}
            onBlur={handlePersonalDetailsChangeOnBlur('portfolio')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Professional Summary"
            value={formData.personalDetails.summary}
            onChange={handlePersonalDetailsChange('summary')}
            onBlur={handlePersonalDetailsChangeOnBlur('summary')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload"
            type="file"
            onChange={handlePhotoUpload}
          />
          <label htmlFor="photo-upload">
            <Button variant="outlined" component="span" fullWidth>
              Upload Photo
            </Button>
          </label>
        </Grid>
      </Grid>

      {/* Work Experience */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Work Experience
        </Typography>
        {formData.workExperience.map((exp, index) => (
          <Box key={index} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={exp.company}
                  onChange={handleArrayFieldChange('workExperience', index, 'company')}
                  onBlur={handleArrayFieldChangeOnBlur('workExperience', index,'company')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  value={exp.position}
                  onChange={handleArrayFieldChange('workExperience', index, 'position')}
                  onBlur={handleArrayFieldChangeOnBlur('workExperience', index, 'position')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={exp.startDate}
                  onChange={handleArrayFieldChange('workExperience', index, 'startDate')}
                  onBlur={handleArrayFieldChangeOnBlur('workExperience', index, 'startDate')}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={exp.endDate}
                  onChange={handleArrayFieldChange('workExperience', index, 'endDate')}
                  onBlur={handleArrayFieldChangeOnBlur('workExperience', index, 'endDate')}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={exp.description}
                  onChange={handleArrayFieldChange('workExperience', index, 'description')}
                  onBlur={handleArrayFieldChangeOnBlur('workExperience', index, 'description')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={() => handleRemoveItem('workExperience', index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() => handleAddItem('workExperience')}
          variant="outlined"
          color="primary"
        >
          Add Work Experience
        </Button>
      </Box>

      {/* Education */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Education
        </Typography>
        {formData.education.map((edu, index) => (
          <Box key={index} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={edu.institution}
                  onChange={handleArrayFieldChange('education', index, 'institution')}
                  onBlur={handleArrayFieldChangeOnBlur('education', index, 'institution')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={edu.degree}
                  onChange={handleArrayFieldChange('education', index, 'degree')}
                  onBlur={handleArrayFieldChangeOnBlur('education', index, 'degree')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Field of Study"
                  value={edu.field}
                  onChange={handleArrayFieldChange('education', index, 'field')}
                  onBlur={handleArrayFieldChangeOnBlur('education', index, 'field')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Graduation Date"
                  type="date"
                  value={edu.graduationDate}
                  onChange={handleArrayFieldChange('education', index, 'graduationDate')}
                  onBlur={handleArrayFieldChangeOnBlur('education', index, 'graduationDate')}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GPA"
                  value={edu.gpa}
                  onChange={handleArrayFieldChange('education', index, 'gpa')}
                  onBlur={handleArrayFieldChangeOnBlur('education', index, 'gpa')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={() => handleRemoveItem('education', index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() => handleAddItem('education')}
          variant="outlined"
          color="primary"
        >
          Add Education
        </Button>
      </Box>

      {/* Projects */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Projects
        </Typography>
        {formData.projects.map((project, index) => (
          <Box key={index} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={project.name}
                  onChange={handleArrayFieldChange('projects', index, 'name')}
                  onBlur={handleArrayFieldChangeOnBlur('projects', index, 'name')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={project.description}
                  onChange={handleArrayFieldChange('projects', index, 'description')}
                  onBlur={handleArrayFieldChangeOnBlur('projects', index, 'description')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Technologies Used"
                  value={project.technologies}
                  onChange={handleArrayFieldChange('projects', index, 'technologies')}
                  onBlur={handleArrayFieldChangeOnBlur('projects', index, 'technologies')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Project Link"
                  value={project.link}
                  onChange={handleArrayFieldChange('projects', index, 'link')}
                  onBlur={handleArrayFieldChangeOnBlur('projects', index, 'link')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={() => handleRemoveItem('projects', index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() => handleAddItem('projects')}
          variant="outlined"
          color="primary"
        >
          Add Project
        </Button>
      </Box>

      {/* Skills */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Skills
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} >
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Technical Skills"
              value={formData.skills.technical}
              onChange={handleSkillsChange('technical')}
              onBlur={handleSkillsChangeOnBlur('technical')}
              margin="normal"
              helperText="Separate skills with commas"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Soft Skills"
              value={formData.skills.soft}
              onChange={handleSkillsChange('soft')}
              onBlur={handleSkillsChangeOnBlur('soft')}
              margin="normal"
              helperText="Separate skills with commas"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Certifications */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Certifications
        </Typography>
        {formData.certifications.map((cert, index) => (
          <Box key={index} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Certification Name"
                  value={cert.name}
                  onChange={handleArrayFieldChange('certifications', index, 'name')}
                  onBlur={handleArrayFieldChangeOnBlur('certifications', index, 'name')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issuing Organization"
                  value={cert.issuer}
                  onChange={handleArrayFieldChange('certifications', index, 'issuer')}
                  onBlur={handleArrayFieldChangeOnBlur('certifications', index, 'issuer')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={cert.date}
                  onChange={handleArrayFieldChange('certifications', index, 'date')}
                  onBlur={handleArrayFieldChangeOnBlur('certifications', index, 'date')}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Certificate Link"
                  value={cert.link}
                  onChange={handleArrayFieldChange('certifications', index, 'link')}
                  onBlur={handleArrayFieldChangeOnBlur('certifications', index, 'link')}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={() => handleRemoveItem('certifications', index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() => handleAddItem('certifications')}
          variant="outlined"
          color="primary"
        >
          Add Certification
        </Button>
      </Box>
    </Box>
  );
};

export default ResumeForm; 