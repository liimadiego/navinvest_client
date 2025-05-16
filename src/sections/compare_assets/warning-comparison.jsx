import React, { useState } from 'react';
import { Alert, Box, Button, Card, Typography } from '@mui/material';

export function WarningComparison({ text }) {
    return (
        <Alert severity="warning">{text}</Alert>
    );
}