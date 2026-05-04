import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Paper, TextField, Button, Typography, Alert, 
  AppBar, Toolbar, Box, Card, CardContent 
} from '@mui/material';

const API_URL = 'http://localhost:5000';

export default function App() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [payment, setPayment] = useState({ 
    amount: '', 
    iban: '', 
    cardNumber: '', 
    cvv: '', 
    expiry: '' 
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [view, setView] = useState('login');

  const handleAuth = async () => {
    try {
      setMessage('');
      const endpoint = view === 'register' ? 'register' : 'login';
      const body = view === 'register' ? form : { email: form.email, password: form.password };
      const res = await axios.post(`${API_URL}/api/auth/${endpoint}`, body);
      setUser(res.data.user);
      setMessage(`✅ ${view === 'register' ? 'Registered!' : 'Logged in!'} Welcome ${res.data.user.name}`);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePayment = async () => {
    try {
      setMessage('');
      const res = await axios.post(`${API_URL}/api/payment`, payment);
      setMessage(`💳 ${res.data.message} ID: ${res.data.paymentId}`);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.error || 'Payment failed'}`);
    }
  };

  const logout = () => {
    setUser(null); 
    setForm({}); 
    setPayment({ amount: '', iban: '', cardNumber: '', cvv: '', expiry: '' }); 
    setMessage(''); 
  };

  if (user) {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Customer Portal</Typography>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ mt: 4 }}>
          {/* USER DASHBOARD */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              👋 Welcome {user.name}!
            </Typography>
            <Typography color="textSecondary">
              Email: {user.email}
            </Typography>
          </Paper>

          {/* FULL INTERNATIONAL PAYMENT FORM */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              💳 International Payment Form
            </Typography>
            
            {/* AMOUNT */}
            <TextField
              fullWidth
              label="Amount (R) *"
              type="number"
              inputProps={{ step: '0.01', min: '0.01' }}
              placeholder="99.99"
              value={payment.amount}
              onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
              sx={{ mb: 3 }}
            />
            
            {/* IBAN */}
            <TextField
              fullWidth
              label="IBAN *"
              placeholder="DE89370400440532013000"
              value={payment.iban}
              onChange={(e) => setPayment({ ...payment, iban: e.target.value })}
              sx={{ mb: 3 }}
            />
            
            {/* CARD NUMBER */}
            <TextField
              fullWidth
              label="Card Number *"
              placeholder="1234 5678 9012 3456"
              value={payment.cardNumber}
              onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
              sx={{ mb: 3 }}
            />
            
            {/* CVV + EXPIRY ROW */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="CVV *"
                placeholder="123"
                value={payment.cvv}
                onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                sx={{ flex: 1 }}
                inputProps={{ maxLength: 4 }}
              />
              <TextField
                label="Expiry (MM/YY) *"
                placeholder="12/25"
                value={payment.expiry}
                onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                sx={{ width: 140 }}
              />
            </Box>
            
            {/* PAY BUTTON */}
            <Button 
              fullWidth
              variant="contained" 
              size="large"
              color="success"
              onClick={handlePayment}
              disabled={!payment.amount || !payment.iban || !payment.cardNumber}
              sx={{ py: 2, fontSize: '1.1rem' }}
            >
              💳 Pay Securely R{payment.amount || 0}
            </Button>
            
            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              RegEx validated: Amount/IBAN/Card/CVV/Expiry
            </Typography>
          </Paper>
        </Container>
        
        {message && (
          <Container maxWidth="md">
            <Alert severity={message.includes('✅') || message.includes('💳') ? 'success' : 'error'}>
              {message}
            </Alert>
          </Container>
        )}
      </div>
    );
  }

  // LOGIN/REGISTER
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          {view === 'register' ? '👤 Register' : '🔐 Login'}
        </Typography>
        
        {view === 'register' && (
          <TextField
            fullWidth
            label="Full Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ mb: 3 }}
          />
        )}
        
        <TextField
          fullWidth
          label="Email *"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          sx={{ mb: 3 }}
        />
        
        <TextField
          fullWidth
          label="Password *"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          sx={{ mb: 4 }}
        />
        
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleAuth}
          disabled={!form.email || !form.password}
          sx={{ mb: 2, py: 1.5 }}
        >
          {view === 'register' ? 'Create Account' : 'Sign In'}
        </Button>
        
        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => setView(view === 'login' ? 'register' : 'login')}
          sx={{ py: 1.5 }}
        >
          {view === 'register' ? 'Have Account? Login' : "New? Register Now"}
        </Button>
        
        {message && (
          <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mt: 3 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}