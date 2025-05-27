import { Box } from "@mui/material";
import { Payment } from "../payment";
import { Pix } from "../pix";
import { useState } from "react";

export function PaymentView() {
    const [pixKey, setPixKey] = useState("");

    return (
        <Box>
            {pixKey != "" ? <Pix pixKey={pixKey} /> : <Payment setPixKey={setPixKey} />}
        </Box>
    );
}