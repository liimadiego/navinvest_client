import React, { useRef } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";

export default function CardInput({ formData, handleInputChange }) {
    const cardRef = useRef();
    const monthRef = useRef();
    const yearRef = useRef();
    const cvvRef = useRef();

    // Função para avançar o foco conforme a quantidade de dígitos
    const handleCardInput = (e) => {
        const { value } = e.target;
        handleInputChange("cardNumber")(e);
        // Vai para o mês quando chegar em 16 dígitos
        if (value.replace(/\D/g, "").length >= 16) {
            monthRef.current.focus();
        }
    };

    const handleMonthInput = (e) => {
        handleInputChange("expiryMonth")(e);
        if (e.target.value.length === 2) {
            yearRef.current.focus();
        }
    };

    const handleYearInput = (e) => {
        handleInputChange("expiryYear")(e);
        if (e.target.value.length === 2) {
            cvvRef.current.focus();
        }
    };

    const handleCvvInput = (e) => {
        handleInputChange("cvv")(e);
    };

    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                padding: "6px 12px",
                gap: 1,
                width: "100%"
            }}
        >
            {/* Card Icon + Card Number */}
            <TextField
                inputRef={cardRef}
                label=""
                placeholder="Número do Cartão"
                variant="standard"
                value={formData.cardNumber}
                onChange={handleCardInput}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <CreditCardIcon fontSize="small" />
                        </InputAdornment>
                    ),
                    disableUnderline: true,
                    style: { fontSize: 18, minWidth: 140 },
                    inputProps: { maxLength: 19, inputMode: "numeric" },
                }}
                sx={{
                    flex: 2,
                    ".MuiInputBase-input": { padding: "8px 0" },
                }}
            />

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: 100,
                }}>
                    {/* MM */}
                    <TextField
                        inputRef={monthRef}
                        label=""
                        placeholder="MM"
                        variant="standard"
                        value={formData.expiryMonth}
                        onChange={handleMonthInput}
                        InputProps={{
                            disableUnderline: true,
                            style: { width: 50, fontSize: 18, textAlign: "center" },
                            inputProps: { maxLength: 2, inputMode: "numeric" },
                        }}
                        sx={{ flex: 0.7, ".MuiInputBase-input": { padding: "8px 0", textAlign: "center" } }}
                    />

                    <span style={{ color: "#888", fontSize: 18, margin: "0 2px" }}>/</span>

                    {/* YY */}
                    <TextField
                        inputRef={yearRef}
                        label=""
                        placeholder="AA"
                        variant="standard"
                        value={formData.expiryYear}
                        onChange={handleYearInput}
                        InputProps={{
                            disableUnderline: true,
                            style: { width: 30, fontSize: 18, textAlign: "center" },
                            inputProps: { maxLength: 2, inputMode: "numeric" },
                        }}
                        sx={{ flex: 0.7, ".MuiInputBase-input": { padding: "8px 0", textAlign: "center" } }}
                    />
                </Box>

                {/* CVV */}
                <TextField
                    inputRef={cvvRef}
                    label=""
                    placeholder="CVV"
                    variant="standard"
                    value={formData.cvv}
                    onChange={handleCvvInput}
                    InputProps={{
                        disableUnderline: true,
                        style: { width: 38, fontSize: 18, textAlign: "center" },
                        inputProps: { maxLength: 4, inputMode: "numeric" },
                    }}
                    sx={{ flex: 0.9, ".MuiInputBase-input": { padding: "8px 0", textAlign: "center" } }}
                />
            </Box>
        </Box>
    );
}
