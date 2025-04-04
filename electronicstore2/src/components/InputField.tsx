import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputFieldProps extends Omit<TextFieldProps, 'variant' | 'error'> {
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ error, ...props }) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      error={!!error}
      helperText={error}
      {...props}
    />
  );
};

export default InputField; 