'use client';
import React, { useRef } from 'react';
import {
  Typography,
  Box,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Backdrop
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Icon } from '../../DesignSystem';
import OverlaySpinner from '../../DesignSystem/components/OverlaySpinner';
import { useDispatch } from '../../Uberedux';
import { stepsLinkedin, promptLinkedin } from '../prompts/linkedin';
import { fetchPrompt, useSlice } from '../../Prompt';

export default function LinkedInLookup() {
  const dispatch = useDispatch();
  const slice = useSlice();
  const fetching = slice && typeof slice === 'object' && 'fetching' in slice ? slice.fetching : false;
  
  
  const [input, setInput] = React.useState('');
  const [helperText, setHelperText] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
    const handleReset = () => {
      setInput('');
      setHelperText(validate(''));
      setIsValid(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

  const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[A-Za-z0-9_-]+\/?/i;

  // Effect: if completion exists, set activeStep to 2
  React.useEffect(() => {
    if (slice && slice.response && slice.response.completion) {
      setActiveStep(2);
    }
  }, [slice && slice.response && slice.response.completion]);

  // Safely parse completion JSON string
  let completionObj = null;
  if (slice && slice.response && typeof slice.response.completion === 'string') {
    try {
      completionObj = JSON.parse(slice.response.completion);
    } catch (e) {
      completionObj = null;
    }
  }

  const analyse = () => {
    dispatch(fetchPrompt(input, promptLinkedin({ linkedin_url: input })));
  };

  const validate = (val: string) => {
    if (!val) return '';
    if (!linkedInRegex.test(val)) return 'Invalid LinkedIn profile URL.';
    return '';
  };

  return (
    <>
      {/* Modal blocking overlay with subtle custom spinner */}
      <Backdrop open={!!fetching} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
        <OverlaySpinner />
      </Backdrop>

      <Accordion variant="outlined" sx={{ mb: 2 }}>
        
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="stepper-content"
          id="stepper-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon="linkedin" color={'primary'} />
            <Typography sx={{ml:1}} variant="body2">
              AI in action
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Stepper 
            activeStep={activeStep}
            orientation="vertical"
          >
            <Step>
              <StepLabel>  
                <Typography variant="h6">
                  {stepsLinkedin.step1.title}
                </Typography>
              </StepLabel>
              <StepContent>
                
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    helperText={helperText}
                    value={input}
                    inputRef={inputRef}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInput(val);
                      setHelperText(validate(val));
                      setIsValid(linkedInRegex.test(val));
                    }}
                    inputProps={{style: {
                      fontSize:11,
                    }}}
                  />
                </Box>
                <Box sx={{ my: 0}}>
                  <Button
                    variant="contained"
                    endIcon={<Icon icon="down" />}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={!isValid}
                    onClick={() => setActiveStep(1)}
                  >
                    {stepsLinkedin.step1.cta}
                  </Button>

                  <IconButton
                    sx={{ mt: 1 }}
                    color='primary'
                    aria-label="Clear"
                    onClick={handleReset}
                    edge="end"
                  >
                    <Icon icon="reset" />
                  </IconButton>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>
                <Typography variant="h6">
                  {stepsLinkedin.step2.title}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="subtitle2">
                  {stepsLinkedin.step2.description}
                </Typography>
                <Box sx={{ my: 2, display: 'flex', gap: 1 }}>

                  <IconButton
                    color='primary'
                    aria-label="Back"
                    onClick={() => setActiveStep(0)}
                  >
                    <Icon icon="left" />
                  </IconButton>

                  
                  <Button
                    variant="contained"
                    endIcon={<Icon icon="down" />}
                    disabled={!isValid}
                    onClick={analyse}
                  >
                    {stepsLinkedin.step2.cta}
                  </Button>
                </Box>
                <Accordion sx={{ mb: 2 }} variant='outlined'>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="prompt-content"
                    id="prompt-header"
                  >
                    <Typography variant="subtitle2">
                      What is the prompt?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13 }}>
                      {/* Output the generated prompt using promptLinkedin with the input value */}
                      {isValid && input
                        ? promptLinkedin({ linkedin_url: input })
                        : stepsLinkedin.step2.description}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>
                <Typography variant="h6">
                  {stepsLinkedin.step3.title}
                </Typography>
              </StepLabel>
              <StepContent>
                {completionObj && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h5" gutterBottom>
                      {completionObj.name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {completionObj.jobTitle} {completionObj.company && (
                        <>
                          at{' '}
                          {completionObj.companyWebsite ? (
                            <a href={completionObj.companyWebsite} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                              {completionObj.company}
                            </a>
                          ) : completionObj.company}
                        </>
                      )}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {completionObj.summary}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                      {completionObj.tags && completionObj.tags.map((tag: string) => (
                        <Box key={tag} sx={{ px: 1, py: 0.5, borderRadius: 1, border: 1, borderColor: 'divider', fontSize: 12 }}>
                          {tag}
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Category:</strong> {completionObj.category}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Score:</strong> {completionObj.score}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <strong>Recommendation:</strong> {completionObj.recommendation}
                    </Typography>
                  </Box>
                )}
              </StepContent>
            </Step>
          </Stepper>
        </AccordionDetails>
      </Accordion>
    </>
    );
}

/*
<Typography variant="subtitle2">
                  {stepsLinkedin.step1.description}
                </Typography>
*/