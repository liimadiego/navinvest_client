import React, { useState } from 'react';
import axios from 'src/lib/axios'
import {
    Box,
    Container,
    Typography,
    TextField,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Card,
    CardContent,
    Chip,
    Button,
    Grid,
    Paper,
    Divider,
    FormGroup,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    Link
} from '@mui/material';
import {
    CreditCard as CreditCardIcon,
    Security as SecurityIcon,
    CheckCircle as CheckCircleIcon,
    Pix as PixIcon,
} from '@mui/icons-material';

export function Payment() {
    const [billingPreference, setBillingPreference] = useState('yearly');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    const ANNUAL_PRICE = 575.88;
    const MONTHLY_PRICE = 59.99;
    const endOfTrialDate = new Date();
    const [isAddressLoading, setIsAddressLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    endOfTrialDate.setDate(endOfTrialDate.getDate() + 7);
    //xx de maio de 2025
    const formattedTrialEndDate = `${endOfTrialDate.getDate()} de ${endOfTrialDate.toLocaleString('default', { month: 'long' })} de ${endOfTrialDate.getFullYear()}`;

    const [formData, setFormData] = useState({
        email: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        fullName: '',
        cpf: '',
        streetAddress: '',
        zipCode: '',
        complement: '',
        addressNumber: '',
        neighborhood: '',
        agreeToTerms: false,
        nextDueDate: endOfTrialDate.toISOString().split('T')[0]
    });

    const handleInputChange = (field) => (event) => {
        if (field === 'cardNumber') {
            setFormData({
                ...formData,
                [field]: formatCardNumber(event.target.value)
            });
            return;
        }

        if (field === 'cvv') {
            setFormData({
                ...formData,
                [field]: formatCvv(event.target.value)
            });
            return;
        }

        if (field === 'zipCode') {
            setFormData({
                ...formData,
                [field]: formatZipCode(event.target.value)
            });
            return;
        }

        if (field === 'cpf') {
            setFormData({
                ...formData,
                [field]: formatCpf(event.target.value)
            });
            return;
        }

        setFormData({
            ...formData,
            [field]: event.target.value
        });
    };

    const formatCardNumber = (number) => {
        return number.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    }

    const formatCvv = (cvv) => {
        return cvv.replace(/\D/g, '').slice(0, 4);
    }

    const handleCheckboxChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.checked
        });
    };

    const formatZipCode = (zip) => {
        // viacep.com.br/ws/01001000/json/
        if (zip.length === 9) {
            setIsAddressLoading(true);
            fetch(`https://viacep.com.br/ws/${zip.replace(/-/g, '')}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        setIsAddressLoading(false);
                        alert('CEP inválido. Por favor, verifique e tente novamente.');
                    } else {
                        setFormData({
                            ...formData,
                            streetAddress: data.logradouro,
                            neighborhood: data.bairro,
                            zipCode: zip.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9),
                            addressNumber: '',
                            complement: ''
                        });
                        setIsAddressLoading(false);
                    }
                })
                .catch(error => {
                    setIsAddressLoading(false);
                    console.error('Erro ao buscar CEP:', error);
                    alert('Erro ao buscar CEP. Por favor, tente novamente mais tarde.');
                });
        }

        return zip.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
    }

    const validateCpf = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false; // Invalid CPF
        }
        let sum = 0;
        let remainder;
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }
        if (remainder !== parseInt(cpf.substring(9, 10))) {
            return false; // Invalid CPF
        }
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }
        if (remainder !== parseInt(cpf.substring(10, 11))) {
            return false; // Invalid CPF
        }
        return true; // Valid CPF
    }

    const formatCpf = (cpf) => {
        return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
    }

    const handleSubmitCheckoutForm = () => {
        if (!formData.email) {
            alert('Por favor, preencha seu email.');
            return;
        }

        if (paymentMethod === 'credit_card' && (!formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv)) {
            alert('Por favor, preencha todos os campos do cartão de crédito.');
            return;
        }

        if (!formData.cpf || !formData.streetAddress || !formData.zipCode || !formData.fullName) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!validateCpf(formData.cpf)) {
            alert('CPF inválido. Por favor, verifique e tente novamente.');
            return;
        }

        if (!formData.agreeToTerms) {
            alert('Você deve concordar com os termos e condições para continuar.');
            return;
        }

        axios.post('/checkout/subscribe', {
            general: {
                email: formData.email,
                fullName: formData.fullName,
                cpf: formData.cpf.replace(/\D/g, ''),
                billingPreference: billingPreference,
                paymentMethod: paymentMethod,
                nextDueDate: formData.nextDueDate,
            },
            creditCard: {
                cardNumber: formData.cardNumber.replace(/\s/g, ''),
                expiryMonth: formData.expiryMonth,
                expiryYear: `20${formData.expiryYear}`,
                cvv: formData.cvv,
            },
            billingAddress: {
                streetAddress: formData.streetAddress,
                zipCode: formData.zipCode.replace(/-/g, ''),
                addressNumber: formData.addressNumber,
                complement: formData.complement,
                neighborhood: formData.neighborhood,
            }
        })
            .then(response => {
                if (response.data.success) {
                    alert('Checkout realizado com sucesso! Você receberá um email de confirmação em breve.');
                    // Redirect to success page or dashboard
                }
                else {
                    alert('Erro ao processar o checkout. Por favor, tente novamente mais tarde.');
                }
            })
            .catch(error => {
                console.error('Erro ao processar o checkout:', error);
                alert('Erro ao processar o checkout. Por favor, tente novamente mais tarde.');
            });
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Left Column - Form */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h3" component="h1" gutterBottom fontWeight="500">
                            É hora de conhecer o Navi.
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Acesse seu assistente de investimentos com IA em minutos.
                        </Typography>
                    </Box>

                    {/* Primary Contact Info */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" component="h2" gutterBottom fontWeight="medium">
                            Informações de contato principal
                        </Typography>
                        <TextField
                            fullWidth
                            label="Seu Email*"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            helperText="Este será o seu login da conta Navinvest."
                            sx={{ mt: 2 }}
                        />
                    </Box>

                    {/* Billing Preference */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" component="h2" gutterBottom fontWeight="medium">
                            Preferência de cobrança
                        </Typography>
                        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                            <RadioGroup
                                value={billingPreference}
                                onChange={(e) => setBillingPreference(e.target.value)}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                position: 'relative',
                                                cursor: 'pointer',
                                                '&:hover': { boxShadow: 2 }
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                    <Box>
                                                        <FormControlLabel
                                                            value="yearly"
                                                            control={<Radio />}
                                                            label={
                                                                <Box>
                                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                                        ANUAL (20% OFF)
                                                                    </Typography>
                                                                    <Typography variant="h6" fontWeight="bold">
                                                                        R${ANNUAL_PRICE.toString().replace('.', ',')}/ano
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Com período de teste gratuito de 7 dias
                                                                    </Typography>
                                                                </Box>
                                                            }
                                                        />
                                                    </Box>
                                                    <Chip
                                                        label="Melhor valor"
                                                        size="small"
                                                        color="success"
                                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': { boxShadow: 2 }
                                            }}
                                        >
                                            <CardContent>
                                                <FormControlLabel
                                                    value="monthly"
                                                    control={<Radio />}
                                                    label={
                                                        <Box>
                                                            <Typography variant="subtitle1" fontWeight="medium">
                                                                PAGUE CONFORME USA
                                                            </Typography>
                                                            <Typography variant="h6" fontWeight="bold">
                                                                R${MONTHLY_PRICE.toString().replace('.', ',')}/mês
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Com período de teste gratuito de 7 dias
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" component="h2" gutterBottom fontWeight="medium">
                            Método de pagamento
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <FormControlLabel
                                        value="credit_card"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CreditCardIcon />
                                                <Typography>Cartão de Crédito</Typography>
                                            </Box>
                                        }
                                        sx={{ mb: 2 }}
                                    />
                                    <FormControlLabel
                                        value="pix"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PixIcon />
                                                <Typography>Pix</Typography>
                                            </Box>
                                        }
                                        sx={{ mb: 2 }}
                                    />
                                </Box>
                            </RadioGroup>
                        </FormControl>

                        {paymentMethod !== 'pix' ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nome*"
                                        value={formData.fullName}
                                        onChange={handleInputChange('fullName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="CPF*"
                                        value={formData.cpf}
                                        onChange={handleInputChange('cpf')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Número do Cartão"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange('cardNumber')}
                                        placeholder="1234 5678 9012 3456"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Mês</InputLabel>
                                        <Select
                                            value={formData.expiryMonth}
                                            onChange={handleInputChange('expiryMonth')}
                                            label="Mês"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Ano</InputLabel>
                                        <Select
                                            value={formData.expiryYear}
                                            onChange={handleInputChange('expiryYear')}
                                            label="Ano"
                                        >
                                            {Array.from({ length: 10 }, (_, i) => (
                                                <MenuItem key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                                                    {String(new Date().getFullYear() + i).slice(-2)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        label="CVV"
                                        value={formData.cvv}
                                        onChange={handleInputChange('cvv')}
                                        placeholder="123"
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nome*"
                                        value={formData.fullName}
                                        onChange={handleInputChange('fullName')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="CPF*"
                                        value={formData.cpf}
                                        onChange={handleInputChange('cpf')}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <SecurityIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Seus dados estão seguros. Usamos criptografia SSL e somos compatíveis com PCI DSS.
                            </Typography>
                        </Box>
                    </Box>

                    {/* Billing Address */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" component="h2" gutterBottom fontWeight="medium">
                            Endereço de cobrança
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="CEP*"
                                    value={formData.zipCode}
                                    onChange={handleInputChange('zipCode')}
                                    disabled={isAddressLoading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Endereço*"
                                    value={formData.streetAddress}
                                    onChange={handleInputChange('streetAddress')}
                                    disabled={isAddressLoading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Número*"
                                    value={formData.addressNumber}
                                    onChange={handleInputChange('addressNumber')}
                                    disabled={isAddressLoading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Complemento"
                                    value={formData.complement}
                                    onChange={handleInputChange('complement')}
                                    disabled={isAddressLoading}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Terms Agreement */}
                    <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.agreeToTerms}
                                    onChange={handleCheckboxChange('agreeToTerms')}
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    Concordo com os{' '}
                                    <Link href="/termos-servicos" underline="always" target="_blank">
                                        termos e condições
                                    </Link>{' '}
                                    e{' '}
                                    <Link href="/politica-privacidade" underline="always" target="_blank">
                                        política de privacidade
                                    </Link> da Navinvest.
                                </Typography>
                            }
                        />
                    </Box>

                    {/* Start Button */}
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!formData.agreeToTerms}
                        sx={{ py: 1.5, fontSize: '1rem' }}
                        onClick={handleSubmitCheckoutForm}
                    >
                        COMEÇAR AGORA
                    </Button>
                </Grid>

                {/* Right Column - Order Summary */}
                <Grid item xs={12} md={4}>
                    <Box sx={{
                        position: { xs: 'static', md: 'sticky' },
                        top: { md: 80 },
                        height: 'fit-content'
                    }}>
                        <Paper elevation={1} sx={{ p: 3, backgroundColor: 'background.light' }}>
                            <Typography variant="h6" component="h3" gutterBottom fontWeight="medium">
                                Resumo do Pedido
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1" fontWeight="medium">
                                        Assinatura {billingPreference === 'yearly' ? 'Anual' : 'Mensal'} Navinvest
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        R${(billingPreference === 'yearly' ? ANNUAL_PRICE : MONTHLY_PRICE).toString().replace('.', ',')}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                                    Inclui:
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    {[
                                        'Assistente de investimentos com IA (24h)',
                                        'Comparação de ativos, Momento da empresa, Importador inteligente de carteira e Jornal de investimentos (tudo com Inteligência Artificial)',
                                        'Dados de comparação e avaliação de investimentos lado a lado',
                                        'Pesquisa de investimentos em linguagem natural e construção de portfólio'
                                    ].map((feature, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                            <CheckCircleIcon fontSize="small" color="success" sx={{ mt: 0.5, flexShrink: 0 }} />
                                            <Typography variant="body2">
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* <Link href="#" variant="body2" sx={{ display: 'block', textAlign: 'right', mb: 2 }}>
                                    Adicionar código de desconto
                                </Link> */}

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">
                                        Subtotal
                                    </Typography>
                                    <Typography variant="body2">
                                        R${(billingPreference === 'yearly' ? ANNUAL_PRICE : MONTHLY_PRICE).toString().replace('.', ',')}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">
                                        Período de teste gratuito de 7 dias
                                    </Typography>
                                    <Typography variant="body2">
                                        - R${(billingPreference === 'yearly' ? ANNUAL_PRICE : MONTHLY_PRICE).toString().replace('.', ',')}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Devido hoje
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        R$0,00
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                                    Você será cobrado em R${(billingPreference === 'yearly' ? ANNUAL_PRICE : MONTHLY_PRICE).toString().replace('.', ',')} automaticamente ao final do seu período de teste gratuito de 7 dias em {formattedTrialEndDate}, a menos que cancele antes dessa data. Esta é uma cobrança recorrente e continuará no valor e frequência estabelecidos, a menos que você cancele. Para cancelar sua assinatura, acesse Gerenciar Assinaturas no seu perfil.
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Desenvolvido por
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        Navinvest
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}