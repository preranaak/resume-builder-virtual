import React, { useRef } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { Save as SaveIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { useForm } from '../hooks/useForm';


const ResumePreview = ({  onSave }) => {
  const componentRef = useRef();

  const [ data ] = useForm();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${data.personalDetails.name || 'Resume'}_${new Date().toISOString().split('T')[0]}`,
    removeAfterPrint: true,
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      }
    `,
    onBeforeGetContent: () => {
      if (!componentRef.current) {
        throw new Error('Content ref is not set');
      }
      return Promise.resolve();
    }
  });

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Action Buttons - These will be hidden in print */}
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          position: 'sticky',
          top: 20,
          zIndex: 1,
          mb: 2,
          justifyContent: 'flex-end',
          '@media print': {
            display: 'none'
          }
        }}
      >
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Save Progress
        </Button>
        <Button
          variant="contained"
          startIcon={<PdfIcon />}
          onClick={handlePrint}
          sx={{
            bgcolor: 'secondary.main',
            '&:hover': {
              bgcolor: 'secondary.dark',
            },
          }}
        >
          Download PDF
        </Button>
      </Stack>

      {/* Resume Preview */}
      <Paper
        ref={componentRef}
        sx={{
          p: 4,
          bgcolor: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          '@media print': {
            boxShadow: 'none',
            margin: 0,
            padding: '20px',
            backgroundColor: 'white',
            color: 'black',
          },
        }}
      >
        {/* Header with Photo */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
          '@media print': {
            breakInside: 'avoid',
          }
        }}>
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{
                '@media print': {
                  color: 'black',
                  fontSize: '24pt',
                }
              }}
            >
              {data.personalDetails.name || 'Your Name'}
            </Typography>
            <Typography 
              color="textSecondary" 
              paragraph
              sx={{
                '@media print': {
                  color: 'black',
                }
              }}
            >
              {data.personalDetails.email && (
                <>Email: {data.personalDetails.email}<br /></>
              )}
              {data.personalDetails.phone && (
                <>Phone: {data.personalDetails.phone}<br /></>
              )}
              {data.personalDetails.location && (
                <>Location: {data.personalDetails.location}<br /></>
              )}
              {data.personalDetails.linkedin && (
                <>Linkedin: {data.personalDetails.linkedin}<br /></>
              )}
              {data.personalDetails.github && (
                <>Github: {data.personalDetails.github}<br /></>
              )}
              {data.personalDetails.portfolio && (
                <>Portfolio: {data.personalDetails.portfolio}<br /></>
              )}
              {data.personalDetails.address && (
                <>Address: {data.personalDetails.address}</>
              )}
              {data.personalDetails.summary && (
                <>Summary: {data.personalDetails.summary}</>
              )}
            </Typography>
          </Box>
          {data.personalDetails.photo && (
            <Box
              component="img"
              src={data.personalDetails.photo}
              alt="Profile"
              sx={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: '50%',
                ml: 2,
                '@media print': {
                  width: '80px',
                  height: '80px',
                  printColorAdjust: 'exact',
                  WebkitPrintColorAdjust: 'exact',
                },
              }}
            />
          )}
        </Box>

        {/* Work Experience */}
        {data.workExperience?.length > 0 && (
          <Box sx={{ 
            mb: 3,
            '@media print': {
              breakInside: 'avoid',
            }
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                '@media print': {
                  color: 'black',
                  fontWeight: 'bold',
                }
              }}
            >
              Work Experience
            </Typography>
            {data.workExperience.map((exp, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 2,
                  '@media print': {
                    breakInside: 'avoid',
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.position} at {exp.company}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </Typography>
                <Typography variant="body2">{exp.description}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <Box sx={{ 
            mb: 3,
            '@media print': {
              breakInside: 'avoid',
            }
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                '@media print': {
                  color: 'black',
                  fontWeight: 'bold',
                }
              }}
            >
              Projects
            </Typography>
            {data.projects.map((project, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 2,
                  '@media print': {
                    breakInside: 'avoid',
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {project.name}
                </Typography>
                <Typography variant="body2">{project.description}</Typography>
                {project.technologies && (
                  <Typography variant="body2" color="textSecondary">
                    Technologies: {project.technologies}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <Box sx={{ 
            mb: 3,
            '@media print': {
              breakInside: 'avoid',
            }
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                '@media print': {
                  color: 'black',
                  fontWeight: 'bold',
                }
              }}
            >
              Education
            </Typography>
            {data.education.map((edu, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 2,
                  '@media print': {
                    breakInside: 'avoid',
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {edu.degree} - {edu.institution}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {edu.field && <>Field of Study: {edu.field}<br /></>}
                  {edu.graduationDate && <>Graduation Date: {edu.graduationDate}<br /></>}
                  {edu.gpa && <>GPA: {edu.gpa}</>}
                </Typography>
                {edu.description && (
                  <Typography variant="body2">{edu.description}</Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Skills Section */}
        <Box sx={{ 
          mb: 3,
          '@media print': {
            breakInside: 'avoid',
          }
        }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: 'primary.main',
              '@media print': {
                color: 'black',
                fontWeight: 'bold',
              }
            }}
          >
            Skills
          </Typography>
          <Box sx={{ pl: 2 }}>
            {data.skills.technical && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Technical Skills:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {data.skills.technical}
                </Typography>
              </Box>
            )}
            {data.skills.soft && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Soft Skills:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {data.skills.soft}
                </Typography>
              </Box>
            )}
            {!data.skills.technical && !data.skills.soft && (
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                Add your skills here
              </Typography>
            )}
          </Box>
        </Box>

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <Box sx={{ 
            mb: 3,
            '@media print': {
              breakInside: 'avoid',
            }
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                '@media print': {
                  color: 'black',
                  fontWeight: 'bold',
                }
              }}
            >
              Certifications
            </Typography>
            {data.certifications.map((cert, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 1,
                  '@media print': {
                    breakInside: 'avoid',
                  }
                }}
              >
                <Typography variant="subtitle1">
                  {cert.name} ({cert.issuer})
                </Typography>
                {cert.date && (
                  <Typography variant="body2" color="textSecondary">
                    Issued: {cert.date}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ResumePreview; 