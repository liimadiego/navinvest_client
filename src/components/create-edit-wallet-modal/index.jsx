import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    InputAdornment,
    Typography,
} from '@mui/material';

export default function AddEditWalletModal({ open, onClose, onSave, editData, isLoading }) {
    const objectiveOptions = [
        { value: 'Dividendos', label: 'Dividendos' },
        { value: 'Longo Prazo', label: 'Longo Prazo' },
        { value: 'Aposentadoria', label: 'Aposentadoria' },
        { value: 'Valorização de Capital', label: 'Valorização de Capital' },
        { value: 'Renda Passiva', label: 'Renda Passiva' },
        { value: 'Especulação', label: 'Especulação' },
        { value: 'Proteção Patrimonial', label: 'Proteção Patrimonial' },
        { value: 'Diversificação Global', label: 'Diversificação Global' },
    ];

    const [errors, setErrors] = useState({});
    const [objective, setObjective] = useState(null);
    const [name, setName] = useState("");

    useEffect(() => {
        if (!open) {
            setObjective(null);
            setName("");
            setErrors({});
            return;
        }

        if (editData) {
            setObjective(editData.objective);
        } else {
            setObjective(objectiveOptions[0].value);
        }
    }, [open, editData]);

    const handleSave = async () => {
        setErrors({});
        const newErrors = {};

        if (!name) {
            newErrors.name = "Campo obrigatório";
        }

        if (!objective) {
            newErrors.objective = "Campo obrigatório";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await onSave({
            errors: newErrors, data: {
                id: editData ? editData.id : null,
                name,
                objective,
            }
        });

        setName("");
        setObjective(objectiveOptions[0].value);
        setErrors({});

    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{editData ? "Editar" : "Adicionar"} Carteira</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nome da carteira"
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    sx={{ mt: 1, mb: 2 }}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                />

                <TextField
                    select
                    label="Objetivo"
                    fullWidth
                    onChange={(e) => setObjective(e.target.value)}
                    SelectProps={{
                        native: true,
                    }}
                    sx={{ mt: 1, mb: 2 }}
                >
                    <option value="" disabled>
                        Selecione um objetivo
                    </option>
                    {objectiveOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
                <Button loading={isLoading} loadingPosition="end" onClick={handleSave} variant="contained" color="primary">
                    {editData ? "Salvar" : "Adicionar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

